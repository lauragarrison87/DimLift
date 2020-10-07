/**
 * initialize system
 */
function initialize() {
    initialize_model();
    initialize_views();
}

/**
 * initialize model
 */
function initialize_model() {
    load_csv(function (response) {
        if (response) {

            color_scale_descriptive_statistics.domain([0, column_values_cleaned.length-1]);

            initialize_dimension_scatterplot(id_likelihood_of_correlation + id_content_ending, likelihood_of_correlation_plot_preferences.datatype, statistics_key_overall_deviation, null, true);

            initialize_applied_filters_view();

            let values_search = [];
            column_values_grouped.forEach(function (col, index) {
                values_search.push({
                    label: col[key_header],
                    value: col[key_id]
                });
            });


            initialize_autocomplete(d3.select('#' + id_view_items_parallel_coordinates + id_heading_ending).append('div').attr('class', id_items_filter_class), values_search, false, language_id_search);

            append_data_to_donut_chart_div();

            // add all individual dimension plots
            for (let i=0; i < dimension_plot_preferences.length; i++) {
                initialize_dimension_scatterplot(dimension_plot_preferences[i].id + id_content_ending, dimension_plot_preferences[i].datatype, dimension_plot_preferences[i].scatterplot_x_axis, dimension_plot_preferences[i].scatterplot_y_axis);
            }

            fill_pcp_plot_with_data_initially(column_values_filtered);

            add_context_menu();

        }
    });
}

/**
 * initialize views
 */
function initialize_views() {
    initialize_dimensions_plots();
    initialize_items_plot();
    initialize_likelihood_of_correlations_plot();
}


function update_data_type_automatically() {
    identify_best_suitable_datatype();
    update_views();
}

function update_data_type_by_setting(copied_column) {
    format_datatype_of_column_and_save(copied_column);
    update_views();
}

function remove_outliers() {
    autoremove_outliers();
    update_views();
}

function update_views() {
    update_dimension_views();
    //update_parallelCoordinates();
    //update_likelihood_of_correlations_plot();
}

function get_data_cleansing_changes() {
    return compute_get_data_cleansing_changes();
}

function update_after_filtering() {
    // compute_deviations();
    update_dimension_views();
    // update_likelihood_of_correlations_plot();
}

function convert_columns_for_parallel_coordinates_view() {

    return d3.range(0, column_values_cleaned[0][key_column_values].length)

        .map(function (x) {

            let obj = {};
            for (let i = 0; i < column_values_cleaned.length; i++) {

                let whole_column_null = false;

                if (column_values_cleaned[i][key_column_values].every(function (i) {
                    return i === undefined
                })) {
                    whole_column_null = true;
                }

                if (!whole_column_null) {

                    if (column_values_cleaned[i][key_data_type] === id_data_type__date) {

                        obj[column_values_cleaned[i][key_id]] = (column_values_cleaned[i][key_column_values][x] === undefined || column_values_cleaned[i][key_column_values][x] === null) ? undefined : new Date(column_values_cleaned[i][key_column_values][x]);

                    } else {
                        obj[column_values_cleaned[i][key_id]] = column_values_cleaned[i][key_column_values][x] === undefined || column_values_cleaned[i][key_column_values][x] === null ? undefined : column_values_cleaned[i][key_column_values][x];
                    }
                }
            }

            return obj;
        });
}
