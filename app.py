import copy
import json
import os
import sys
import subprocess
import time
from datetime import datetime

import jsonpickle
import numpy
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.preprocessing import minmax_scale

import compute_descriptive_statistics as cds
import global_methods as dr
import global_variables as gv

try:
    import get_data_from_server
except ImportError:
    pass;

start_time = time.time()

app = Flask(__name__)

# merged_all = get_data_from_server.get_dataframe_from_server()

merged_all = pd.read_csv(os.path.dirname(sys.argv[0]) + os.path.sep + "resources" + os.path.sep + "Soils.csv",
                         keep_default_na=False,
                         na_values=[""])
merged_all = merged_all.loc[:, ~merged_all.columns.duplicated()]  # remove duplicate rows

gv.initial_length_of_data_rows = len(merged_all)

# get all data types
dataTypeSeries = merged_all.dtypes

# Define command and arguments
command = 'Rscript'


def is_number(s):
    try:
        complex(s)  # for int, long, float and complex
    except ValueError:
        return False
    return True


class ColumnElementsClass(object):
    def __init__(self, header, column_id, data_type, col_values, descriptive_statistics, col_values_imputed):
        self.header = header
        self.id = column_id
        self.data_type = data_type
        self.column_values = col_values_imputed
        self.column_values_not_imputed = col_values
        self.key_datatype_change = False
        self.key_removed_during_data_formatting = []
        self.descriptive_statistics = descriptive_statistics
        self.type_element_group = 'dimension'

    def __str__(self):
        return 'ColumnElementsClass %s %s %s (%d items, %d ni)' % (
        str(self.id), self.header, self.data_type, len(self.column_values), len(self.column_values_not_imputed));


class GroupElementsClass(object):
    def __init__(self, header, column_id, data_type, col_values, descriptive_statistics, col_values_imputed,
                 principal_component_one_or_two, contributing_variables, eigenvalue, percentage_of_variance,
                 cumulative_percentage_of_variance, loading_variables, index_round):
        a_list = list(minmax_scale(col_values_imputed, feature_range=[-1, 1], axis=0))
        list_of_floats = [float(item) for item in a_list]
        self.header = header
        self.id = column_id
        self.data_type = data_type
        self.column_values = list_of_floats
        self.column_values_not_imputed = col_values
        self.key_datatype_change = False
        self.key_removed_during_data_formatting = []
        self.descriptive_statistics = descriptive_statistics
        self.type_element_group = 'group'
        self.PCone_or_two = principal_component_one_or_two
        self.contributing_variables = contributing_variables
        self.eigenvalue = eigenvalue
        self.percentage_of_variance = percentage_of_variance
        self.cumulative_percentage_of_variance = cumulative_percentage_of_variance
        self.loading_variables = loading_variables
        self.index_round = index_round

    def __str__(self):
        return 'GroupElementsClass %s %s %s (%d items, %d ni)' % (
        str(self.id), self.header, self.data_type, len(self.column_values), len(self.column_values_not_imputed));


# extra chars are not valid for json strings
def get_column_label(value):
    value = value.replace("ä", "ae").replace("ü", "ue").replace("ö", "oe").replace("ß", "ss")

    return value


class ContributionsClass(object):
    def __init__(self, column_id, value):
        self.column_id = column_id
        self.value = value


class DescriptiveStatisticsClass(object):
    def __init__(self, currentcol_descriptive, data_type, column_id, currentcol_descriptive_imputed):
        current_col_without_nan = [current_val for current_val in currentcol_descriptive_imputed if
                                   str(current_val) != 'nan']

        stdev = 0
        varnc = 0

        if len(current_col_without_nan) > 2:
            [stdev, varnc] = cds.compute_stdev(current_col_without_nan, data_type)

        self.normalized_values = currentcol_descriptive_imputed  # .tolist()
        self.coefficient_of_unalikeability = cds.compute_coefficient_of_unalikeability(currentcol_descriptive_imputed,
                                                                                       data_type, column_id)
        self.stDev = stdev
        self.varNC = varnc
        self.number_of_modes = cds.get_number_of_modes(currentcol_descriptive_imputed, data_type)
        self.missing_values_percentage = len(
            [x for x in currentcol_descriptive if (str(x) == 'nan' or str(x) == "None")]) / len(merged_all)
        self.coefficient_of_unalikeability_deviation = 0
        self.stDev_deviation = 0
        self.varNC_deviation = 0
        self.number_of_modes_deviation = 0
        self.missing_values_percentage_deviation = 0
        self.categories = []
        self.overall_deviation = 0

        if data_type == gv.id_data_type__categorical:
            self.categories = cds.get_categories(currentcol_descriptive_imputed)


