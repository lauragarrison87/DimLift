/**
 * This function computes the descriptive statistics for each column
 * @param data_columns
 * @returns {*}
 */
function get_descriptive_statistical_measures(data_columns) {
    data_columns.forEach(function (column) {


        function replace_null_values(values) {
            if (values.indexOf(null) > -1) {
                values[values.indexOf(null)] = undefined;
                return replace_null_values(values);
            } else {
                return values;
            }
        }
        column[key_column_values]= replace_null_values(column[key_column_values]);
        column.descriptive_statistics = [];
        const count_values_in_columns = new Map([...new Set(column[key_column_values])].map(
            x => [x, column[key_column_values].filter(y => y === x).length]
        ));

        // get percentage of missing values
        let missing_values_percentage = count_values_in_columns.get(undefined) / column[key_column_values].length;
        if (isNaN(missing_values_percentage)) { // is null is not included in the column, NaN is the return value of count_values_in_columns. Therefore, NaN is possible and needs to be intercept
            missing_values_percentage = count_values_in_columns.get(null) / column[key_column_values].length;
            if (isNaN(missing_values_percentage)) {
                missing_values_percentage = 0;
            }
        }



        if (column[key_data_type] === id_data_type__numerical || column[key_data_type] === id_data_type__date) {


            let copied_column_data = JSON.parse(JSON.stringify(column[key_column_values]));
            let copied_column_data_for_normalization = copied_column_data;

            if (column_values_cleaned.length > 0 && column_values_cleaned.find(col => col[key_id] === column[key_id])[key_data_type] === column[key_data_type]) {
                copied_column_data_for_normalization = JSON.parse(JSON.stringify(column_values_cleaned.find(col => col[key_id] === column[key_id])[key_column_values]))
            }


            function normalize(data, arr_max, arr_min, newMax) {
                return data.map(d => {
                    return newMax * ((d - arr_min) / (arr_max - arr_min))
                })
            }

            // normalize data values in a range of 0 to 100
            // the normalized values are used to compute the descriptive statistics
            let normalized_data_values = normalize(copied_column_data, Math.max.apply(Math, copied_column_data_for_normalization), Math.min.apply(Math, copied_column_data_for_normalization), max_normalization_value);


            // sort array ascending
            const asc = arr => arr.sort((a, b) => a - b);

            const sum = arr => arr.reduce((a, b) => a + b, 0);

            const mean = arr => sum(arr) / arr.length;

            // sample standard deviation
            const std = (arr) => {
                const mu = mean(arr);
                const diffArr = arr.map(a => (a - mu) ** 2);
                return Math.sqrt(sum(diffArr) / (arr.length - 1));
            };

            const quantile = (arr, q) => {
                const sorted = asc(arr);
                const pos = ((sorted.length) - 1) * q;
                const base = Math.floor(pos);
                const rest = pos - base;
                if ((sorted[base + 1] !== undefined)) {
                    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
                } else {
                    return sorted[base];
                }
            };

            const q25 = arr => quantile(arr, .25);

            const q50 = arr => quantile(arr, .50);

            const q75 = arr => quantile(arr, .75);

            const median = arr => q50(arr);

            let q25_value_normalized = q25(normalized_data_values);
            let q75_value_normalized = q75(normalized_data_values);

            // find possible outliers by using IQR
            let q25_value = q25(JSON.parse(JSON.stringify(column[key_column_values])));
            let q75_value = q75(JSON.parse(JSON.stringify(column[key_column_values])));


            let iqr = q75_value - q25_value;

            // Then find min and max values
            let maxValue = q75_value + iqr * 1.5;
            let minValue = q25_value - iqr * 1.5;

            // Then filter anything beyond or beneath these values.
            let outliers_removedValues = JSON.parse(JSON.stringify(column[key_column_values]));


            let amount_of_outliers = 0;
            outliers_removedValues.forEach(function (x, index) {
                if (x !== undefined && ((x < minValue) || (x > maxValue))) {
                    outliers_removedValues[index] = undefined;
                    amount_of_outliers++;
                }
            });

            let std_value = std(normalized_data_values);
            if (isNaN(std_value)) {
                std_value = 0;
            }

            column.descriptive_statistics = {
                [statistics_key__mean_value]: mean(normalized_data_values),
                [statistics_key__std_value]: std_value,
                [statistics_key__median_value]: median(normalized_data_values),
                [statistics_key__q25_value]: q25_value_normalized,
                [statistics_key__q75_value]: q75_value_normalized,
                [statistics_key_iqr_range]: q75_value_normalized - q25_value_normalized,
                [statistics_key__missing_values_percentage]: missing_values_percentage,
                [statistics_key__percentage_of_outliers]: amount_of_outliers / column[key_column_values].length,
                [statistics_key__outliers_removed]: outliers_removedValues,
                [statistics_key_coefficient_of_unalikeability]: compute_coefficient_of_unalikeability(column[key_column_values], column[key_data_type]),
            };


            let copied_values_without_undefined = column[key_column_values].filter(x => x !== undefined);

            let freedmanDiaconis_thresholds = d3.thresholdFreedmanDiaconis(copied_values_without_undefined, d3.min(copied_values_without_undefined), d3.max(copied_values_without_undefined));


            if (!isFinite(freedmanDiaconis_thresholds)) {
                freedmanDiaconis_thresholds = 2;
            }
            let range = (d3.max(column[key_column_values]) - d3.min(column[key_column_values])) / freedmanDiaconis_thresholds;


            let ticks = [];
            for (let j = 0; j < freedmanDiaconis_thresholds + 1; j++) {
                ticks.push({
                    [statistics_key__unique_value]: d3.min(column[key_column_values]) + j * range,
                    [statistics_key__relativeFrequency]: (column[key_column_values].filter(x => x >= d3.min(column[key_column_values]) + j * range && x < d3.min(column[key_column_values]) + (j + 1) * range).length) / column[key_column_values].length
                })
            }

            ticks.push({
                [statistics_key__unique_value]: "undefined",
                [statistics_key__relativeFrequency]: missing_values_percentage
            });

            let x = d3.scaleLinear()
                .domain(d3.extent(column[key_column_values])).nice()
                .range([0, 900]);

            let kd_data = kernelDensityEstimator(kernelEpanechnikov(1), x.ticks(freedmanDiaconis_thresholds))(column[key_column_values]);

            column.descriptive_statistics[number_of_modes] = get_number_of_modes(kd_data, column[key_data_type]);


            let wilcox_indices = get_wilcox_indices(ticks);

            for (let i = 0; i < wilcox_indices.length; i++) {
                column.descriptive_statistics[wilcox_indices[i].key] = wilcox_indices[i].value;
            }

            column.descriptive_statistics[wilcox_StDev] = std_value;
            column.descriptive_statistics[wilcox_VarNC] = std_value * std_value;


            let descriptive_statistics_keys = d3.keys(column.descriptive_statistics);
            for (let i = 0; i < descriptive_statistics_keys.length; i++) {
                column.descriptive_statistics[descriptive_statistics_keys[i] + deviation_ending] = 0;
            }

            column.descriptive_statistics[statistics_key_overall_deviation] = 0;

        } else if (column[key_data_type] === id_data_type__categorical) {

            let unique_values = column[key_column_values].filter((x, i, a) => a.indexOf(x) == i);

            unique_values = unique_values.filter(unique_value => unique_value !== undefined && unique_value !== "" && unique_value !== null && unique_value !== "undefined");

            column.descriptive_statistics = {
                [statistics_key__categories]: []
            };


            for (let index_unique = 0; index_unique < unique_values.length; index_unique++) {
                let count = count_values_in_columns.get(unique_values[index_unique]);

                column.descriptive_statistics[statistics_key__categories].push({
                    [statistics_key__unique_value]: unique_values[index_unique],
                    [statistics_key__count]: count,
                    [statistics_key__relativeFrequency]: count / column[key_column_values].length // indicator for outlier within the data columm, look at https://www.researchgate.net/publication/271914532_A_simple_and_effective_outlier_detection_algorithm_for_categorical_data

                });
            }

            column.descriptive_statistics[statistics_key__percentage_of_outliers] = column.descriptive_statistics[statistics_key__categories].filter(category => category[statistics_key__relativeFrequency] < threshold_categorical_outlier).length / column[key_column_values].length;

            column.descriptive_statistics[statistics_key__missing_values_percentage] = missing_values_percentage;
            column.descriptive_statistics[statistics_key__amount_of_categories] = column.descriptive_statistics[statistics_key__categories].length;
            column.descriptive_statistics[statistics_key_coefficient_of_unalikeability] = compute_coefficient_of_unalikeability(column[key_column_values], column[key_data_type]);


            let highest_relative_frequency = Math.max.apply(Math, column.descriptive_statistics[statistics_key__categories].map(function (o) {
                return o[statistics_key__relativeFrequency];
            }));
            if (highest_relative_frequency < 0) {
                highest_relative_frequency = 0;
            }

            column.descriptive_statistics[statistics_key__highest_relative_frequency] = highest_relative_frequency;

            column.descriptive_statistics[number_of_modes] = get_number_of_modes(column.descriptive_statistics[statistics_key__categories], column[key_data_type]);

            /*column.descriptive_statistics[statistics_key__categories].push({
                [statistics_key__unique_value]: "undefined",
                [statistics_key__relativeFrequency]: missing_values_percentage
            });*/

            let wilcox_indices = get_wilcox_indices(column.descriptive_statistics[statistics_key__categories]);

            for (let i = 0; i < wilcox_indices.length; i++) {
                column.descriptive_statistics[wilcox_indices[i].key] = wilcox_indices[i].value;
            }

            let descriptive_statistics_keys = d3.keys(column.descriptive_statistics);
            for (let i = 0; i < descriptive_statistics_keys.length; i++) {
                column.descriptive_statistics[descriptive_statistics_keys[i] + deviation_ending] = 0;
            }

            column.descriptive_statistics[statistics_key_overall_deviation] = 0;

        }
    });

    return data_columns;
}

