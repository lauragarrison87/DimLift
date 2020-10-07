function initialize_items_plot_new(parent_div_id) {

    color_scale_loading = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(['blue', 'white', 'red']);

    statistics_scale = d3.scaleLinear().domain([0, 1])
        .range(["#BEBEBE", "black"]);

    width_pcp_new = parseFloat(parent_div_id.style('width')) - margin_pcp_plot_new.left - margin_pcp_plot_new.right;

    pcp_new_height = parseFloat(parent_div_id.style('height')) - margin_pcp_plot_new.top - margin_pcp_plot_new.bottom;

    x_scale_pcp_new = d3.scalePoint().range([0, width_pcp_new]);

    line_pcp_new = d3.line();
    axis = d3.axisLeft();

    qualitative_bar_width_scale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, qualitative_bar_max_width]);


    svg_pcp_new = parent_div_id.append("svg")
        .attr("width", width_pcp_new + margin_pcp_plot_new.left + margin_pcp_plot_new.right)
        .attr("height", pcp_new_height + margin_pcp_plot_new.top + margin_pcp_plot_new.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_pcp_plot_new.left + "," + margin_pcp_plot_new.top + ")");
}

function brushstart() {
    d3.event.sourceEvent.stopPropagation();
}

/**
 * just in case of brush end compute the deviations
 * otherwise, it's too slow
 */
function brushend(col_id) {
    let active_indices_list = brush();

    if (!col_id) {
        col_id = this.parentNode.id;
    }

    let index_of_filtered = column_values_grouped.map(col => col[key_id]).indexOf(col_id);

    let dist = index_of_filtered - selectedIndex;

    update_pcp_plot(update_dimensions_order_regarding_Filters());

    compute_deviations_new(function (response) {
        update_after_filtering();
        selectedIndex = column_values_grouped.map(col => col[key_id]).indexOf(col_id) - dist;
        rotateCarousel(true)//update_pcp_plot(update_dimensions_order_regarding_Filters());

    }, active_indices_list);
}