# this creates the json object for more complex structures
def transform(my_object):
    jsonpickle.enable_fallthrough(False)
    jsonpickle.set_preferred_backend('simplejson')
    jsonpickle.set_encoder_options('simplejson', sort_keys=True, ignore_nan=True)
    return jsonpickle.encode(my_object, unpicklable=False)


class JsonTransformer(object):
    pass


# replace extra strings with _
def get_column_id(value):
    value = value.replace(" ", "_").replace(")", "_").replace("(", "_").replace("+", "_") \
        .replace("/", "_").replace("-", "_").replace("[", "_").replace("]", "_") \
        .replace(".", "_").replace("?", "_").replace("!", "_").replace("@", "_").replace("*", "_") \
        .replace("ä", "ae").replace("ü", "ue").replace("ö", "oe").replace("ß", "ss").replace('µ', 'mikro').replace(':',
                                                                                                                   '_')

    value = "id_" + value

    return value


def get_data_initially_formatted(index):
    this_data_type_parallel = gv.id_data_type__numerical
    current_col_parallel = merged_all[index]

    if current_col_parallel.dtype == float:
        if numpy.isnan(current_col_parallel.mean()):
            this_data_type_parallel = gv.id_data_type__categorical
    elif current_col_parallel.dtype == object:
        test_current_col_numeric_parallel = pd.to_numeric(current_col_parallel, errors='coerce')

        this_data_type_parallel = gv.id_data_type__categorical

        if ~numpy.isnan(test_current_col_numeric_parallel.mean()):
            current_col_parallel = test_current_col_numeric_parallel
            this_data_type_parallel = gv.id_data_type__numerical

        datatype_before = this_data_type_parallel
        for i in range(len(current_col_parallel)):

            number = current_col_parallel[i]

            if str(number) != 'nan' and number is not None and str(number).count('.') == 2:
                date_in_milisec = current_col_parallel[i]

                try:
                    date_in_milisec = datetime.strptime(str(number), "%d.%m.%Y").timestamp() * 1000
                    this_data_type_parallel = gv.id_data_type__date

                except (ValueError, TypeError):
                    this_data_type_parallel = datatype_before

                current_col_parallel.at[i] = date_in_milisec

            if number is None:
                current_col_parallel.at[i] = numpy.NaN

    if this_data_type_parallel == gv.id_data_type__date:

        current_col_name = current_col_parallel.name

        for date_index in range(len(current_col_parallel)):
            date = current_col_parallel.at[date_index]
            if is_number(date):
                current_col_parallel.at[date_index] = current_col_parallel.at[date_index]
            else:
                current_col_parallel.at[date_index] = numpy.NaN

        current_col_parallel.astype('float64')

    current_col_parallel_imputed = dr.fill_nan_values(current_col_parallel.to_frame())

    current_col_normalized = list(dr.normalize_values(current_col_parallel_imputed, this_data_type_parallel,
                                                      get_column_id(current_col_parallel_imputed.name)))

    col_descriptive_statistics = DescriptiveStatisticsClass(list(current_col_parallel), this_data_type_parallel,
                                                            get_column_id(current_col_parallel.name),
                                                            current_col_normalized)
    col_description = ColumnElementsClass(get_column_label(current_col_parallel.name),
                                          get_column_id(current_col_parallel.name),
                                          this_data_type_parallel, current_col_parallel.tolist(),
                                          col_descriptive_statistics, current_col_parallel_imputed.tolist())

    return col_description


gv.data_initially_formatted = [get_data_initially_formatted(i) for i in merged_all.columns]

datalist = []
for col in gv.data_initially_formatted:
    col_series = pd.Series(col.column_values)
    col_series = col_series.rename(col.id)

    datalist.append(col_series)

df = pd.concat(datalist, axis=1, keys=[s.name for s in datalist])

csv_file_name = os.path.dirname(sys.argv[0]) + os.path.sep + 'whole_data.csv'
path2script = os.path.dirname(sys.argv[0]) + os.path.sep + 'FAMD_iterative.R'

df.to_csv(csv_file_name, index=False)

# Build subprocess command
cmd = [command, path2script] + [csv_file_name]

# check_output will run the command and store to result
x = subprocess.check_output(cmd, universal_newlines=True)

x_json = json.loads(x)

endings_PC1_PC2 = ['PC1', 'PC2']

