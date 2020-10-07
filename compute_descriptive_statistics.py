import collections
import statistics
from math import sqrt

import numpy
import pandas as pd
from sklearn.neighbors import KernelDensity

import global_variables as gv

id_data_type__categorical = "string"
id_data_type__numerical = "number"
id_data_type__date = "date"


def get_descriptive_statistics_deviations(current_descriptive_statistics, descriptive_statistics_whole_data):
    current_descriptive_statistics.coefficient_of_unalikeability_deviation = current_descriptive_statistics.coefficient_of_unalikeability - descriptive_statistics_whole_data.coefficient_of_unalikeability
    current_descriptive_statistics.stDev_deviation = current_descriptive_statistics.stDev - descriptive_statistics_whole_data.stDev
    current_descriptive_statistics.varNC_deviation = current_descriptive_statistics.varNC - descriptive_statistics_whole_data.varNC
    current_descriptive_statistics.number_of_modes_deviation = current_descriptive_statistics.number_of_modes - descriptive_statistics_whole_data.number_of_modes
    current_descriptive_statistics.missing_values_percentage_deviation = current_descriptive_statistics.missing_values_percentage - descriptive_statistics_whole_data.missing_values_percentage

    current_descriptive_statistics.overall_deviation = (abs(
        current_descriptive_statistics.coefficient_of_unalikeability_deviation) + abs(
        current_descriptive_statistics.stDev_deviation) + abs(
        current_descriptive_statistics.missing_values_percentage_deviation)) / 3

    return current_descriptive_statistics


def compute_stdev(column_values_stdev_varnc, data_type):
    if data_type == id_data_type__categorical:

        relative_frequencies = [number / gv.initial_length_of_data_rows for number in
                                list(collections.Counter(column_values_stdev_varnc).values())]

        # fm = numpy.amax(relative_frequencies)

        n_total_size = sum(relative_frequencies)

        k = len(relative_frequencies)

        # check if k is smaller 2, if so return 0,0 because division by 0 is not allowed
        if k < 2:
            return 0, 0
        sum_distances_stdev = 0

        sum_value_varnc = sum(
            [(cat_frequ - n_total_size / k) * (cat_frequ - n_total_size / k) for cat_frequ in relative_frequencies])
        varnc = (sum_value_varnc / (((n_total_size * n_total_size) * (k - 1)) / k))

        # sum_value_iqv = sum([cat_frequ * cat_frequ for cat_frequ in relative_frequencies])

        # sum_value_h_star = sum([cat_frequ * log(cat_frequ) for cat_frequ in relative_frequencies])

        for i in range(len(relative_frequencies) - 1):
            current_frequ = relative_frequencies[i]
            sum_distances_stdev += sum([(current_frequ - cat_frequ) * (current_frequ - cat_frequ) for cat_frequ in
                                        relative_frequencies[i + 1:]])

        stdev = sqrt(sum_distances_stdev / (n_total_size * n_total_size * (k - 1)))

    else:

        not_nan_values = [x for x in column_values_stdev_varnc if str(x) != 'nan']

        stdev = statistics.stdev(not_nan_values)
        varnc = statistics.variance(not_nan_values)

    return stdev, varnc


class CategoriesObject(object):
    def __init__(self, unique_value, relative_frequency, count):
        self.unique_value = unique_value
        self.relativeFrequency = relative_frequency
        self.count = count


def get_categories(column_values):
    counter_elements = collections.Counter(column_values)
    categories_list = []

    # for count_el in range(len(collections.Counter(column_values))):
    for count_el in counter_elements:

        if str(count_el) != 'nan':
            categories_list.append(
                CategoriesObject(str(count_el), counter_elements[count_el] / gv.initial_length_of_data_rows,
                                 counter_elements[count_el]))

    return categories_list


