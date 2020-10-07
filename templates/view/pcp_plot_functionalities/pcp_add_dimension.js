function add_dimensions() {

    // use forEach instead of .data().enter() because updating data is not working. I'm too stupid probably. haha
    dimensions.forEach(function (dim) {

        let current_dim_g = svg_pcp_new
            .data(dim)
            .append("g")
            .attr("class", id_class_dimension)
            .attr('id', dim)
            .attr("transform", "translate(" + position(dim) + ")")
            .call(dim.drag = d3.drag()
                .subject(function () {
                    //if (allow_dragging.filter(x => x.draggable === false).length === 0) {
                        dim = this.id;
                        return {x: x_scale_pcp_new(dim)};
                    //}
                })
                .on("start", function () {
                    //if (allow_dragging.filter(x => x.draggable === false).length === 0) {
                        dim = this.id;
                        dragging[dim] = x_scale_pcp_new(dim);
                    //}
                })
                .on("drag", function () {

                    //if (allow_dragging.filter(x => x.draggable === false).length === 0) {
                        dim = this.id;
                        dragging[dim] = Math.min(width_pcp_new, Math.max(0, d3.event.x));
                        foreground_pcp_new.attr("d", path);
                        dimensions.sort(function (a, b) {
                            return position(a) - position(b);
                        });
                        x_scale_pcp_new.domain(dimensions);

                        d3.selectAll('.dimension').each(function (d) {

                            d3.select('#' + this.id).attr("transform", "translate(" + position(this.id) + ")");
                        })
                   // }
                })
                .on("end", function () {
                   // if (allow_dragging.filter(x => x.draggable === false).length === 0) {
                        dim = this.id;
                        delete dragging[dim];

                        let transform_x = x_scale_pcp_new(dim);
                        if (transform_x) {
                            transition(d3.select(this)).attr("transform", "translate(" + x_scale_pcp_new(dim) + ")");
                            transition(foreground_pcp_new).attr("d", path);
                        }

                        column_values_grouped.sort(function(x, y) {
                            if (dimensions.includes(x.id) && dimensions.includes(y.id)) {
                                if (dimensions.indexOf(x.id) < dimensions.indexOf(y.id)) {
                                    return -1;
                                }
                                if (dimensions.indexOf(x.id) > dimensions.indexOf(y.id)) {
                                    return 1;
                                }
                            }
                            return 0;
                        });
                   // }
                }));


        let dim_split = dim.split(id_duplicate_dimensions)[0];

        if (!dim.includes(id_duplicate_dimensions) && !dimensions_new.includes(dim + id_duplicate_dimensions)) {
            // Add an axis and title.
            current_dim_g.append("g")
                .attr("class", "axis");

            let axis_svg = current_dim_g.select('.axis');

            axis_svg.append('rect')
                .attr('id', dim + splitter + id_contribution_background)
                .attr('class', id_contribution_background)
                .attr("x", -x_scale_pcp_new.step() / 2)
                .attr('y', 0)
                .style('height', pcp_new_height + margin_pcp_plot_new.bottom)
                .style("width", x_scale_pcp_new.step())
                .style('fill', 'white')
                .style('opacity', 0.2);


            axis_svg.call(axis.scale(y_scale_pcp_new[dim_split].scale))
                .append("text")
                .attr('id', dim + splitter + id_axis_label_text)
                .attr('class', id_axis_label_text)
                .style("text-anchor", "middle")
                .attr("y", -9)
                .style('fill', 'black')
                .style("font-size", "12px")
                .text(function () {
                    let name = y_scale_pcp_new[dim_split].header;
                    if (name.length > 12) {
                        return name.substring(0, 12) + "...";
                    } else return name;
                })
                .attr('data-tippy-content', function (d, i) {
                    return y_scale_pcp_new[dim_split].header;
                })
                .on('click', function (d) {
                    highlight_circles(dim_split);
                });

            current_dim_g.selectAll('.tick').each(function (tick) {
                if (tick.length > 12) {
                    d3.select(this).select('text').text(tick.substring(0, 12) + '...')
                }

                d3.select(this).select('text').attr('data-tippy-content', function (d, i) {
                    return tick;
                })
            });

            tippy(current_dim_g.selectAll('text').nodes());

            axis_svg.append("rect")
                .attr('id', dim + splitter + id_statistics_background)
                .attr('class', id_statistics_background)
                .attr("x", 0)
                .attr('y', 0)
                .style('height', 'calc(' + 100 + '% - ' + (margin_pcp_plot_new.bottom + margin_pcp_plot_new.top) + 'px)')
                .style("width", 10)
                .style('fill', function () {

                    let descr_value = column_values_cleaned.find(x => x.id === dim_split).descriptive_statistics[sort_parallel_coordinates_by];
                    if (descr_value === -1) {
                        return newly_generated_group_background_color;
                    }
                    return statistics_scale(descr_value);
                })
                .style('opacity', opacity_path);

            let current_dimension = column_values_cleaned.find(x => x.id === dim_split);


            // --------------------------------------add group upper parts

            let rect_missing_vis = axis_svg.append("rect")
                .attr('id', dim + splitter + id_percentage_of_missing_values)
                .attr('class', id_percentage_of_missing_values)
                .attr("x", -5)
                .attr('y', -missing_values_vis_height - y_start_minus)
                .style('height', missing_values_vis_height + 'px')
                .style("width", 10)
                .style('fill', 'white')
                .style('stroke', color_upper_vis_missing_values)
                .style("stroke-width", "1px")
                .style('opacity', 1)
                .attr('data-tippy-content', function (d, i) {
                    return get_language_label_by_id(id_percentage_of_missing_values) + (100 * (1-current_dimension.descriptive_statistics.missing_values_percentage)).toFixed(0) + '%';
                });
            tippy(rect_missing_vis.nodes());

            let y_scale_missing_value = d3.scaleLinear()
                .domain([0, 1])
                .range([0, missing_values_vis_height]);

            let missing_values_height = y_scale_missing_value(1-current_dimension.descriptive_statistics.missing_values_percentage);

            let rect_missing = axis_svg.append("rect")
                .attr('id', dim + splitter + id_percentage_of_missing_values)
                .attr('class', id_percentage_of_missing_values)
                .attr("x", -5)
                .attr('y', -(missing_values_vis_height + y_start_minus) + (missing_values_vis_height - missing_values_height))
                .style('height', missing_values_height + 'px')
                .style("width", 10)
                .style('fill', color_upper_vis_missing_values)
                .style('opacity', 1)
                .attr('data-tippy-content', function (d, i) {
                    return get_language_label_by_id(id_percentage_of_missing_values) + (100 * (1-current_dimension.descriptive_statistics.missing_values_percentage)).toFixed(0) + '%';
                });
            tippy(rect_missing.nodes());


            if (column_values_grouped.filter(x => x.id === dim_split)[0].type_element_group === 'group') {

                add_context_menu_pcp(current_dimension);

                axis_svg.on('contextmenu', function () {
                    open_context_menu(current_dimension, [d3.event.pageX, d3.event.pageY - 50]);
                    d3.event.preventDefault();
                });

                axis_svg.select('.domain').style('stroke-width', function () {
                    let stroke_width = min_stroke_width_group + current_dimension.contributing_variables.length * 0.25;
                    if (stroke_width > max_stroke_width_group) {
                        stroke_width = max_stroke_width_group;
                    }
                    return stroke_width;
                });

                let tick_lines_data = [];
                for (let i = 0; i < current_dimension.column_values.length; i++) {
                    tick_lines_data.push({
                        y: current_dimension.column_values[i],
                        index: i
                    })
                }

                axis_svg.selectAll('line')
                    .data(tick_lines_data)
                    .enter()
                    .append("line")
                    .attr('class', id_tick_lines)
                    .style("stroke", '#34008B')  // colour the line
                    .style("stroke-width", 2)
                    .attr("x1", 0)     // x position of the first end of the line
                    .attr("y1", function (d) {
                        return y_scale_pcp_new[current_dimension.id].scale(d.y)
                    })      // y position of the first end of the line
                    .attr("x2", 12)     // x position of the second end of the line
                    .attr("y2", function (d) {
                        return y_scale_pcp_new[current_dimension.id].scale(d.y)
                    })   // y position of the second end of the line
                    .style('opacity', function (d) {
                        return opacity_path;
                    })
                    .attr("visibility", "hidden");


                let y_scale_variance = d3.scaleLinear()
                    .domain([0, 100])
                    .range([0, upper_vis_heights]);

                let variance_height = y_scale_variance(current_dimension.percentage_of_variance);

                let rect_variance_vis = axis_svg.append("rect")
                    .attr('id', id_percentage_of_variance_view)
                    .attr('class', id_percentage_of_variance_view)
                    .attr("x", -30)
                    .attr('y', -upper_vis_heights - y_start_minus)
                    .style('height', upper_vis_heights + 'px')
                    .style("width", 20)
                    .style('fill', 'white')
                    .style('stroke', color_upper_vis_variance)
                    .style("stroke-width", "1px")
                    .style('opacity', 1)
                    .attr('data-tippy-content', function (d, i) {
                        return get_language_label_by_id(id_percentage_of_variance_view) + (current_dimension.percentage_of_variance).toFixed(0) + '% <br />' +
                            get_language_label_by_id(language_id_eigenvalue) + current_dimension.eigenvalue.toFixed(2);
                    });
                tippy(rect_variance_vis.nodes(), {allowHTML: true});

                let rect_variance = axis_svg.append("rect")
                    .attr('id', id_percentage_of_variance_view + id_contri_ending)
                    .attr('class', id_percentage_of_variance_view)
                    .attr("x", -30)
                    .attr('y', -upper_vis_heights - y_start_minus + (upper_vis_heights - variance_height))
                    .style('height', variance_height + 'px')
                    .style("width", 20)
                    .style('fill', color_upper_vis_variance)
                    .style('opacity', 1)
                    .attr('data-tippy-content', function (d, i) {
                        return get_language_label_by_id(id_percentage_of_variance_view) + (current_dimension.percentage_of_variance).toFixed(0) + '% <br />' +
                            get_language_label_by_id(language_id_eigenvalue) + current_dimension.eigenvalue.toFixed(2);
                    });
                tippy(rect_variance.nodes(), {allowHTML: true});

                axis_svg.append("rect")
                    .attr('id', id_loadings_view)
                    .attr('class', id_loadings_view)
                    .attr("x", 10)
                    .attr('y', -upper_vis_heights - y_start_minus)
                    .style('height', upper_vis_heights + 'px')
                    .style("width", 20)
                    .style('fill', 'white')
                    .style('stroke', color_upper_vis_contribution)
                    .style("stroke-width", "1px")
                    .style('opacity', 1);

                let axis_svg_contribution = axis_svg.append('g')
                    .attr('id', id_axis_svg_contribution)
                    .attr("x", 10)
                    .attr('y', -upper_vis_heights - y_start_minus)
                    .style('height', upper_vis_heights + 'px')
                    .style("width", 20);

                let sum_contribution = 0;
                for (let index_contribution = 0; index_contribution < current_dimension.contributing_variables.length; index_contribution++) {
                    sum_contribution += current_dimension.contributing_variables[index_contribution].value;
                }
                let y_scale_contribution = d3.scaleLinear()
                    .domain([0, sum_contribution])
                    .range([0, upper_vis_heights - 1]);

                let y_contri = 0;

                current_dimension.loading_variables.sort((a, b) => a.value < b.value ? 1 : -1);

                current_dimension.loading_variables.forEach(function (loading) {
                    let contri = current_dimension.contributing_variables.filter(x => x.column_id === loading.column_id)[0];
                    let rect_contri = axis_svg_contribution.append('rect')
                        .attr('id', contri.column_id + splitter + id_loadings_view + id_contri_ending)
                        .attr('class', id_loadings_view)
                        .attr("x", 10.5)
                        .attr("y", -upper_vis_heights - y_start_minus + y_contri + 0.5)
                        .attr("height", y_scale_contribution(contri.value))
                        .attr("width", 19)
                        .style('stroke', color_upper_vis_contribution)
                        .style("stroke-width", "0.5px")
                        .style('fill', function () {
                            return color_scale_loading(loading.value);
                        });

                    let tippy_instance = tippy(rect_contri.node(), {
                        allowHTML: true, dynamicTitle: true,
                        content: contri.column_id + "<br />" +
                            get_language_label_by_id(language_id_contribution) + (contri.value).toFixed(0) + '% <br />' +
                            get_language_label_by_id(language_id_loading) + loading.value.toFixed(2)
                    });

                    tippy_instances_contribution.push({
                        current_dimension: current_dimension.id,
                        contri: contri.column_id,
                        tippy: tippy_instance
                    });

                    y_contri += y_scale_contribution(contri.value)
                });


                axis_svg
                    .append("text")
                    .attr('x', 0)
                    .attr('y', pcp_new_height + (margin_pcp_plot_new.bottom / 2))
                    .attr('class', id_PC1PC2_text)
                    .style("text-anchor", "middle")
                    .style('fill', 'black')
                    .style("font-size", "12px")
                    .text(current_dimension.PCone_or_two);

                add_bottom_buttons(axis_svg, current_dimension, current_dim_g);

                let x_pos_scatterplot_PC1PC2 = x_scale_pcp_new.step() / 2;
                width_scatterplot_PC1PC2 = 2 * x_pos_scatterplot_PC1PC2;
                height_scatterplot_PC1PC2 = parseFloat(window.getComputedStyle(svg_pcp_new.node().parentNode, null).getPropertyValue("height")) - (margin_pcp_plot_new.bottom + margin_pcp_plot_new.top - 9);

                let scatterplot_svg = axis_svg.append('svg')
                    .attr('id', current_dimension.id + id_pc1pc2_scatterplot_svg)
                    .attr('class', id_pc1pc2_scatterplot_svg)
                    .attr("x", -x_pos_scatterplot_PC1PC2 + 'px')
                    .attr('y', -5)
                    .style('height', height_scatterplot_PC1PC2) //'calc(' + 100 + '% - ' + (margin_pcp_plot_new.bottom + margin_pcp_plot_new.top - 10) + 'px)')
                    .style("width", width_scatterplot_PC1PC2 + 'px')
                    .attr('visibility', 'hidden');

                scatterplot_svg.append('rect')
                    .attr("x", 0 + 'px')
                    .attr('y', 0)
                    .style('height', height_scatterplot_PC1PC2 + 'px')
                    .style("width", width_scatterplot_PC1PC2 + 'px')
                    .style('fill', 'white');

                let width_pc2pc2 = width_scatterplot_PC1PC2 - margin_scatterplot_pc1pc2.left - margin_scatterplot_pc1pc2.right;
                let height_pc1pc2 = height_scatterplot_PC1PC2 - margin_scatterplot_pc1pc2.top - margin_scatterplot_pc1pc2.bottom;

                let y_scale_min = d3.min(current_dimension.column_values);
                let y_scale_max = d3.max(current_dimension.column_values);
                const offset_percentage = 0.05;
                let y_scale_offset = 0; //(y_scale_max - y_scale_min) * offset_percentage;

                let yScale_pc1pc2 = d3.scaleLinear()
                    .domain([y_scale_min - y_scale_offset, y_scale_max + y_scale_offset])
                    .range([height_pc1pc2, 0]);

                let other_pc_id = current_dimension.id.slice(0, -1) + '2';
                if (current_dimension.id.slice(-1) === '2') {
                    other_pc_id = current_dimension.id.slice(0, -1) + '1';
                }

                let other_pc_dim = column_values_filtered.filter(x => x.id === other_pc_id)[0];

                let x_scale_min = d3.min(other_pc_dim.column_values);
                let x_scale_max = d3.max(other_pc_dim.column_values);
                let x_scale_offset = (x_scale_max - x_scale_min) * offset_percentage;

                let xScale_pc1pc2 = d3.scaleLinear()
                    .domain([x_scale_min - x_scale_offset, x_scale_max + offset_percentage])
                    .range([0, width_pc2pc2]);

                let left_axis = d3.axisLeft(yScale_pc1pc2).ticks(0);

                let svg = scatterplot_svg.append("g")
                    .attr("transform", "translate(" + margin_scatterplot_pc1pc2.left + "," + margin_scatterplot_pc1pc2.top + ")");

                //x axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height_pc1pc2 / 2 + ")")
                    .attr('id', id_x_axis_id)
                    .call(d3.axisBottom(xScale_pc1pc2).ticks(0));

                scatterplot_svg.append('text')
                    .attr('class', 'axis-label')
                    .attr('id', 'x_axis_label')
                    .attr('x', 20)//width_pc2pc2 + margin_scatterplot_pc1pc2.left)
                    .attr('y', 20) //height_pc1pc2)
                    .attr('text-anchor', 'end')
                    //.attr('fill', 'black')
                    .text(other_pc_dim.PCone_or_two);

                //y axis
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + width_pc2pc2 / 2 + margin_scatterplot_pc1pc2.left + ", 0)")
                    .attr('id', id_y_axis_id)
                    .call(left_axis);

                scatterplot_svg.append('text')
                    .attr('class', 'axis-label')
                    .attr('id', 'y_axis_label')
                    .attr('x', 0)
                    .attr('y', 15)
                    .attr('transform', 'rotate(-90)')
                    .style('text-anchor', 'end')
                    .text(current_dimension.PCone_or_two);

                let data_for_scatterplot_pc1pc2 = [];
                for (let i = 0; i < current_dimension.column_values.length; i++) {
                    data_for_scatterplot_pc1pc2.push({
                        x: other_pc_dim.column_values[i],
                        y: current_dimension.column_values[i],
                        index: i
                    })
                }
                svg.selectAll('circle')
                    .data(data_for_scatterplot_pc1pc2)
                    .enter()
                    .append("circle")
                    .attr('class', id_pc1pc2_scatterplot_circles)
                    .transition().duration(animation_duration_time)
                    .attr("cx", function (d) {
                        return xScale_pc1pc2(d.x);
                    })
                    .attr("cy", function (d) {
                        return yScale_pc1pc2(d.y);
                    })
                    .attr("r", 2)
                    .attr('opacity', function (d) {
                        return opacity_path;
                    })
                    .attr("fill", function (d) {
                        return '#34008B';
                    });
            } else {
                let circle_contri = axis_svg.append('circle')
                    .attr('id', dim + splitter + id_contribution_circle)
                    .attr('class', id_contribution_circle)
                    .attr("cx", 0)
                    .attr('cy', pcp_new_height + margin_pcp_plot_new.bottom / 2 + 5)
                    .attr('r', margin_pcp_plot_new.bottom / 3)
                    .attr("visibility", "hidden")
                    .style('fill', 'white');
            }

            if (y_scale_pcp_new[dim_split].scale_type === id_data_type__categorical) {

                let frequency_keys = y_scale_pcp_new[dim_split].frequencies;

                frequency_keys.forEach(function (value, index) {
                    axis_svg.append("rect")
                        .attr('id', dim + splitter + value.unique_value + splitter + id_frequency_bar)
                        .attr('class', id_frequency_bar)
                        .attr("x", 0)
                        .attr('y', get_y_value_for_axes(value.unique_value, dim) - qualitative_bar_height / 2)
                        .style('height', qualitative_bar_height)
                        .style("width", qualitative_bar_width_scale(value.relativeFrequency))
                        .style('fill', 'darkorange') //gold
                        .style('opacity', opacity_qualitative_frequency)
                        .on("mouseover", function (d) {
                            d3.select(this).style("opacity", opacity_path_hover)
                        })
                        .on("mouseout", function () {
                            d3.select(this).style("opacity", opacity_qualitative_frequency)
                        });
                })
            }
            // Add and store a brush for each axis.
            current_dim_g.append("g")
                .attr("class", "brush")
                .call(dim.brush = d3.brushY()
                    .extent([[-10, 0], [0, pcp_new_height]]) // only until 0 to still provide hovering for qualitative data frequencies
                    .on("start", brushstart)
                    .on("brush", brush)
                    .on("end", brushend)
                )
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 8); // allow brushing only on the left side of the axis to still provide hovering for qualitative data frequencies
        }
    });
}