gv.columns_not_contributing = x_json[0]


def save_famd_r_values(current_group):
    dbg = False;

    list_PC_elements = []

    index_round = int(current_group[4][0])

    for index_PC in range(len(endings_PC1_PC2)):

        contributing = pd.DataFrame(current_group[0])

        contributing_variables = [ContributionsClass(col_id, float(contributing[col_id][index_PC])) for col_id in
                                  contributing.columns if col_id != '_row']

        loadings = pd.DataFrame(current_group[3])

        loading_variables = []
        index = 0
        for col_id in loadings.iterrows():
            loading_variables.append(
                ContributionsClass(contributing_variables[index].column_id, float(col_id[1][index_PC])))
            index += 1

        eigenvalue_and_inertia = pd.DataFrame(current_group[1])
        individual_values_per_pc = pd.DataFrame(current_group[2])
        eigenvalue = float(eigenvalue_and_inertia.iloc[index_PC, 0])
        percentage_of_variance = float(eigenvalue_and_inertia.iloc[index_PC, 1])
        cummulative_percentage = float(eigenvalue_and_inertia.iloc[index_PC, 2])

        col_id = ""
        col_header = ""
        # iterating the columns
        for col in sorted(contributing.columns):
            if dbg:
                print('col %s col_id %s col_header %s' % (col, col_id, col_header));
            if col != "_row":
                col_id = col_id + col
                col_header = col_header + " " + col

        col_id = col_id + '__' + endings_PC1_PC2[index_PC]
        col_header = col_header + " " + endings_PC1_PC2[index_PC]

        if dbg:
            print('Finally: col_id %s col_header %s' % (col_id, col_header));

        current_col_normalized = list(
            dr.normalize_values(individual_values_per_pc.iloc[:, index_PC], gv.id_data_type__numerical,
                                col_id))

        col_descriptive_statistics = DescriptiveStatisticsClass(list(individual_values_per_pc.iloc[:, index_PC]),
                                                                gv.id_data_type__numerical,
                                                                col_id,
                                                                current_col_normalized)

        missing_values_contributing = [current_dim.descriptive_statistics.missing_values_percentage for current_dim in
                                       gv.data_initially_formatted if (' ' + current_dim.id + ' ') in col_header]

        col_descriptive_statistics.missing_values_percentage = float(numpy.mean(missing_values_contributing))

        group_element = GroupElementsClass(col_header, col_id, gv.id_data_type__numerical,
                                           individual_values_per_pc.iloc[:, index_PC].tolist(),
                                           col_descriptive_statistics,
                                           individual_values_per_pc.iloc[:, index_PC].tolist(),
                                           endings_PC1_PC2[index_PC],
                                           contributing_variables, eigenvalue, percentage_of_variance,
                                           cummulative_percentage, loading_variables, index_round)

        gv.data_initially_formatted.append(group_element)
        list_PC_elements.append(group_element)

    return list_PC_elements


for index_groups in range(1, len(x_json)):
    save_famd_r_values(x_json[index_groups])

gv.original_data = copy.deepcopy(gv.data_initially_formatted)
gv.original_columns_not_contributing = copy.deepcopy(gv.columns_not_contributing)

print("--- %s seconds ---" % (time.time() - start_time))


@app.route('/load_csv/', methods=["POST"])
def main_interface():
    dbg = False;

    gv.data_initially_formatted = copy.deepcopy(gv.original_data)
    gv.columns_not_contributing = copy.deepcopy(gv.original_columns_not_contributing)

    gv.request_data_list = []

    if dbg:
        print(gv.original_data);
        for x in gv.original_data:
            print(x);
        print(gv.original_columns_not_contributing);

    return transform([gv.original_data, gv.original_columns_not_contributing])