function update_dimensions_order_regarding_Filters() {
    let old_dimensions = dimensions;

    let new_dimensions = [];

    old_dimensions.forEach(function (dim) {
        if ( //!dimensions_brushed_filtered.includes(dim) &&
            new_dimensions.length < dimensions_count_shown) {
            new_dimensions.push(dim);
        }
    });

    if (new_dimensions[new_dimensions.length - 1].indexOf(id_duplicate_dimensions) > -1) {
        new_dimensions[new_dimensions.length - 1] = new_dimensions[new_dimensions.length - 1].split(id_duplicate_dimensions)[0]
    }

    return new_dimensions;
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {

    dimensions_brushed_filtered = [];
    let actives = [];

    svg_pcp_new.selectAll(".brush")
        .filter(function (d) {
            return d3.brushSelection(this);
        })
        .each(function (d) {

            d = this.parentNode.id;

            actives.push({
                dimension: d,
                extent: d3.brushSelection(this),
                unique_values: []
            });
        });

    let copy_actives = JSON.parse(JSON.stringify(actives));

    actives_copy.forEach(function (copy) {
        if (!dimensions.includes(copy.dimension) && d3.select('.' + id_items_parallel_coordinates_class).select('#' + copy.dimension).empty()) {

            let dimension_id_without_last_string = copy.dimension.slice(0, -1);

            let other_pc_dim_id = copy.dimension;
            let bool_pc = false;
            if (copy.dimension.substr(-1) === '1') {
                other_pc_dim_id = dimension_id_without_last_string + '2';
                bool_pc = true;
            } else if (copy.dimension.substr(-1) === '2') {
                other_pc_dim_id = dimension_id_without_last_string + '1';
                bool_pc = true;
            }

            if (bool_pc && copy_actives.filter(x => x.dimension === other_pc_dim_id).length>0) {
                copy_actives.filter(x => x.dimension === other_pc_dim_id)[0].extent = copy.extent;
            } else if ((!bool_pc && actives.filter(x => x.dimension === copy.dimension).length === 0)|| (bool_pc && actives.filter(x => x.dimension === other_pc_dim_id).length === 0)) {
                copy_actives.push(copy);
            }
        }
    });

    copy_actives.forEach(function (d) {
        if (dimensions.includes(d.dimension + id_duplicate_dimensions)) {
            dimensions_brushed_filtered.push(d.dimension + id_duplicate_dimensions);
        }

        dimensions_brushed_filtered.push(d.dimension);
    });


    actives_copy = JSON.parse(JSON.stringify(copy_actives));


    let active_patients = [];
    let active_indices_list = [];
    foreground_pcp_new.style("display", function (d, index) {
        active_patients.push(d);
        active_indices_list.push(index);
        return actives_copy.every(function (active) {

            let is_active = (active.extent[0] <= get_y_value_for_axes(d[active.dimension], active.dimension) && get_y_value_for_axes(d[active.dimension], active.dimension) <= active.extent[1]);

            if (!is_active) {
                active_patients.pop();
                active_indices_list.pop();
            } else {
                if (!active.unique_values.includes(d[active.dimension])) {
                    active.unique_values.push(d[active.dimension]);
                }
            }

            return is_active;

        }) ? null : "none";
    });

    d3.selectAll('.' + id_frequency_bar).each(function (frequency_bar) {

        frequency_bar = this.parentNode.parentNode.id;
        let patients_having_value = active_patients.filter(x => x[frequency_bar] === d3.select(this).attr('id').split(splitter)[1]).length;

        d3.select(this)
            .style("width", qualitative_bar_width_scale(patients_having_value / data_all_pcp_new.length));
    });

    update_applied_filters_view(actives_copy);

    update_pc1pc2_scatterplots_after_brushing(active_indices_list);
    update_tick_values_after_brushing(active_indices_list);

    return active_indices_list;
}

function update_tick_values_after_brushing(active_indices_list) {
    d3.selectAll('.' + id_tick_lines).each(function () {
        d3.select(this).style('opacity', function (d) {
            if (active_indices_list.includes(d.index)) {
                return opacity_path;
            } else {
                return 0;
            }
        });
    });
}

function update_pc1pc2_scatterplots_after_brushing(active_indices_list) {
    d3.selectAll('.' + id_pc1pc2_scatterplot_circles).attr('opacity', function (d, index) {
        if (active_indices_list.includes(d.index)) {
            return opacity_path;
        } else {
            return 0;
        }
    });
}

function fill_pcp_plot_with_data_initially(data) {


    data_all_pcp_new = data[0].column_values;

    data.forEach(function (column) {

        allow_dragging.push({
            id: column.id,
            draggable: true
        });

        dimensions.push(column.id);


        // in case of quantitative data
        if (column.data_type === id_data_type__numerical) {
            y_scale_pcp_new[column.id] = {
                scale_type: id_data_type__numerical,
                scale: d3.scaleLinear()
                    .domain(d3.extent(column.column_values))
                    .range([pcp_new_height, 0]),
                header: column.header
            };
            // in case of date data
        } else if (column.data_type === id_data_type__date) {

            y_scale_pcp_new[column.id] = {
                scale_type: id_data_type__date,
                scale: d3.scaleTime()
                    .domain(d3.extent(column.column_values))
                    .range([pcp_new_height, 0]),
                header: column.header
            };
            // in case of qualitative data
        } else {

            // add scale for qualitative data
            y_scale_pcp_new[column.id] = {
                scale_type: id_data_type__categorical,
                scale: d3.scaleBand()
                    .padding(0.1)
                    .domain(column.column_values.filter(x => x !== null))
                    .range([0, pcp_new_height]),
                frequencies: column.descriptive_statistics.categories,
                header: column.header
            };
        }
    });

    let dimensions_all = JSON.parse(JSON.stringify(dimensions));
    dimensions = [];
    column_values_grouped.slice(0, dimensions_count_shown).forEach(function (dim) {
        dimensions.push(dim[key_id])
    });
    dimensions_new = JSON.parse(JSON.stringify(dimensions));


    x_scale_pcp_new.domain(dimensions);

    // Add blue foreground lines for focus.
    foreground_pcp_new = svg_pcp_new.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data_table_cleaned)
        .enter()
        .append("path")
        .attr("d", path)
        .on("mouseover", function (d) {
            d3.select(this).style("opacity", opacity_path_hover)
        })
        .on("mouseout", function () {
            d3.select(this).style("opacity", opacity_path)
        });

    add_dimensions();

}

