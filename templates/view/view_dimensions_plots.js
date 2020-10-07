/**
 * This function initializes the dimension plots
 */
function initialize_dimensions_plots() {
    add_heading(id_dimensions, get_language_label_by_id(language_id_dimensions_heading)); // at first, the dimension heading is added

    // add all individual dimension plots
    for (let i = 0; i < dimension_plot_preferences.length; i++) {
        initialize_individual_dimension_plots(id_dimensions, dimension_plot_preferences[i].id);
        add_heading(dimension_plot_preferences[i].id, get_language_label_by_id(dimension_plot_preferences[i].label));


        add_content_div(dimension_plot_preferences[i].id);

        if (i === 0) {
            d3.select('#' + dimension_plot_preferences[i].id + id_content_ending).style('height', 'calc(100% - 2* var(--items_filter_legend_height) - 3* var(--main-margin) + 15px)');

            d3.select('#' + dimension_plot_preferences[i].id).append('div')
                .attr('id', dimension_plot_preferences[i].id + '_legend')
                .style('width', 100 + '%')
                .style('margin-top', 10 + 'px')
                .style('margin-bottom', 10 + 'px')
                .style('height', 20 + 'px');

            add_legend(d3.select('#' + dimension_plot_preferences[i].id + '_legend'));
        }

        //if (dimension_plot_preferences[i][key_id] === id_quantitative_dimensions || dimension_plot_preferences[i][key_id] === id_categorical_dimensions) {
        let append_filter_div = d3.select('#' + dimension_plot_preferences[i].id)
            .append('label').attr('id', dimension_plot_preferences[i].id + id_toggle_button_ending)
            .attr('class', id_toggle_button_class)
            .attr('data-tippy-content', get_language_label_by_id(language_id_tooltip_toggle_deviation));

        tippy(append_filter_div.nodes());

        append_filter_div.append('input').attr('type', 'checkbox').on('click', function (value) {

            if (this.checked) {
                dimension_plot_preferences[i].deviation = true;
                dimension_plot_preferences[i].scatterplot_x_axis = dimension_plot_preferences[i].scatterplot_x_axis + deviation_ending;
                dimension_plot_preferences[i].scatterplot_y_axis = dimension_plot_preferences[i].scatterplot_y_axis + deviation_ending;

            } else {
                dimension_plot_preferences[i].deviation = false;
                dimension_plot_preferences[i].scatterplot_x_axis = dimension_plot_preferences[i].scatterplot_x_axis.split(deviation_ending)[0];
                dimension_plot_preferences[i].scatterplot_y_axis = dimension_plot_preferences[i].scatterplot_y_axis.split(deviation_ending)[0];
            }
            update_dimension_scatterplot(dimension_plot_preferences[i].id + id_content_ending, dimension_plot_preferences[i]);
        });
        append_filter_div.append('span').attr('class', "slider round");
        // }

        if (dimension_plot_preferences[i][key_id] === id_likelihood_of_errors_dimensions) {
            initialize_run_famd_button(dimension_plot_preferences[i].id, id_data_type_identification_and_formatting_button);
            initialize_run_famd_pop_up_view(dimension_plot_preferences[i].id);
        }

        initialize_axis_changing_button(dimension_plot_preferences[i].id, id_axis_changing_button, 4, "resources/change_y_axis.png", id_scatterplot_y_axis, i, dimension_plot_preferences[i].all_descriptive_statistical_measures);
        initialize_axis_changing_button(dimension_plot_preferences[i].id, id_axis_changing_button, 5, "resources/change_x_axis.png", id_scatterplot_x_axis, i, dimension_plot_preferences[i].all_descriptive_statistical_measures);
    }
}

