function identify_best_suitable_datatype() {

    column_values_initially.forEach(function (column) {

        let is_numerical = false;
        if (predefined_data_types[id_data_type__categorical].indexOf(column[key_id]) > -1) {
            let copied_column = column;
            copied_column[key_data_type] = id_data_type__categorical;

            format_datatypes_regarding_datatype([copied_column]);

            column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])] = get_descriptive_statistical_measures([column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])]])[0];
            column_values_filtered[column_values_filtered.findIndex(col => col[key_id] === copied_column[key_id])] = column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])];

        } else if (predefined_data_types[id_data_type__date].indexOf(column[key_id]) > -1) {
            let copied_column = column;
            copied_column[key_data_type] = id_data_type__date;

            format_datatypes_regarding_datatype([copied_column]);

            column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])] = copied_column;//get_descriptive_statistical_measures([column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])]])[0];
            column_values_filtered[column_values_filtered.findIndex(col => col[key_id] === copied_column[key_id])] = column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])];

        } else if (predefined_data_types[id_data_type__numerical].indexOf(column[key_id]) > -1) {
            is_numerical = true;
        } else if (column[key_data_type] === id_data_type__categorical) {

            let copied_column = JSON.parse(JSON.stringify(column));

            copied_column[key_data_type] = id_data_type__numerical;

            format_datatypes_regarding_datatype([copied_column]);

            let unique_values = copied_column[key_column_values].filter((x, i, a) => a.indexOf(x) == i);

            unique_values = unique_values.filter(unique_value => unique_value !== undefined && unique_value !== "" && unique_value !== "undefined");


            // check for just 0 and 1 values
            if (unique_values.length === 2 && unique_values.indexOf(0) > -1 && unique_values.indexOf(1) > -1) {

                column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])][key_column_values] = copied_column[key_column_values];

                column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])] = get_descriptive_statistical_measures([column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])]])[0];
                column_values_filtered[column_values_filtered.findIndex(col => col[key_id] === copied_column[key_id])] = column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])];


            } else if (is_numerical || (!isNaN(copied_column.descriptive_statistics[statistics_key__mean_value]) && unique_values.length > 2)) {

                d3.select('#' + copied_column[key_id] + id_drop_down_data_type_ending).selectAll("option").property("selected", function (d) {
                    return d === id_data_type__numerical;
                });

                column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])] = copied_column;
                column_values_filtered[column_values_filtered.findIndex(col => col[key_id] === copied_column[key_id])] = copied_column;
            }

        }
    });
}

function format_datatype_of_column_and_save(copied_column) {
    format_datatypes_regarding_datatype([copied_column]);

    column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === copied_column[key_id])] = copied_column;
    column_values_filtered[column_values_filtered.findIndex(col => col[key_id] === copied_column[key_id])] = copied_column;
}


function autoremove_outliers() {

    column_values_cleaned.forEach(function (column) {

        let copied_column = JSON.parse(JSON.stringify(column));

        if (column[key_data_type] === id_data_type__categorical) {
            let outliers = copied_column.descriptive_statistics[statistics_key__categories].filter(value => value[statistics_key__relativeFrequency] < threshold_categorical_outlier);

            copied_column[key_column_values].forEach(function (value, index) {
                if (outliers.findIndex(obj => obj[statistics_key__unique_value] === value) > -1) {
                    copied_column[key_column_values][index] = undefined;
                }
            });

            copied_column = get_descriptive_statistical_measures([copied_column])[0];


            column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === column[key_id])] = JSON.parse(JSON.stringify(copied_column));
            column_values_filtered[column_values_filtered.findIndex(col => col[key_id] === column[key_id])] = JSON.parse(JSON.stringify(copied_column));

        } else if (column[key_data_type] === id_data_type__numerical || column[key_data_type] === id_data_type__date) {

            // ToDO check for other descriptive statistics, it could be that everything is null in the end and this is not right

            copied_column[key_column_values] = copied_column.descriptive_statistics[statistics_key__outliers_removed];
            copied_column = get_descriptive_statistical_measures([copied_column])[0];

            column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === column[key_id])] = JSON.parse(JSON.stringify(copied_column));
            column_values_filtered[column_values_filtered.findIndex(col => col[key_id] === column[key_id])] = JSON.parse(JSON.stringify(copied_column));


            column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === column[key_id])] = get_descriptive_statistical_measures([column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === column[key_id])]])[0];
            column_values_filtered[column_values_filtered.findIndex(col => col[key_id] === column[key_id])] = JSON.parse(JSON.stringify([column_values_cleaned[column_values_cleaned.findIndex(col => col[key_id] === column[key_id])]][0]));


        }
    });
}

function compute_get_data_cleansing_changes() {

    //TODO use this for sorting the views in data cleansing popup view
    let columns_data_cleansing_changes_sorted = JSON.parse(JSON.stringify(column_values_cleaned));

    columns_data_cleansing_changes_sorted.sort((a, b) => (a[changes_key_datatype_change] < b[changes_key_datatype_change]) ? 1 : (a[changes_key_datatype_change] === b[changes_key_datatype_change]) ? ((a[key_removed_during_data_formatting].length < b[key_removed_during_data_formatting].length) ? 1 : -1) : -1);

    return columns_data_cleansing_changes_sorted;
}