function get_y_value_for_axes(value, dimension) {

    if (value === null) { // in case the value is null, draw it underneath
        return pcp_new_height + 30;
    } else if (y_scale_pcp_new[dimension].scale_type === id_data_type__categorical) { // in case of qualitative data
        return y_scale_pcp_new[dimension].scale(value) + 1 / 2 * y_scale_pcp_new[dimension].scale.bandwidth();
    } else { // in case of quantitative values
        return y_scale_pcp_new[dimension].scale(value);
    }
}

function path_tick_values(value) {

}

// Returns the path for a given data point.
function path(value) {
    return line_pcp_new(dimensions.map(function (dimension) {
        let dimension_split = dimension.split(id_duplicate_dimensions)[0];

        return [position(dimension), get_y_value_for_axes(value[dimension_split], dimension_split)];
    }));

}

function set_brush_programmatically(dimension_id, extents, final) {
    d3.select('#' + dimension_id).select(".brush").call(d3.brushY().move, extents);

    actives_copy.filter(x => x.dimension === dimension_id)[0].extent = extents;

    if (final) {
        brushend(dimension_id);
    } else {
        brush()
    }
}

function position(d) {
    let v = dragging[d];

    if (x_scale_pcp_new(d) === null || x_scale_pcp_new(d) === undefined) {
        return -1.5 * margin_pcp_plot_new.left;
    }

    return v == null ? x_scale_pcp_new(d) : v;
}

function transition(g) {
    return g.transition().duration(duration_time);
}