function highlight_circles(dim_split) {
    setTimeout(function () {


        let stroke_color_before = 'white';
        let stroke_width_before = 0+'px';

        if (!d3.selectAll("#" + dim_split + id_circle_dimension_ending).empty()) {
            stroke_color_before = d3.selectAll("#" + dim_split + id_circle_dimension_ending).style('stroke');
            stroke_width_before = d3.selectAll("#" + dim_split + id_circle_dimension_ending).style('stroke-width');
        }

        d3.selectAll("#" + dim_split + id_circle_dimension_ending)
            .transition()
            .duration(animation_duration_time)
            .style('stroke', 'red')
            .style('stroke-width', 10 + 'px')
            .transition()
            .delay(4 * animation_duration_time)
            .duration(animation_duration_time)
            .style('stroke', stroke_color_before)
            .style('stroke-width', stroke_width_before)
    }, 2*duration_time);
}

function highlight_dimension(dim_split) {
    if (column_values_grouped.map(col => col[key_id]).indexOf(dim_split) > -1) {
        selectedIndex = column_values_grouped.map(col => col[key_id]).indexOf(dim_split);
        rotateCarousel(true);

        setTimeout(function () {

            d3.selectAll("#" + dim_split)
                .append("line")
                .transition()
                .duration(animation_duration_time)
                .style('stroke', 'red')
                .style('stroke-width', 4 + 'px')
                .attr("x1", -45)     // x position of the first end of the line
                .attr("y1", -4)      // y position of the first end of the line
                .attr("x2", 45)     // x position of the second end of the line
                .attr("y2", -4)   // y position of the second end of the line
                .transition()
                .delay(4 * animation_duration_time)
                .duration(animation_duration_time)
                .style('stroke-width', 0 + 'px')
                .on('end', function () {
                    this.remove()
                });

        }, 1.5*duration_time);

    }

}


