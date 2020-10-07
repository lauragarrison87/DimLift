/**
 * initialize items plot
 */
function initialize_items_plot() {
    add_heading(id_view_items, get_language_label_by_id(language_id_items_plot_heading));


    // add all individual dimension plots
    for (let i = 0; i < item_plot_preferences.length; i++) {
        initialize_individual_item_plots(id_view_items, item_plot_preferences[i].id, item_plot_preferences[i].width);
        add_heading(item_plot_preferences[i].id, get_language_label_by_id(item_plot_preferences[i].label));
        add_content_div(item_plot_preferences[i].id);
        if (i === item_plot_preferences.length - 1) {
            d3.select('#' + item_plot_preferences[i].id + id_content_ending).style('overflow-y', 'auto');
        } else if (i === 0) {
            let content_div = d3.select('#' + item_plot_preferences[0].id + id_content_ending);
            content_div.append('div').attr('class', id_items_parallel_coordinates_class);
        }
    }

    initialize_carousel();

    let width_sort_by = 120;

    let div_for_select = d3.select('#' + id_view_items_parallel_coordinates + id_heading_ending).append('div').attr('class', id_items_filter_class);

    div_for_select.append('svg')
        .style('width', width_sort_by + 'px')
        .style('height', '100%')
        .style('x', 0 + 'px')
        .append('text')
        .text(get_language_label_by_id(language_id_sort_by))
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(0,' + 33 / 2 + ')');

    let values_sort_by = [];
    all_descriptive_statistic_measures_all_dimensions.forEach(function (descriptive_statisticial_measure) {
        if (descriptive_statisticial_measure !== number_of_modes) {

            let label = get_language_label_by_id(descriptive_statisticial_measure);

            if (label.length > 25) {
                label = label.substring(0,25) + '...';
            }

            values_sort_by.push({
                label: label,
                value: descriptive_statisticial_measure
            });
        }
    });

    values_sort_by.push({
        label: get_language_label_by_id(statistics_key_overall_deviation),
        value: statistics_key_overall_deviation
    });

    values_sort_by.push({
        label: get_language_label_by_id(statistics_key_index_round),
        value: statistics_key_index_round
    });

    initialize_autocomplete(div_for_select, values_sort_by, false, language_id_sort_by);

    div_for_select.style('top', 0 + 'px').style('left', (0) + 'px');

    initialize_donut_chart_context_div();
}

/**
 * initialize individual dimension plots
 * @param parent_div_id
 * @param plot_id
 */
function initialize_individual_item_plots(parent_div_id, plot_id, plot_width) {
    d3.select('#' + parent_div_id).append('div').attr('class', id_each_item_plot_view_class)
        .attr('id', plot_id)
        .style('width', plot_width);
}