function update_pcp_plot(new_dimensions) {

    let old_dimensions = dimensions;
    dimensions = new_dimensions;

    dimensions = update_dimensions_order_regarding_Filters();
    dimensions_new = JSON.parse(JSON.stringify(dimensions));

    new_dimensions = dimensions;

    x_scale_pcp_new.domain(new_dimensions);

    foreground_pcp_new.transition()              //Initiate a transition on all elements in the update selection (all rects)
        .duration(duration_time)
        .attr("d", function (d) {
            return path(d);
        });

    svg_pcp_new.selectAll(".dimension").transition()              //Initiate a transition on all elements in the update selection (all rects)
        .duration(duration_time)
        .attr("transform", function (d) {
            d = this.id;
            if (new_dimensions.includes(d + id_duplicate_dimensions)) {
                d3.select('#' + d).select('.' + id_pc1pc2_scatterplot_svg).attr('visibility', 'visible');

                d3.select('#' + d + id_drilldown_dimension).attr('visibility', 'hidden');
                d3.select('#' + d + id_drillup_dimension).attr('visibility', 'visible');

                return "translate(" + (position(d) - x_scale_pcp_new.step() / 2) + ")";
            } else {
                d3.select('#' + d).select('.' + id_pc1pc2_scatterplot_svg).attr('visibility', 'hidden');

                d3.select('#' + d + id_drilldown_dimension).attr('visibility', 'visible');
                d3.select('#' + d + id_drillup_dimension).attr('visibility', 'hidden');

                return "translate(" + position(d) + ")";
            }
        })
        .on('end', function (d) {
            d = this.id;
            if (x_scale_pcp_new(d) === null || x_scale_pcp_new(d) === undefined) {
                this.remove();
            }
        });

    let values_search = [];
    column_values_grouped.forEach(function (col, index) {
        values_search.push({
            label: col[key_header],
            value: col[key_id]
        });
    });

    update_search_for_dimensions(d3.select('#' + id_view_items_parallel_coordinates + id_heading_ending).append('div').attr('class', id_items_filter_class), values_search, false, language_id_search);


    append_data_to_donut_chart_div();

    highlight_donut_chart_after_rotation();

    d3.selectAll('.' + id_class_dimension_expanded).each(function () {
        let current_dim_id = this.id;

        expand_group(column_values_filtered.filter(x => x.id === current_dim_id)[0]);
    });

    setTimeout(function () {

        let dimensions_to_add = [];
        new_dimensions.forEach(function (dim) {
            if (!old_dimensions.includes(dim)) {
                dimensions_to_add.push(dim);
            }
        });
        svg_pcp_new.selectAll(".dimension").each(function () {
            if (dimensions_to_add.includes(this.id)) {
                dimensions_to_add.splice(dimensions_to_add.indexOf(this.id), 1);
            }
        });

        dimensions = JSON.parse(JSON.stringify(dimensions_to_add));

        add_dimensions();

        dimensions = new_dimensions;

        dimensions.forEach(function (dim) {
            set_statistics_background_and_brush(dim);
        });

        d3.selectAll('.' + id_class_dimension_expanded).each(function () {

            set_statistics_background_and_brush(this.id);
        });

        d3.selectAll('.' + id_class_dimension_expanded).each(function () {
            let current_dimension = column_values_filtered.filter(x => x.id === this.id)[0];

            current_dimension.loading_variables.forEach(function (loading) {

                if (!d3.select('#' + loading.column_id).empty()) {
                    d3.select('#' + loading.column_id).select('.' + id_contribution_background).style('fill', contributing_background_color);

                    let contri = current_dimension.contributing_variables.filter(x => x.column_id === loading.column_id)[0];

                    let circle_contri = d3.select('#' + loading.column_id).select('.' + id_contribution_circle).attr("visibility", "visible").style('fill', color_scale_loading(loading.value));

                    let tippy_instance = tippy(circle_contri.node(), {
                        allowHTML: true, dynamicTitle: true,
                        content: current_dimension.id + "<br />" +
                            get_language_label_by_id(language_id_contribution) + (contri.value).toFixed(0) + '% <br />' +
                            get_language_label_by_id(language_id_loading) + loading.value.toFixed(2)
                    });

                    tippy_instances_circles_contribution.push({
                        current_dimension: current_dimension.id,
                        contri: loading.column_id,
                        tippy: tippy_instance
                    });
                }
            });
        });

        function set_statistics_background_and_brush(dim) {
            dim = dim.split(id_duplicate_dimensions)[0];
            d3.select('#' + dim).select('.' + id_statistics_background)
                .style('fill', function () {

                    let descr_value = column_values_filtered.find(x => x.id === dim).descriptive_statistics[sort_parallel_coordinates_by];
                    if (descr_value === -1) {
                        return newly_generated_group_background_color;
                    }
                    return statistics_scale(descr_value);
                });

            if (brushed_dimensions.includes(dim)) {
                d3.select('#' + dim).select('.' + id_statistics_background)
                    .style('fill', 'purple');
            }

            if (dimensions_brushed_filtered.includes(dim)) {
                d3.select('#' + dim).select('.' + id_statistics_background)
                    .style('fill', 'blue');
            }

            // set brush again for right position
            if (actives_copy.filter(x => x.dimension === dim).length > 0) {

                if (!d3.select('#' + dim + id_applied_filter_line_div_ending).select('#floatTextBox_min').empty()) {
                    let min_val = d3.select('#' + dim + id_applied_filter_line_div_ending).select('#floatTextBox_min').attr('value');
                    let max_val = d3.select('#' + dim + id_applied_filter_line_div_ending).select('#floatTextBox_max').attr('value');

                    actives_copy.filter(x => x.dimension === dim)[0].extent = [min_val, max_val];

                    set_brush_programmatically(dim, [y_scale_pcp_new[dim].scale(max_val), y_scale_pcp_new[dim].scale(min_val)], false);
                } else if (!d3.select('#' + dim + id_applied_filter_line_div_ending).select('#example').empty()) {

                    // ToDO: brush programmatically qualitative variables
                    //console.log(d3.select('#' + dim + id_applied_filter_line_div_ending).select('#example').node().options)
                }
            }
        }

    }, duration_time + 50);
}