def compute_deviations_from_list(data_columns_list):
    request_data_list = gv.request_data_list

    data_initially_formatted_new = []

    if len(gv.request_data_list) != 0 and len(gv.request_data_list) != len(
            gv.data_initially_formatted[0].column_values):

        for data_initial_index in range(len(data_columns_list)):

            data_initial = data_columns_list[data_initial_index]

            # for data_initial in data_columns_list:
            new_values_imputed = list(
                [data_initial.column_values[item_index] for
                 item_index in range(len(data_initial.column_values)) if item_index in request_data_list])

            new_values_not_imputed = list(
                [data_initial.column_values_not_imputed[item_index] for
                 item_index in range(len(data_initial.column_values)) if item_index in request_data_list])

            new_values_normalized = list([data_initial.descriptive_statistics.normalized_values[
                                              item_index] for
                                          item_index in range(len(data_initial.column_values)) if
                                          item_index in request_data_list])

            col_descriptive_statistics_new = DescriptiveStatisticsClass(new_values_not_imputed, data_initial.data_type,
                                                                        data_initial.id, new_values_normalized)
            col_descriptive_statistics_new = cds.get_descriptive_statistics_deviations(col_descriptive_statistics_new,
                                                                                       [x for x in
                                                                                        gv.data_initially_formatted if
                                                                                        x.id == data_initial.id][
                                                                                           0].descriptive_statistics)
            col_description_new = ColumnElementsClass(data_initial.header, data_initial.id,
                                                      data_initial.data_type, new_values_not_imputed,
                                                      col_descriptive_statistics_new, new_values_imputed)
            if data_initial.type_element_group == 'group':
                missing_values_contributing = [current_dim.descriptive_statistics.missing_values_percentage for
                                               current_dim in data_initially_formatted_new if
                                               (' ' + current_dim.id + ' ') in data_initial.header]

                if len(missing_values_contributing) == 0:
                    missing_values_contributing = [current_dim.descriptive_statistics.missing_values_percentage for
                                                   current_dim in gv.data_after_brushing if
                                                   (' ' + current_dim.id + ' ') in data_initial.header]

                col_descriptive_statistics_new.missing_values_percentage = float(
                    numpy.mean(missing_values_contributing))

                col_descriptive_statistics_new = cds.get_descriptive_statistics_deviations(
                    col_descriptive_statistics_new,
                    [x for x in
                     gv.data_initially_formatted if
                     x.id == data_initial.id][
                        0].descriptive_statistics)

                col_description_new = GroupElementsClass(data_initial.header, data_initial.id,
                                                         data_initial.data_type, new_values_not_imputed,
                                                         col_descriptive_statistics_new, new_values_imputed,
                                                         data_initial.PCone_or_two, data_initial.contributing_variables,
                                                         data_initial.eigenvalue, data_initial.percentage_of_variance,
                                                         data_initial.cumulative_percentage_of_variance,
                                                         data_initial.loading_variables, data_initial.index_round)

            data_initially_formatted_new.append(col_description_new)

    else:
        data_initially_formatted_new = copy.deepcopy(data_columns_list)
        # data_initially_formatted_new = data_columns_list

    return data_initially_formatted_new


@app.route('/run_famd_user_driven/', methods=["POST"])
def run_famd_user_driven():
    start_time_deviations = time.time()

    request_data_list = request.get_json()

    datalist_user_driven = []
    for col_ in gv.data_initially_formatted:
        if col_.id in request_data_list:
            col_series_ = pd.Series(col_.column_values)
            col_series_ = col_series_.rename(col_.id)

            datalist_user_driven.append(col_series_)

    df_ = pd.concat(datalist_user_driven, axis=1, keys=[s.name for s in datalist_user_driven])

    csv_file_name_ = os.path.dirname(sys.argv[0]) + os.path.sep + 'user_defined_dataset.csv'

    path2script_ = os.path.dirname(sys.argv[0]) + os.path.sep + 'FAMD_user_specific.R'

    df_.to_csv(csv_file_name_, index=False)

    # Build subprocess command
    cmd = [command, path2script_] + [csv_file_name_]

    # check_output will run the command and store to result
    x = subprocess.check_output(cmd, universal_newlines=True)

    x_json = json.loads(x)

    list_pc_elements_user_defined = save_famd_r_values(x_json)

    list_pc_elements_user_defined_filtered = copy.deepcopy(compute_deviations_from_list(list_pc_elements_user_defined))

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform([list_pc_elements_user_defined, list_pc_elements_user_defined_filtered]))


@app.route('/compute_deviations_and_get_current_values/', methods=["POST"])
def compute_deviations_and_get_current_values():
    dbg = False;
    start_time_deviations = time.time()

    gv.request_data_list = request.get_json()

    data_initially_formatted_new = compute_deviations_from_list(gv.data_initially_formatted)

    gv.data_after_brushing = data_initially_formatted_new

    if dbg:
        print(data_initially_formatted_new);
        print(gv.columns_not_contributing);

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform([data_initially_formatted_new, gv.columns_not_contributing]))


@app.route('/')
def hello():
    return "Hello World!"


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response


if __name__ == '__main__':
    # app.run(debug=True)
    port = 5000  # the custom port you want
    app.run(host='127.0.0.1', port=port)