function compute_coefficient_of_unalikeability(column_values, data_type) {

    let epsilon;
    if (data_type !== id_data_type__categorical) {
        epsilon = (d3.max(column_values) - d3.min(column_values)) / 100 * epsilon_percent_for_coefficient_of_unalikeability;
    }

    let sum_unalike = 0;
    for (let i = 0; i < column_values.length; i++) {
        for (let j = 0; j < column_values.length; j++) {
            if (i !== j) {
                if (data_type !== id_data_type__categorical) {

                    if (Math.abs(column_values[i] - column_values[j]) > epsilon) {
                        sum_unalike = sum_unalike + 1;
                    }
                } else {
                    if (column_values[i] !== column_values[j]) {
                        sum_unalike = sum_unalike + 1;
                    }
                }
            }
        }
    }

    let res = sum_unalike / (column_values.length * column_values.length + column_values.length);

    return res;
}


function get_number_of_modes(data, data_type) {

    let number_of_modes = 0;
    if (data_type === id_data_type__categorical) {
        let max_mode_freque = d3.max(data, function (d) {
            return +d[statistics_key__relativeFrequency];
        });
        let threshold = 0.10;
        for (let i = 0; i < data.length; i++) {
            if (data[i][statistics_key__relativeFrequency] > max_mode_freque * threshold) {
                number_of_modes++;
            }
        }
    } else {
        let last_min = 0;
        if (data.length > 0) {
            if (data.length > 1) {
                for (let i = 0; i < data.length; i++) {
                    let bool_maximum = false;
                    if (i === 0) {
                        if (data[i][statistics_key__relativeFrequency] > data[i + 1][statistics_key__relativeFrequency]) {
                            bool_maximum = true;
                        }
                    } else if (i === data.length - 1) {
                        if (data[i][statistics_key__relativeFrequency] > data[i - 1][statistics_key__relativeFrequency]) {
                            bool_maximum = true;
                        }
                    } else if (data[i][statistics_key__relativeFrequency] > data[i - 1][statistics_key__relativeFrequency] && data[i][statistics_key__relativeFrequency] > data[i + 1][statistics_key__relativeFrequency]) {
                        bool_maximum = true;
                    } else if (data[i][statistics_key__relativeFrequency] > last_min && data[i][statistics_key__relativeFrequency] === data[i - 1][statistics_key__relativeFrequency] && data[i][statistics_key__relativeFrequency] > data[i + 1][statistics_key__relativeFrequency]) {
                        bool_maximum = true;
                    }

                    last_min = data[i][statistics_key__relativeFrequency];

                    if (bool_maximum) {

                        number_of_modes++;
                    }
                }
            } else if (data[0][statistics_key__relativeFrequency] > 0) {
                number_of_modes++;
            }
        }
    }

    return number_of_modes;
}