function expand_group(current_dimension) {

    let min_contri_x = 100000;
    let max_contri_x = 0;

    const min_x_transform = 120;

    let upper_buttons_width = 80;
    let bottom_buttons_width = 80;

    current_dimension.contributing_variables.forEach(function (contri) {
        if (x_scale_pcp_new(contri.column_id) < min_contri_x) {
            min_contri_x = x_scale_pcp_new(contri.column_id);
        }
        if (x_scale_pcp_new(contri.column_id) > max_contri_x) {
            max_contri_x = x_scale_pcp_new(contri.column_id);
        }
    });

    let range_axis = max_contri_x - min_contri_x - upper_buttons_width;

    if (min_contri_x === max_contri_x || range_axis < 0) {
        d3.select('#' + current_dimension.id).transition()
            .duration(duration_time)
            .attr('opacity', 0);
    } else {
        y_scale_pcp_new[current_dimension.id].scale.range([range_axis, 0]);

        let dimension_id_without_last_string = current_dimension.id.slice(0, -1);
        let other_pc_dim = current_dimension.id;
        if (current_dimension.id.substr(-1) === '1') {
            other_pc_dim = dimension_id_without_last_string + '2';
        } else if (current_dimension.id.substr(-1) === '2') {
            other_pc_dim = dimension_id_without_last_string + '1';
        }

        y_scale_pcp_new[other_pc_dim].scale.range([range_axis, 0]);

        let translate_range_axis_y = pcp_new_height - range_axis - bottom_buttons_width / 2 - (pcp_new_height - 120);

        d3.select('#' + current_dimension.id).select('.' + id_statistics_background)
            .style('height', range_axis)
            .style('transform', 'translate(0px,' + translate_range_axis_y + 'px)');

        d3.select('#' + current_dimension.id).selectAll('.' + id_tick_lines).each(function () {
            d3.select(this) //.transition().duration(duration_time)
                .attr("visibility", "visible")
                .style('transform', 'translate(0px,' + translate_range_axis_y + 'px)');
        });

        d3.select('#' + current_dimension.id).transition()
            .duration(duration_time)
            .attr('opacity', 1)
            .style('transform', 'translate(' + (min_x_transform + min_contri_x) + 'px,-80px)rotate(90deg)');

        hide_show_drillup_down_buttons(current_dimension.id, 0);
        stay_position_bottom_views(id_swap_dimension);
        stay_position_bottom_views(id_shrink_dimensions);
        stay_position_bottom_views(id_expand_dimension);
        stay_position_bottom_views(id_PC1PC2_text);


        stay_position_upper_views(id_percentage_of_missing_values);
        stay_position_upper_views(id_percentage_of_variance_view);
        stay_position_upper_views(id_loadings_view);
        stay_position_upper_views(id_axis_label_text);

        d3.select('#' + current_dimension.id).select('.axis')
            .call(axis.scale(y_scale_pcp_new[current_dimension.id].scale));

        d3.select('#' + current_dimension.id).selectAll('.' + id_tick_lines)
            .transition().duration(duration_time)
            .attr("y1", function (d) {
                return y_scale_pcp_new[current_dimension.id].scale(d.y)
            })      // y position of the first end of the line
            .attr("y2", function (d) {
                return y_scale_pcp_new[current_dimension.id].scale(d.y)
            });   // y position of the second end of the line


        d3.select('#' + current_dimension.id).select(".brush")
            .call(current_dimension.id.brush = d3.brushY()
                .extent([[-10, 0], [0, range_axis]]) // only until 0 to still provide hovering for qualitative data frequencies
                .on("start", brushstart)
                .on("brush", brush)
                .on("end", brushend)
            );

        update_position_path(d3.select('#' + current_dimension.id).select('.axis').select('path'));
        update_position_path(d3.select('#' + current_dimension.id).select(".brush"));
        d3.select('#' + current_dimension.id).selectAll('.tick').each(function (tick) {
            update_position_path_ticks(d3.select(this), y_scale_pcp_new[current_dimension.id].scale(tick));
        });

        function update_position_path(element) {
            element
                .transition()
                .duration(duration_time)
                .style('transform', 'translate(0px,' + translate_range_axis_y + 'px)');
        }

        function update_position_path_ticks(element, tickpos) {
            element
                .transition()
                .duration(duration_time)
                .style('transform', 'translate(0px,' + (translate_range_axis_y + tickpos) + 'px)');
        }

        function stay_position_upper_views(class_) {
            d3.select('#' + current_dimension.id).selectAll('.' + class_)
                .transition()
                .duration(duration_time)
                .style('transform', 'translate(30px,' + (bottom_buttons_width / 2 - range_axis) + 'px)rotate(-90deg)');
        }

        function stay_position_bottom_views(class_) {
            d3.select('#' + current_dimension.id).selectAll('.' + class_)
                .transition()
                .duration(duration_time)
                .style('transform', 'translate(-' + (pcp_new_height + 15) + 'px,118px)rotate(-90deg)');
        }
    }
}