def compute_coefficient_of_unalikeability(column_values_coeff_unalikeability, data_type, column_id):
    epsilon_percent_for_coefficient_of_unalikeability = 5

    sum_unalike = 0

    if data_type == id_data_type__categorical:
        counter = collections.Counter(column_values_coeff_unalikeability)

        for count in counter.values():
            sum_unalike += count * (len(column_values_coeff_unalikeability) - count)  # (gv.initial_length_of_data_rows - count)
    else:
        column_values_coeff_unalikeability = pd.Series(column_values_coeff_unalikeability)
        column_values_coeff_unalikeability = column_values_coeff_unalikeability.rename(column_id)

        original_column_values = column_values_coeff_unalikeability
        if len([x for x in gv.data_initially_formatted if x.id == column_id]) > 0:
            original_column_values = pd.Series([x for x in gv.data_initially_formatted if x.id == column_id][0].column_values)
            original_column_values = original_column_values.rename(column_id)

        # due to normalization, we have fixed min and max values
        min_value = 0  # numpy.amin(original_column_values)
        max_value = 1  # numpy.amax(original_column_values)

        epsilon = (max_value - min_value) / 100 * epsilon_percent_for_coefficient_of_unalikeability
        length_available_data = len(column_values_coeff_unalikeability)  # gv.initial_length_of_data_rows

        # very low on performance, not the best implementation
        # better: group the values
        # for i in column_values:
        #     if ~numpy.isnan(i):
        #
        #         sum_unalike += + len(list(x for x in sorted(column_values) if (i - epsilon) <= x <= (i + epsilon)))
        #     else:
        #         length_available_data -= 1
        #
        # sum_unalike += length_available_data * (column_values_length - length_available_data)

        if numpy.isnan(min_value):
            sum_unalike += length_available_data * (len(column_values_coeff_unalikeability) - length_available_data)  # (gv.initial_length_of_data_rows - length_available_data)

        elif min_value == max_value:
            counter = collections.Counter(column_values_coeff_unalikeability)

            sum_unalike += counter[min_value] * (len(column_values_coeff_unalikeability) - counter[min_value])
            sum_unalike += (len(column_values_coeff_unalikeability) - counter[min_value]) * (len(column_values_coeff_unalikeability) -
                                                                                    (len(column_values_coeff_unalikeability) -
                                                                                     counter[
                                                                                         min_value]))

        else:
            grouped_values = column_values_coeff_unalikeability.groupby(pd.cut(column_values_coeff_unalikeability, numpy.arange(min_value,
                                                                                                                                max_value,
                                                                                                                                epsilon))).count().to_frame()

            for count in grouped_values[column_values_coeff_unalikeability.name]:
                if count > 0:
                    length_available_data -= count
                    sum_unalike += count * (len(column_values_coeff_unalikeability) - count)

            sum_unalike += length_available_data * (len(column_values_coeff_unalikeability) - length_available_data)

    sum_unalike = sum_unalike / (len(column_values_coeff_unalikeability) * len(column_values_coeff_unalikeability))

    return sum_unalike


def get_number_of_modes(current_col, data_type):
    cleaned_list = [x for x in current_col if (str(x) != 'nan' and str(x) != "None")]

    if len(cleaned_list) == 0:
        return 0

    elif data_type == id_data_type__categorical:

        threshold = 0.10

        relative_frequencies = [number / gv.initial_length_of_data_rows for number in
                                list(collections.Counter(cleaned_list).values())]
        max_mode_freque = numpy.amax(relative_frequencies)
        # j2 = [i for i in relative_frequencies if i >= max_mode_freque - max_mode_freque * threshold]

        return len([i for i in relative_frequencies if i >= max_mode_freque - max_mode_freque * threshold])
    else:

        if numpy.amin(cleaned_list) == numpy.amax(cleaned_list):
            return 1
        else:

            bandwidths = list(numpy.histogram(cleaned_list, 'fd'))

            best_bandwidth = (bandwidths[1][1] - bandwidths[1][0])

            #            kde = stats.gaussian_kde(cleaned_list, best_bandwidth)
            a = numpy.asarray([i * 100 for i in cleaned_list]).reshape(-1, 1)  #
            kde_sklearn = KernelDensity(kernel='gaussian', bandwidth=best_bandwidth).fit(a)
            s = numpy.linspace(0,50)
            e = kde_sklearn.score_samples(s.reshape(-1, 1))

            maxima = numpy.count_nonzero(numpy.r_[True, e[1:] > e[:-1]] & numpy.r_[e[:-1] > e[1:], True])

            return int(maxima)  # len(argrelextrema(kde(bandwidths[1]), numpy.greater)[0])