function myfunction_pcp(dimension_id) {
    context_menu_instance_pcp[dimension_id.id].hide();

    let contri_dims = [];
    column_values_grouped.filter(x => x.id === dimension_id.id)[0].contributing_variables.forEach(function (contri) {
        contri_dims.push(contri.column_id);
    });
    open_run_famd_view(id_likelihood_of_errors_dimensions, contri_dims, dimension_id.id);

}

let context_menu_instance_pcp = {};

function open_context_menu(current_dimension, mouse_pos) {

    context_menu_instance_pcp[current_dimension.id].setProps({
        getReferenceClientRect: () => ({
            width: 0,
            height: 0,
            top: mouse_pos[1],
            bottom: mouse_pos[1],
            left: mouse_pos[0],
            right: mouse_pos[0]
        })
    });

    context_menu_instance_pcp[current_dimension.id].show();
}

function add_context_menu_pcp(current_dimension) {

    let div = document.createElement('div')
    d3.select(div).attr('id', 'template')
        .style('display', 'none')
        .append('p')
        .text(get_language_label_by_id(language_id_modify_group))
        .attr('onclick', "myfunction_pcp(" + current_dimension.id + ")");


    //d3.select('#'+ id_dimensions).select('.'+ 'selection').attr('id', 'selection');

    //const rightClickableArea = d3.select('#'+ id_dimensions).select('.'+ 'selection').node().parentNode; //document.querySelector('.'+ 'selection');
    const rightClickableArea = document.querySelector('#items_parallel_coordinates_content');

    context_menu_instance_pcp[current_dimension.id] = tippy(rightClickableArea, {
        content: div.innerHTML,
        placement: 'right-start',
        trigger: 'manual',
        interactive: true,
        arrow: false,
        allowHTML: true,
        //hideOnClick: true,
        offset: [0, 0]
    });
}