function return_style_transform(current_dimension, duration_time) {

    y_scale_pcp_new[current_dimension.id].scale.range([pcp_new_height, 0]);

    d3.select('#' + current_dimension.id).select('.axis')
        .call(axis.scale(y_scale_pcp_new[current_dimension.id].scale));

    d3.select('#' + current_dimension.id).select('.' + id_statistics_background)
        .style('height', pcp_new_height);

    d3.select('#' + current_dimension.id).select('.' + id_statistics_background)
        .style('height', pcp_new_height);

    hide_show_drillup_down_buttons(current_dimension.id, 1);

    d3.select('#' + current_dimension.id).selectAll('*').each(function (element) {
        d3.select(this)
            .transition()
            .duration(duration_time)
            .style('transform', 'translate(0px,0px)rotate(0deg)')
            .on('end', function () {
                //d3.select(this).style('transform', '')
            })
    });

    d3.select('#' + current_dimension.id)
        .transition()
        .duration(duration_time)
        .attr('transform', 'translate(' + x_scale_pcp_new(current_dimension.id) + ')')
        //.style('transform', 'translate(0px,0px)rotate(0deg)')
        .on('end', function () {
            d3.select(this).style('transform', '')
        });

    d3.select('#' + current_dimension.id).select(".brush")
        .call(current_dimension.id.brush = d3.brushY()
            .extent([[-10, 0], [0, pcp_new_height]]) // only until 0 to still provide hovering for qualitative data frequencies
            .on("start", brushstart)
            .on("brush", brush)
            .on("end", brushend)
        );



}

function hide_show_drillup_down_buttons(current_dimension_id, opacity) {
    d3.select('#' + current_dimension_id).selectAll('.' + id_drillup_dimension).style('opacity', opacity)
        .attr('pointer-events', function () {
            return opacity === 0 ? 'none' : 'auto';
        });
    d3.select('#' + current_dimension_id).selectAll('.' + id_drilldown_dimension).style('opacity', opacity)
        .attr('pointer-events', function () {
            return opacity === 0 ? 'none' : 'auto';
        });
}

function hide_show_expansion_buttons(current_dimension_id, opacity) {
    d3.select('#' + current_dimension_id).selectAll('.' + id_expand_dimension).style('opacity', opacity)
        .attr('pointer-events', function () {
            return opacity === 0 ? 'none' : 'auto';
        });
    d3.select('#' + current_dimension_id).selectAll('.' + id_shrink_dimensions)
        .style('opacity', opacity)
        .attr('pointer-events', function () {
            return opacity === 0 ? 'none' : 'auto';
        });
}


