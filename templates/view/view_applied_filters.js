function initialize_applied_filters_view() {
    column_values_cleaned.forEach(function (col) {
        let column_line_div = d3.select('#' + item_plot_preferences[item_plot_preferences.length - 1][key_id] + id_content_ending)
            .append('div')
            .attr('id', col[key_id] + id_applied_filter_line_div_ending)
            .attr('class', id_applied_data_cleansing_columns_divs_class)
            .style('height', 0);
    })

}

function update_applied_filters_view(actives) {

    if (actives.length === 0) {
        d3.selectAll('.' + id_applied_data_cleansing_columns_divs_class).style('height', 0).selectAll('*').remove();
    } else {
        d3.selectAll('.' + id_applied_data_cleansing_columns_divs_class).each(function (applied_data_cleansing_col_div) {

            let col_id = this.id.split(id_applied_filter_line_div_ending)[0];
            if (actives.find(x => x.dimension === col_id)) {

                let column_line_div = d3.select(this).style('height', 'var(--applied_data_cleansing_columns_divs_height)');

                let current_active = actives.filter(x=> x.dimension ===col_id)[0];

                column_line_div.selectAll('*').remove();

                let number_of_divs_per_line = 3;

                let current_col_cleaned = column_values_cleaned.find(col => col[key_id] === col_id);

                let data_type = current_col_cleaned[key_data_type];

                for (let i = 0; i < number_of_divs_per_line; i++) {

                    let current_div = column_line_div.append('div').attr('class', id_applied_data_cleansing_columns_line_divs_class)
                        .style('width', 'calc(100% / ' + number_of_divs_per_line + ')');

                    let slider_numerical;
                    switch (i) {
                        case 0:
                            // insert column label
                            let svg = current_div.append('svg')
                                .style('width', '100%')
                                .style('height', '100%')
                                .append('text')
                                .text(shorten_label_to_save_space(column_values_cleaned.find(col => col[key_id] === col_id)[key_header], 100, 14)) //shorten_label_to_save_space(col_id), parseFloat(getComputedStyle(current_div.node()).width))
                                .attr('font-size', '0.8em')
                                .attr('text-anchor', 'start')
                                .attr('transform', 'translate(0,' + 33 / 2 + ')')
                                .on('click', function () {
                                    highlight_dimension(col_id);
                                    highlight_circles(col_id);
                                })
                                .attr('data-tippy-content', get_language_label_by_id(column_values_cleaned.find(col => col[key_id] === col_id)[key_header]));

                            tippy(svg.node());

                            break;
                        case 1:

                            if (data_type === id_data_type__numerical || data_type === id_data_type__date) {
                                let slider_range_div = current_div.append('div').attr('id', 'slider-range')
                                    .style('top', '5px');

                                slider_numerical = $(slider_range_div.node()).slider({
                                    range: true,
                                    min: Math.min.apply(Math, current_col_cleaned[key_column_values].filter(x => x !== null)) *100,
                                    max: Math.max.apply(Math, current_col_cleaned[key_column_values].filter(x => x !== null)) *100,
                                    values: [y_scale_pcp_new[col_id].scale.invert(current_active.extent[1]) *100, y_scale_pcp_new[col_id].scale.invert(current_active.extent[0]) *100],

                                    slide: function (event, ui) {

                                        set_brush_programmatically(col_id, [y_scale_pcp_new[col_id].scale(ui.values[1] / 100), y_scale_pcp_new[col_id].scale(ui.values[0] / 100)], false);
                                    },
                                    stop: function (event, ui) {
                                        set_brush_programmatically(col_id, [y_scale_pcp_new[col_id].scale(ui.values[1] / 100), y_scale_pcp_new[col_id].scale(ui.values[0] / 100)], true);
                                    }
                                });

                            } else if (data_type === id_data_type__categorical) {
                                current_div.style('width', 'calc(2 * 100% / ' + number_of_divs_per_line + ')');

                                let current_col_unique_values = current_col_cleaned[key_column_values].filter((x, i, a) => a.indexOf(x) == i);

                                let select_div = current_div.append('select').attr('id', 'example').attr('class', 'example').attr('multiple', true)

                                let current_brushed_unique_values = current_active.unique_values; //brushed_values_col.filter((x, i, a) => a.indexOf(x) == i);

                                current_col_unique_values.forEach(function (col, index) {

                                    if (current_brushed_unique_values.indexOf(col) > -1) {
                                        select_div.append('option').attr('selected', true).text(col);
                                    } else {
                                        select_div.append('option').attr('disabled', true).text(col);
                                    }
                                });

                                tail.select("select");

                            }
                            break;

                        case 2:

                            if (data_type === id_data_type__numerical || data_type === id_data_type__date) {

                                let val_min, val_max;

                                if (data_type === id_data_type__numerical) {
                                    val_min = y_scale_pcp_new[col_id].scale.invert(current_active.extent[1]).toFixed(2);//parcoords.brushExtents()[col_id][0].toFixed(2);
                                    val_max = y_scale_pcp_new[col_id].scale.invert(current_active.extent[0]).toFixed(2);//parcoords.brushExtents()[col_id][1].toFixed(2);
                                } else if (data_type === id_data_type__date) {
                                    let date_min = new Date(y_scale_pcp_new[col_id].scale.invert(current_active.extent[1]));//parcoords.brushExtents()[col_id][0]);
                                    let date_max = new Date(y_scale_pcp_new[col_id].scale.invert(current_active.extent[0]));//parcoords.brushExtents()[col_id][1]);

                                    val_min = date_min.getDate() + "." + (date_min.getMonth() + 1) + "." + date_min.getFullYear();
                                    val_max = date_max.getDate() + "." + (date_max.getMonth() + 1) + "." + date_max.getFullYear();
                                }

                                let float_text_box_min = current_div.append('input')
                                    .attr('id', 'floatTextBox_min')
                                    .attr('min', Math.min.apply(Math, current_col_cleaned[key_column_values]))
                                    .attr('max', Math.max.apply(Math, current_col_cleaned[key_column_values]))
                                    .style('width', 'calc(' + 50 + '% - 5px)')
                                    .attr("disabled", "disabled")
                                    .attr('value', val_min);

                                current_div.append('svg')
                                    .style('width', '15px')
                                    .style('height', '100%')
                                    .append('text')
                                    .text(' - ')
                                    .attr('font-size', '0.8em')
                                    .attr('text-anchor', 'start')
                                    .attr('transform', 'translate(5,' + 33 / 2 + ')');

                                let float_text_box_max = current_div.append('input')
                                    .attr('id', 'floatTextBox_max')
                                    .style('width', 'calc(' + 50 + '% - 5px)')
                                    .attr('min', Math.min.apply(Math, current_col_cleaned[key_column_values]))
                                    .attr('max', Math.max.apply(Math, current_col_cleaned[key_column_values]))
                                    .style('width', 'calc(' + 50 + '% - 10px)')
                                    .attr("disabled", "disabled")
                                    .attr('value', val_max);
                            } else if (data_type === id_data_type__categorical) {
                                current_div.remove();
                            }
                            break;
                    }

                    //  }
                }
            } else {
                d3.select(this).style('height', 0).selectAll('*').remove();

            }
        })
    }
}