function add_legend(div_heading) {

    div_heading.append('svg').style('width', 100 + '%').style('height', 100 + '%');
    const space_to_left = 20;

    append_circle_and_text(0, color__numerical_data, id_data_type__numerical, "none", 1, 5);
    append_circle_and_text(1, color__categorical_data, id_data_type__categorical, "none", 1, 5);
    append_circle_and_text(2, color__date_data, id_data_type__date, "none", 1, 5);
    append_circle_and_text(2.8, color__numerical_data, language_id_opacity_missing_data, "none", 0.3, 5);

    let color_grad_mixed_datatype = div_heading.select('svg').append("defs").append("linearGradient").attr("id", "grad_legend")
        .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
    color_grad_mixed_datatype.append("stop").attr("offset", "50%").style("stop-color", color__numerical_data);
    color_grad_mixed_datatype.append("stop").attr("offset", "50%").style("stop-color", color__categorical_data);

    append_circle_and_text(4, 'white', language_id_group_legend, "black", 1, 9);
    append_circle_and_text(5, "url(#grad_legend)", language_id_group_legend_mixed_data, "black", 1, 9);


    div_heading.select('svg').append('line')
        .attr('x1', 1250 + space_to_left)
        .attr('y1', 10)
        .attr('x2', 1265 + space_to_left)
        .attr('y2', 10)
        .style('stroke', '#D3D3D3')
        .style('stroke-width', 1.5);

    div_heading.select('svg').append('text')
        .text(get_language_label_by_id(language_id_resulting_deviation))
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(' + (1250 + 25 + space_to_left) + ',' + (33 / 2) + ')');


    function append_circle_and_text(index, color, text, stroke, opacity, radius) {
        div_heading.select('svg').append('circle')
            .attr("cx", index * 200 + space_to_left)
            .attr("cy", 10)
            .attr("r", radius)
            .attr("stroke", stroke)
            .style('opacity', opacity)
            .style('fill', color);

        div_heading.select('svg').append('text')
            .text(get_language_label_by_id(text))
            .attr('text-anchor', 'start')
            .attr('transform', 'translate(' + (index * 200 + 20 + space_to_left) + ',' + (33 / 2) + ')');
    }
}

function initialize_axis_changing_button(parent_div_id, button_id, index_button, resource, axis_id, index_dimension_plot_preferences, all_descriptive_statistic_measures) {
    let axis_changing_div = d3.select('#' + parent_div_id).append('div').attr('id', parent_div_id + id_dimension_button_ending_div).attr('class', id_dimension_button_class)
        .attr('data-tippy-content', get_language_label_by_id(axis_id));

    tippy(axis_changing_div.nodes());


    let circle_width_height = parseFloat(getComputedStyle(axis_changing_div.node()).getPropertyValue(id_view_property_dimension_button_width_height));
    let circle_width_height_radius = circle_width_height - 2;

    axis_changing_div.style('right', index_button * circle_width_height + 'px');

    let svg_append_filter_button = axis_changing_div
        .append('svg').attr('id', parent_div_id + button_id + id_dimension_button_ending)
        .style('width', 100 + '%')
        .style('height', 100 + '%');


    svg_append_filter_button.append('circle')
        .attr("cx", circle_width_height_radius / 2)
        .attr("cy", circle_width_height_radius / 2 + 2)
        .attr("r", circle_width_height_radius / 2)
        .attr("stroke", "none")
        .style('fill', getComputedStyle(axis_changing_div.node()).getPropertyValue(id_view_propertiy_dimensions_background_color));

    let svg_width_height = circle_width_height_radius - 10;
    svg_append_filter_button.append("svg:image")
        .attr('x', circle_width_height_radius / 2 - svg_width_height / 2)
        .attr('y', circle_width_height_radius / 2 - svg_width_height / 2 + 2)
        .attr('width', svg_width_height)
        .attr('height', svg_width_height)
        .attr('fill', 'white')
        .attr("xlink:href", resource);

    svg_append_filter_button.on('click', function () {

        let index_descriptive_measure = all_descriptive_statistic_measures.indexOf(dimension_plot_preferences[index_dimension_plot_preferences][axis_id].split(deviation_ending)[0]) + 1;

        if (index_descriptive_measure === all_descriptive_statistic_measures.length) {
            index_descriptive_measure = 0;
        }
        dimension_plot_preferences[index_dimension_plot_preferences][axis_id] = all_descriptive_statistic_measures[index_descriptive_measure];

        if (dimension_plot_preferences[index_dimension_plot_preferences].deviation) {
            dimension_plot_preferences[index_dimension_plot_preferences][axis_id] = all_descriptive_statistic_measures[index_descriptive_measure] + deviation_ending;
        }

        update_dimension_scatterplot(dimension_plot_preferences[index_dimension_plot_preferences].id + id_content_ending, dimension_plot_preferences[index_dimension_plot_preferences]);
    });
}