function update_after_swapping(last_dim_id, current_dimension) {

    let dimension_svg = d3.select('#' + last_dim_id).attr('id', current_dimension.id);

    dimension_svg.select('.axis')
        .call(axis.scale(y_scale_pcp_new[current_dimension.id].scale));

    dimension_svg.select('.' + id_PC1PC2_text).text(current_dimension.PCone_or_two);

    let y_scale_variance = d3.scaleLinear()
        .domain([0, 100])
        .range([0, upper_vis_heights]);

    let variance_height = y_scale_variance(current_dimension.percentage_of_variance);

    let rect_variance_vis = dimension_svg.select('#' + id_percentage_of_variance_view)
        .attr('data-tippy-content', function (d, i) {
            return get_language_label_by_id(id_percentage_of_variance_view) + (current_dimension.percentage_of_variance).toFixed(0) + '% <br />' +
                get_language_label_by_id(language_id_eigenvalue) + current_dimension.eigenvalue.toFixed(2);
        });
    tippy(rect_variance_vis.nodes(), {allowHTML: true});


    let rect_variance = dimension_svg.select('#' + id_percentage_of_variance_view + id_contri_ending)
        .attr('data-tippy-content', function (d, i) {
            return get_language_label_by_id(id_percentage_of_variance_view) + (current_dimension.percentage_of_variance).toFixed(0) + '% <br />' +
                get_language_label_by_id(language_id_eigenvalue) + current_dimension.eigenvalue.toFixed(2);
        })
        //.transition()
        //.duration(duration_time)
        .attr('y', -upper_vis_heights - y_start_minus + (upper_vis_heights - variance_height))
        .style('height', variance_height + 'px');


    tippy(rect_variance.nodes(), {allowHTML: true});

    let sum_contribution = 0;
    for (let index_contribution = 0; index_contribution < current_dimension.contributing_variables.length; index_contribution++) {
        sum_contribution += current_dimension.contributing_variables[index_contribution].value;
    }

    let y_scale_contribution = d3.scaleLinear()
        .domain([0, sum_contribution])
        .range([0, upper_vis_heights - 1]);

    let color_scale_loading = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(['blue', 'white', 'red']);

    let y_contri = 0;

    current_dimension.loading_variables.sort((a, b) => a.value < b.value ? 1 : -1);

    let axis_svg_contribution = dimension_svg.select('#' + id_axis_svg_contribution);
    current_dimension.loading_variables.forEach(function (loading) {
        let contri = current_dimension.contributing_variables.filter(x => x.column_id === loading.column_id)[0];
        axis_svg_contribution.select('#' + contri.column_id + splitter + id_loadings_view + id_contri_ending)
            //.transition()
            //.duration(duration_time/2)
            .attr("y", -upper_vis_heights - y_start_minus + y_contri + 0.5)
            .attr("height", y_scale_contribution(contri.value))
            .style('fill', function () {
                return color_scale_loading(loading.value);
            });

        let current_tippy_instance = tippy_instances_contribution.filter(x => x.current_dimension === last_dim_id && x.contri === contri.column_id)[0];
        current_tippy_instance.current_dimension = current_dimension.id;

        current_tippy_instance.tippy.setContent(contri.column_id + "<br />" +
            get_language_label_by_id(language_id_contribution) + (contri.value).toFixed(0) + '% <br />' +
            get_language_label_by_id(language_id_loading) + loading.value.toFixed(2));

        y_contri += y_scale_contribution(contri.value);
    });


    let tick_lines_data = [];
    for (let i = 0; i < current_dimension.column_values.length; i++) {
        tick_lines_data.push({
            y: current_dimension.column_values[i],
            index: i
        })
    }

    d3.select('#' + current_dimension.id).selectAll('.' + id_tick_lines)
        .data(tick_lines_data)
        .transition().duration(duration_time)
        .attr("y1", function (d) {
            return y_scale_pcp_new[current_dimension.id].scale(d.y)
        })      // y position of the first end of the line
        .attr("y2", function (d) {
            return y_scale_pcp_new[current_dimension.id].scale(d.y)
        });   // y position of the second end of the line


    let scatterplot_svg = dimension_svg.select('.' + id_pc1pc2_scatterplot_svg);

    let width_pc2pc2 = width_scatterplot_PC1PC2 - margin_scatterplot_pc1pc2.left - margin_scatterplot_pc1pc2.right;
    let height_pc1pc2 = height_scatterplot_PC1PC2 - margin_scatterplot_pc1pc2.top - margin_scatterplot_pc1pc2.bottom;


    let y_scale_min = -1;
    let y_scale_max = 1;
    const offset_percentage = 0.05;
    let y_scale_offset = 0; //(y_scale_max - y_scale_min) * offset_percentage;

    let yScale_pc1pc2 = d3.scaleLinear()
        .domain([y_scale_min - y_scale_offset, y_scale_max + y_scale_offset])
        .range([height_pc1pc2, 0]);

    let other_pc_id = current_dimension.id.slice(0, -1) + 2;
    if (current_dimension.id.slice(-1) === '2') {
        other_pc_id = current_dimension.id.slice(0, -1) + 1;
    }

    let other_pc_dim = column_values_cleaned.filter(x => x.id === other_pc_id)[0];


    let x_scale_min = -1;
    let x_scale_max = 1;
    let x_scale_offset = (x_scale_max - x_scale_min) * offset_percentage;

    let xScale_pc1pc2 = d3.scaleLinear()
        .domain([x_scale_min - x_scale_offset, x_scale_max + offset_percentage])
        .range([0, width_pc2pc2]);

    //x axis
    scatterplot_svg.select(".x axis")
        .call(d3.axisBottom(xScale_pc1pc2).ticks(0));


    let data_for_scatterplot_pc1pc2 = [];
    for (let i = 0; i < current_dimension.column_values.length; i++) {

        let x_val = other_pc_dim.column_values[i];
        let y_val = current_dimension.column_values[i];

        if (!x_val) {
            x_val = -5;
        }
        if (!y_val) {
            y_val = -5;
        }
        data_for_scatterplot_pc1pc2.push({
            x: x_val,
            y: y_val,
            index: i
        })
    }

    scatterplot_svg.selectAll('circle')
        .data(data_for_scatterplot_pc1pc2)
        .transition().duration(duration_time)
        .attr("cx", function (d) {
            return xScale_pc1pc2(d.x);
        })
        .attr("cy", function (d) {
            return yScale_pc1pc2(d.y);
        });

    brushend(current_dimension.id);
    rotateCarousel(true);
}