/**
 * initialize individual dimension plots
 * @param parent_div_id
 * @param plot_id
 */
function initialize_individual_dimension_plots(parent_div_id, plot_id) {
    d3.select('#' + parent_div_id).append('div').attr('class', id_each_dimension_view_class)
        .attr('id', plot_id);
}


function initialize_dimension_scatterplot(parent_div_id, data_type, x_axis_key, y_axis_key, possible_correlations_bool) {

    let margin = {top: 5, right: 10, bottom: 40, left: 65};

    let width = parseFloat(window.getComputedStyle(d3.select('#' + parent_div_id).node(), null).getPropertyValue("width"))
        - margin.left - margin.right;
    let height = parseFloat(window.getComputedStyle(d3.select('#' + parent_div_id).node(), null).getPropertyValue("height"))
        - margin.top - margin.bottom;


    let columns_right_datatype = column_values_filtered.filter(col => data_type.indexOf(col[key_data_type]) > -1);

    let max_col_value_x = max_normalization_value; // since all x axis values are normalized

    let max_col_value_y = Math.max.apply(Math, columns_right_datatype.map(function (o) {
        return o.descriptive_statistics[y_axis_key];
    }));
    if (data_type.indexOf(id_data_type__numerical) > -1) {
        max_col_value_y = max_normalization_value;
    }


    let yScale;
    if (possible_correlations_bool) {
        yScale = d3.scaleBand().domain(data_type.concat(['group']))
            .rangeRound([0, height])
            .paddingInner(1)
            .paddingOuter(0.25);

    } else {
        yScale = d3.scaleLinear()
            .domain([0 - max_min_dimension_plot_add, max_col_value_y + max_min_dimension_plot_add])
            //.range([padding, w-padding * 2]);
            .range([height, 0]);
    }
    //scale function
    let xScale = d3.scaleLinear()
        .domain([0 - max_min_dimension_plot_add, max_col_value_x + max_min_dimension_plot_add])
        .range([0, width]);


    let left_axis = d3.axisLeft(yScale);


    if (!possible_correlations_bool) {
        dimension_plots_range_width_height = [width, height];
    } else {
        dimension_plots_range_width_height_likelihood = [width, height];
        left_axis.tickFormat(function (d) {
            return get_language_label_by_id(d)
        });
    }

    //create svg element
    let svg = d3.select('#' + parent_div_id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color_grad_mixed_datatype = svg.append("defs").append("linearGradient").attr("id", "grad")
        .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
    color_grad_mixed_datatype.append("stop").attr("offset", "50%").style("stop-color", color__numerical_data);
    color_grad_mixed_datatype.append("stop").attr("offset", "50%").style("stop-color", color__categorical_data);


    //x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr('id', id_x_axis_id)
        .call(d3.axisBottom(xScale));

    d3.select('#' + parent_div_id)
        .select("svg").append('text')
        .attr('class', 'axis-label')
        .attr('id', 'x_axis_label')
        .attr('x', width + margin.left)
        .attr('y', height + margin.bottom)
        .attr('text-anchor', 'end')
        .text(get_language_label_by_id(x_axis_key));

    //y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 0 + ", 0)")
        .attr('id', id_y_axis_id)
        .call(left_axis);

    d3.select('#' + parent_div_id)
        .select("svg").append('text')
        .attr('class', 'axis-label')
        .attr('id', 'y_axis_label')
        .attr('x', 0)
        .attr('y', 15)
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'end')
        .text(get_language_label_by_id(y_axis_key));


    if (!possible_correlations_bool) {
        //----------------------------add grid line
        var lineData_x = [{"x": 0, "y": 0}, {"x": 0, "y": max_col_value_y}];
        let lineData_y = [{'x': 0, 'y': 0}, {'x': max_col_value_x, 'y': 0}];

        let valueline = d3.line()
            .x(function (d) {
                return (xScale(d.x));
            })
            .y(function (d) {
                return yScale(d.y);
            });


        // Add the valueline path.
        svg.append("path")
            .attr('id', 'gridline_x')
            .attr("class", "gridline")
            .attr("d", valueline(lineData_x))
            .style('opacity', 0);

        // Add the valueline path.
        svg.append("path")
            .attr('id', 'gridline_y')
            .attr("class", "gridline")
            .attr("d", valueline(lineData_y))
            .style('opacity', 0);

        // Add the valueline path.
        svg.selectAll('.' + id_deviation_lines_class)
            .data(column_values_filtered)
            .enter()
            .append("path")
            .attr('id', function (d) {
                return d[key_id] + id_deviation_lines_class;
            })
            .attr("class", id_deviation_lines_class)
            .attr("d", function (d) {
                let line_data = [];
                let related_cleaned_col = column_values_cleaned.find(col => col[key_id] === d[key_id]);
                line_data.push({
                    x: related_cleaned_col.descriptive_statistics[x_axis_key],
                    y: related_cleaned_col.descriptive_statistics[y_axis_key]
                });
                line_data.push({x: d.descriptive_statistics[x_axis_key], y: d.descriptive_statistics[y_axis_key]});

                return valueline(line_data)
            })
            .style('stroke-width', stroke_width_deviation_lines)
            .style('opacity', opacity_deviation_lines);//0);
    }

    svg.call(d3.brush().extent([[0, 0], [width, height]]).on("brush", function (d) {
    })
        .on("end", function (d) {
            let s = d3.event.selection;
            brushed_dimensions = [];

            if (s !== null) {
                let x0 = s[0][0],
                    y0 = s[0][1],
                    dx = s[1][0] - x0,
                    dy = s[1][1] - y0;


                svg.selectAll('circle').each(function (d) {

                    let y_scale_value = yScale(d.descriptive_statistics[y_axis_key]);
                    if (possible_correlations_bool) {
                        y_scale_value = yScale(d[key_data_type]);

                        if (d.PCone_or_two) {
                            y_scale_value = yScale('group');
                        }
                    }

                    if (xScale(d.descriptive_statistics[x_axis_key]) >= x0 && xScale(d.descriptive_statistics[x_axis_key]) <= x0 + dx && y_scale_value >= y0 && y_scale_value <= y0 + dy) {

                        brushed_dimensions.push(d.id);
                    }
                });
            }

            if (allow_dragging.filter(x => x.draggable === false).length === 0) {

                column_values_filtered.sort((a, b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);
                column_values_filtered.sort((a, b) => brushed_dimensions.indexOf(a.id) > brushed_dimensions.indexOf(b.id) ? -1 : 1);

                column_values_grouped.sort((a, b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);
                column_values_grouped.sort((a, b) => brushed_dimensions.indexOf(a.id) > brushed_dimensions.indexOf(b.id) ? -1 : 1);

                selectedIndex = 0;


                rotateCarousel(true);
            }
        }));

    let all_circles = svg.selectAll('circle')
        .data(column_values_filtered.filter(x => x.PCone_or_two !== id_PC2 && data_type.includes(x[key_data_type])))
        .enter()
        .append("circle")
        .on('click', function (d) {

            highlight_dimension(d[key_id]);
            highlight_circles(d[key_id]);
        })
        .attr('data-tippy-content', function (d) {
            return append_tooltip_radar_chart_and_heading(parent_div_id, d, false);
        })
        .on("mouseover", function (d) {
            d3.select(this).style('opacity', 1);

            d3.select('#' + d[key_id] + id_deviation_lines_class).style('opacity', 1)
                .style('stroke-width', 3);
        })
        .on("mouseout", function (d) {
            d3.select(this).style('opacity', function (d) {
                let opacity = 1 - column_values_filtered.filter(col => col[key_id] === d[key_id])[0].descriptive_statistics.missing_values_percentage;//[key_column_values].length / column_values_cleaned.find(col => col[key_id] === d[key_id])[key_column_values].length;

                return opacity < min_opacity ? min_opacity : opacity;
            });

            d3.select('#' + d[key_id] + id_deviation_lines_class).style('opacity', opacity_deviation_lines)
                .style('stroke-width', stroke_width_deviation_lines);

        })
        .transition().duration(animation_duration_time)
        .attr('id', function (d) {
            return d.id + id_circle_dimension_ending;
        })
        .attr("cx", function (d) {
            if (d.descriptive_statistics[x_axis_key] === undefined) {
                return xScale(50);
            }
            return xScale(d.descriptive_statistics[x_axis_key]);
        })
        .attr("cy", function (d) {
            if (possible_correlations_bool) {
                if (d.PCone_or_two) {
                    return yScale('group');
                }
                return yScale(d[key_data_type])
            }

            if (d.descriptive_statistics[y_axis_key] === undefined) {
                return yScale(-100);
            }

            return yScale(d.descriptive_statistics[y_axis_key]);
        })
        .attr("r", function (d) {
            if (d['PCone_or_two']) {
                return 9;
            }
            return 5;
        })
        .style('stroke-width', function (d) {
            if (d['PCone_or_two']) {
                return 2 + 'px';
            }
            return 0 + 'px';
        })
        .style('stroke', 'black')
        .style('opacity', function (d) {
            let opacity = 1 - column_values_filtered.filter(col => col[key_id] === d[key_id])[0].descriptive_statistics.missing_values_percentage;//[key_column_values].length / column_values_cleaned.find(col => col[key_id] === d[key_id])[key_column_values].length;

            return opacity < min_opacity ? min_opacity : opacity;
        })
        .attr("fill", function (d) {
            if (d['PCone_or_two']) {
                let contri_categorical = false;
                let contri_numerical = false;
                d.contributing_variables.forEach(function (contri) {
                    let related_contri_dim = column_values_cleaned.filter(x => x.id === contri.column_id)[0];

                    if (related_contri_dim.data_type === id_data_type__numerical || related_contri_dim.data_type === id_data_type__date) {
                        contri_numerical = true;
                    }

                    if (related_contri_dim.data_type === id_data_type__categorical) {
                        contri_categorical = true;
                    }
                });

                if (contri_categorical && contri_numerical) {
                    return "url(#grad)";
                } else if (contri_categorical) {
                    return color__categorical_data;
                } else if (contri_numerical) {
                    return color__numerical_data;
                }
            } else if (d[key_data_type] === id_data_type__numerical) {
                return color__numerical_data;
            } else if (d[key_data_type] === id_data_type__categorical) {
                return color__categorical_data;
            } else if (d[key_data_type] === id_data_type__date) {
                return color__date_data;
            }
        });
    //.call(d3.helper.tooltip());

    tippy_instance_circles.push({
        parent_div_id: parent_div_id,
        tippy: tippy(all_circles.nodes(), {allowHTML: true})
    });
}

let tippy_instance_circles = [];

function update_dimension_views() {
    // add all individual dimension plots
    for (let i = 0; i < dimension_plot_preferences.length; i++) {

        update_dimension_scatterplot(dimension_plot_preferences[i].id + id_content_ending, dimension_plot_preferences[i]);
    }


    update_dimension_scatterplot(id_likelihood_of_correlation + id_content_ending, likelihood_of_correlation_plot_preferences, true)
}


function update_dimension_scatterplot(parent_div_id, dimension_plot_pref, possible_correlations_bool) {

    let data_type = dimension_plot_pref.datatype;
    let x_axis_key = dimension_plot_pref.scatterplot_x_axis;
    let y_axis_key = dimension_plot_pref.scatterplot_y_axis;

    let columns_right_datatype = column_values_filtered.filter(col => data_type.indexOf(col[key_data_type]) > -1);


    let min_col_value_x = 0;
    let min_col_value_y = 0;


    if (dimension_plot_pref.deviation) {

        min_col_value_x = Math.min.apply(Math, columns_right_datatype.map(function (o) {
            return o.descriptive_statistics[x_axis_key];
        }));

        if (x_axis_key !== number_of_modes + deviation_ending && x_axis_key !== statistics_key__amount_of_categories + deviation_ending) {
            min_col_value_x = min_normalized_deviation_value;
        }

        min_col_value_y = Math.min.apply(Math, columns_right_datatype.map(function (o) {
            return o.descriptive_statistics[y_axis_key];
        }));

        if (y_axis_key !== number_of_modes + deviation_ending && y_axis_key !== statistics_key__amount_of_categories + deviation_ending) {
            min_col_value_y = min_normalized_deviation_value;
        }
    }

    let max_col_value_x = Math.max.apply(Math, columns_right_datatype.map(function (o) {
        return o.descriptive_statistics[x_axis_key];
    }));

    if (x_axis_key !== number_of_modes && x_axis_key !== statistics_key__amount_of_categories) {
        max_col_value_x = max_normalization_value;
    }

    let max_col_value_y = Math.max.apply(Math, columns_right_datatype.map(function (o) {
        return o.descriptive_statistics[y_axis_key];
    }));
    if (y_axis_key !== number_of_modes && y_axis_key !== statistics_key__amount_of_categories) {
        max_col_value_y = max_normalization_value;
    }


    //scale function
    let xScale = d3.scaleLinear()
        .domain([min_col_value_x - max_min_dimension_plot_add, max_col_value_x + max_min_dimension_plot_add])
        .range([0, dimension_plots_range_width_height[0]]);


    let yScale;
    let left_axis;

    if (possible_correlations_bool) {
        yScale = d3.scaleBand().domain(data_type.concat(['group']))
            .rangeRound([0, dimension_plots_range_width_height_likelihood[1]])
            .paddingInner(1)
            .paddingOuter(0.25);

        left_axis = d3.axisLeft(yScale);
        left_axis.tickFormat(function (d) {
            return get_language_label_by_id(d)
        });


        xScale = d3.scaleLinear()
            .domain([min_col_value_x - max_min_dimension_plot_add, max_col_value_x + max_min_dimension_plot_add])
            .range([0, dimension_plots_range_width_height_likelihood[0]]);
    } else {
        yScale = d3.scaleLinear()
            .domain([min_col_value_y - max_min_dimension_plot_add, max_col_value_y + max_min_dimension_plot_add])
            .range([dimension_plots_range_width_height[1], 0]);

        left_axis = d3.axisLeft(yScale);

    }

    //get svg element
    let svg = d3.select('#' + parent_div_id)
        .select("svg")
        .select("g");

    svg.select('#' + id_y_axis_id)
        .transition().duration(animation_duration_time)
        .call(left_axis);

    let bottomScale = d3.axisBottom(xScale);
/*    if (x_axis_key === number_of_modes) {
        xScale = d3.scaleLog().clamp(true).domain([0.1, max_col_value_x + max_min_dimension_plot_add]).range([0, dimension_plots_range_width_height[0]]).nice();
        // bottomScale = d3.axisBottom(xScale).tickFormat(d3.format(".0s"));
    }*/
    svg.select('#' + id_x_axis_id)
        .transition().duration(animation_duration_time)
        .call(bottomScale);

    svg.call(d3.brush().on("brush", function (d) {
    }).on("end", function (d) {
        let s = d3.event.selection;
        brushed_dimensions = [];

        if (s !== null) {
            let x0 = s[0][0],
                y0 = s[0][1],
                dx = s[1][0] - x0,
                dy = s[1][1] - y0;


            svg.selectAll('circle').each(function (d) {
                let y_scale_value = yScale(d.descriptive_statistics[y_axis_key]);
                if (possible_correlations_bool) {

                    y_scale_value = yScale(d[key_data_type]);

                    if (d.PCone_or_two) {
                        y_scale_value = yScale('group');
                    }
                }

                if (xScale(d.descriptive_statistics[x_axis_key]) >= x0 && xScale(d.descriptive_statistics[x_axis_key]) <= x0 + dx && y_scale_value >= y0 && y_scale_value <= y0 + dy) {

                    brushed_dimensions.push(d.id);
                }
            });
        }

        column_values_filtered.sort((a, b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);
        column_values_filtered.sort((a, b) => brushed_dimensions.indexOf(a.id) > brushed_dimensions.indexOf(b.id) ? -1 : 1);

        column_values_grouped.sort((a, b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);
        column_values_grouped.sort((a, b) => brushed_dimensions.indexOf(a.id) > brushed_dimensions.indexOf(b.id) ? -1 : 1);

        selectedIndex = 0;

        rotateCarousel(true);

    }));
    // Update circles
    svg.selectAll("circle")
        .data(column_values_filtered.filter(x => x.PCone_or_two !== id_PC2))  // Update with new data
        .attr('id', function (d) {
            return d.id + id_circle_dimension_ending;
        })
        .transition()  // Transition from old to new
        .duration(animation_duration_time)  // Length of animation
        .attr("cx", function (d) {
            if (d.descriptive_statistics[x_axis_key] === undefined || data_type.indexOf(d[key_data_type]) === -1) {
                return xScale(50);
            }
            return xScale(d.descriptive_statistics[x_axis_key]);
        })
        .attr("cy", function (d) {
            if (possible_correlations_bool) {
                if (d.PCone_or_two) {
                    return yScale('group');
                }
                return yScale(d[key_data_type])
            }
            if (d.descriptive_statistics[y_axis_key] === undefined || data_type.indexOf(d[key_data_type]) === -1) {
                return yScale(-400);
            }
            return yScale(d.descriptive_statistics[y_axis_key]);
        })
        .attr("r", function (d) {
            if (d['PCone_or_two']) {
                return 9;
            }
            return 5;
        })
        .style('stroke-width', function (d) {

            if (d['PCone_or_two']) {
                return 2 + 'px';
            }
            return 0 + 'px';
        })
        .style('stroke', 'black')
        .style('opacity', function (d) {

            if (column_values_filtered.find(col => col[key_id] === d[key_id]) && column_values_cleaned.find(col => col[key_id] === d[key_id])) {
                let opacity = 1 - column_values_filtered.filter(col => col[key_id] === d[key_id])[0].descriptive_statistics.missing_values_percentage;//[key_column_values].length / column_values_cleaned.find(col => col[key_id] === d[key_id])[key_column_values].length;
                return opacity < min_opacity ? min_opacity : opacity;
            } else {
                return 0;
            }
        })
        .attr("fill", function (d) {

            if (d['PCone_or_two']) {
                let contri_categorical = false;
                let contri_numerical = false;
                d.contributing_variables.forEach(function (contri) {

                    let related_contri_dim = column_values_filtered.filter(x => x.id === contri.column_id)[0];
                    if (related_contri_dim.data_type === id_data_type__numerical || related_contri_dim.data_type === id_data_type__date) {
                        contri_numerical = true;
                    }

                    if (related_contri_dim.data_type === id_data_type__categorical) {
                        contri_categorical = true;
                    }
                });

                if (contri_categorical && contri_numerical) {
                    return "url(#grad)";
                } else if (contri_categorical) {
                    return color__categorical_data;
                } else if (contri_numerical) {
                    return color__numerical_data;
                }
            } else if (d[key_data_type] === id_data_type__numerical) {
                return color__numerical_data;
            } else if (d[key_data_type] === id_data_type__categorical) {
                return color__categorical_data;
            } else if (d[key_data_type] === id_data_type__date) {
                return color__date_data;
            }
        });


    let current_tippy_instance = tippy_instance_circles.map(col => col['parent_div_id']).indexOf(parent_div_id);


    let deviation_ = false;
    if (parent_div_id === id_likelihood_of_correlation + id_content_ending) {
        deviation_ = true;
    } else if (dimension_plot_pref.deviation) {
        deviation_ = true;
    }
    svg.selectAll('circle').each(function (circle, i) {
        tippy_instance_circles[current_tippy_instance].tippy[i].setContent(append_tooltip_radar_chart_and_heading(parent_div_id, circle, deviation_));
    });


    d3.select('#' + parent_div_id).select('#x_axis_label')
        .text(get_language_label_by_id(x_axis_key));


    if (!possible_correlations_bool) {

        d3.select('#' + parent_div_id).select('#y_axis_label')
            .text(get_language_label_by_id(y_axis_key));

        let lineData_x = [{"x": 0, "y": min_col_value_y - max_min_dimension_plot_add}, {
            "x": 0,
            "y": max_col_value_y + max_min_dimension_plot_add
        }];
        let lineData_y = [{
            'x': min_col_value_x - max_min_dimension_plot_add,
            'y': 0
        }, {'x': max_col_value_x + max_min_dimension_plot_add, 'y': 0}];

        let valueline = d3.line()
            .x(function (d) {
                return xScale(d.x);
            })
            .y(function (d) {
                return yScale(d.y);
            });


        // change background color
        if (dimension_plot_pref.deviation) {
            d3.select('#' + parent_div_id).transition().duration(animation_duration_time).style('background-color', '#E8E8E8');

            // Add the valueline path.
            svg.select('#gridline_x')
                .transition()
                .duration(animation_duration_time)
                .attr("d", valueline(lineData_x))
                .style('opacity', 1);

            // Add the valueline path.
            svg.select('#gridline_y')
                .transition()
                .duration(animation_duration_time)
                .attr("d", valueline(lineData_y))
                .style('opacity', 1);

            // Add the valueline path.
            svg.selectAll("." + id_deviation_lines_class)
                .data(column_values_filtered)
                .attr('id', function (d) {
                    return d[key_id] + id_deviation_lines_class;
                })
                .transition()
                .duration(animation_duration_time)
                .attr("d", function (d) {
                    let line_data = [];
                    let related_cleaned_col = column_values_cleaned.find(col => col[key_id] === d[key_id]);
                    line_data.push({
                        x: related_cleaned_col.descriptive_statistics[x_axis_key],
                        y: related_cleaned_col.descriptive_statistics[y_axis_key]
                    });
                    line_data.push({x: d.descriptive_statistics[x_axis_key], y: d.descriptive_statistics[y_axis_key]});

                    return valueline(line_data)
                })
                .style('stroke-width', stroke_width_deviation_lines)
                .style('opacity', opacity_deviation_lines);//0);
        } else {
            d3.select('#' + parent_div_id).transition().duration(animation_duration_time).style('background-color', 'white');

            // Add the valueline path.
            svg.select('#gridline_x')
                .transition()
                .duration(animation_duration_time)
                .attr("d", valueline(lineData_x))
                .style('opacity', 0);

            // Add the valueline path.
            svg.select('#gridline_y')
                .transition()
                .duration(animation_duration_time)
                .attr("d", valueline(lineData_y))
                .style('opacity', 0);

            // Add the valueline path.
            svg.selectAll("." + id_deviation_lines_class)
                .data(column_values_filtered)
                .attr('id', function (d) {
                    return d[key_id] + id_deviation_lines_class;
                })
                .transition()
                .duration(animation_duration_time)
                .attr("d", function (d) {
                    let line_data = [];
                    let related_cleaned_col = column_values_cleaned.find(col => col[key_id] === d[key_id]);

                    if (column_values_filtered.find(col => col[key_id] === d[key_id]) && column_values_cleaned.find(col => col[key_id] === d[key_id])) {

                        line_data.push({
                            x: related_cleaned_col.descriptive_statistics[x_axis_key],
                            y: related_cleaned_col.descriptive_statistics[y_axis_key]
                        });
                        line_data.push({
                            x: d.descriptive_statistics[x_axis_key],
                            y: d.descriptive_statistics[y_axis_key]
                        });
                    } else {
                        line_data.push({
                            x: 0, y: 0
                        });
                        line_data.push({
                            x: 0, y: 0
                        });
                    }
                    return valueline(line_data)
                })
                .style('stroke-width', stroke_width_deviation_lines)
                .style('opacity', opacity_deviation_lines);//1);

        }
    }
}

function myfunction() {
    console.log('click')
    context_menu_instance.hide();
    open_run_famd_view(id_likelihood_of_errors_dimensions, brushed_dimensions);

}

let context_menu_instance;

function add_context_menu() {

    let div = document.createElement('div')
    d3.select(div).attr('id', 'template')
        .style('display', 'none')
        .append('p')
        .text(get_language_label_by_id(language_id_run_dimensionality_reduction))
        .attr('onclick', "myfunction()");


    d3.select('#' + id_dimensions).select('.' + 'selection').attr('id', 'selection')

    //const rightClickableArea = d3.select('#'+ id_dimensions).select('.'+ 'selection').node().parentNode; //document.querySelector('.'+ 'selection');
    const rightClickableArea = document.querySelector('#' + 'likelihood_of_errors_dimensions_content');

    context_menu_instance = tippy(rightClickableArea, {
        content: div.innerHTML,
        placement: 'right-start',
        trigger: 'manual',
        interactive: true,
        arrow: false,
        allowHTML: true,
        //hideOnClick: true,
        offset: [0, 0]
    });

    rightClickableArea.addEventListener('contextmenu', event => {
        event.preventDefault();

        context_menu_instance.setProps({
            getReferenceClientRect: () => ({
                width: 0,
                height: 0,
                top: event.clientY,
                bottom: event.clientY,
                left: event.clientX,
                right: event.clientX
            })
        });

        context_menu_instance.show();
    });

}