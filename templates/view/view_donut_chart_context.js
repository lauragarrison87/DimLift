let donut_chart_div_width_height = 80;
let tippy_instance_donut;

const opacity_shown_in_view = 0.9;
const opacity_rest = 0.5;

function initialize_donut_chart_context_div() {

    let donut_chart_div = d3.select('#' + item_plot_preferences[0].id).append('div')
        .attr('id', id_donut_chart_div)
        .style('position', 'absolute')
        .style('bottom', 'var(--padding)')
        .style('right', 'var(--padding)')
        .style('width', donut_chart_div_width_height + 'px')
        .style('height', donut_chart_div_width_height + 'px')
        .style('z-index', 10);

    let svg = donut_chart_div
        .append("svg")
        .attr("width", donut_chart_div_width_height + 'px')
        .attr("height", donut_chart_div_width_height + 'px')
        .append("g")
        .attr("transform", "translate(" + donut_chart_div_width_height / 2 + "," + donut_chart_div_width_height / 2 + ")");


}

function append_data_to_donut_chart_div() {
    let svg = d3.select('#' + id_donut_chart_div).select('svg').select('g');
    svg.selectAll('*').remove();

    //let outer_circle_div = svg.append('circle').attr("cx", 0)
    //    .attr("cy", 0)
    //    .attr("r", (donut_chart_div_width_height - 2) / 2)
    //    .style('fill', 'white');

    //let inner_circle_div = svg.append('circle').attr("cx", 0)
    //    .attr("cy", 0)
     //   .attr("r", (donut_chart_div_width_height - 2) / 4)
     //   .style('fill', 'white');

    // set the color scale
    let color = color_scale_descriptive_statistics;

    // Compute the position of each group on the pie:
    let pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    let data = {};
    column_values_grouped.forEach(function (col) {
        data[col[key_id]] = 1;
    });
    // Create dummy data
    let data_ready = pie(d3.entries(data))


    let arc = d3.arc()
        .innerRadius((donut_chart_div_width_height - 2) / 4)
        .outerRadius((donut_chart_div_width_height - 2) / 2);

    //let arc_hovering = d3.arc()
    //    .innerRadius((donut_chart_div_width_height - 2) / 4)
    //    .outerRadius((donut_chart_div_width_height - 2) / 2);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    let path = svg.selectAll('path')
        .data(data_ready);

    // let gradient = svg.append("defs").append("radialGradient")
    //     .attr("id", "radial_gradient")
    //     .attr("cx", "50%")    //not really needed, since 50% is the default
    //     .attr("cy", "50%")    //not really needed, since 50% is the default
    //     .attr("r", "50%");    //not really needed, since 50% is the default
        // .selectAll("stop")
        // .data([])
        // .enter()
        // .append("stop")
        // .attr("offset", function (d) {
        //     return d.offset;
        // })
        // .attr("stop-color", function (d) {
        //     return d.color;
        // });

    //update_color_data_gradient(column_values_grouped[0].id, column_values_grouped);

    /*function update_color_data_gradient(index_name, column_values_grouped) {
        let data_circle = [];
        if (column_values_grouped.filter(x=>x.id === index_name)[0].type_element_group === "group") {
            let linear_scale_percentage = d3.scaleLinear().domain([0, 100]).range([50, 100]);

            let current_dimension = column_values_grouped.filter(x => x.id === index_name)[0];
            current_dimension.loading_variables.sort((a, b) => a.value < b.value ? 1 : -1);

            let contri_sum = 0;
            current_dimension.loading_variables.forEach(function (loading) {
                let contri = current_dimension.contributing_variables.filter(x => x.column_id === loading.column_id)[0];

                data_circle.push({
                    offset: linear_scale_percentage(contri_sum + contri.value),
                    color: color_scale_loading(loading.value)
                });

                data_circle.push({
                    offset: linear_scale_percentage(contri_sum + contri.value + 0.001),
                    color: color_scale_loading(loading.value)
                });

                contri_sum += contri.value;
            });

            console.log(data_circle)
            d3.select('#' + 'radial_gradient').remove();


            svg.append("defs").append("radialGradient")
                .attr("id", "radial_gradient")
                .attr("cx", "50%")    //not really needed, since 50% is the default
                .attr("cy", "50%")    //not really needed, since 50% is the default
                .attr("r", "50%")    //not really needed, since 50% is the default
                .selectAll("stop")
                .data(data_circle)
                .enter()
                .append("stop")
                .attr("offset", function (d) {
                    return d.offset;
                })
                .attr("stop-color", function (d) {
                    return d.color;
                });

            outer_circle_div.style("fill", "url(#radial_gradient)");
        } else {
            outer_circle_div.style("fill", "darkgrey");
        }
    }*/


    path.enter().append("path")
        .style("fill", function (d, i) {

            if (column_values_grouped.filter(x=> x.id === d.data.key)[0].type_element_group === "group") {
                return "#8c96c6";
            }
            return 'lightgrey';//'#D1CBCA'; //color(i);
            //if (i === 0) {
            //    return 'grey';
            //} else if (i > 0 && i < dimensions_count_shown) {
            //    return "lightgrey";
            //}
            // return "white";
        })
        .style("stroke", function (d, i) {
            if (i === 0) {
                return "black";
            }
            return "grey";
        })
        .style('opacity', function (d, i) {
            if (i === 0) {
                return 1;
            } else if (i > 0 && i < dimensions_count_shown) {
                return opacity_shown_in_view;
            }
            return opacity_rest;
            //if (i === 0) {
            //    return 0;
            //}
            //return 1;
        })
        .attr("d", arc)
        .on('mouseover', function (d, i) {
            d3.select(this).style('opacity', 1);
            d3.select(this).style('stroke', 'black');


            //d3.select(this).attr('d', arc_hovering);
            //d3.select(this).style('opacity', 0);


            //update_color_data_gradient(d.data.key, column_values_grouped);
        })
        .on('mouseout', function (d, i) {
            if (i > selectedIndex && dimensions.includes(d.data.key)) {
                d3.select(this).style('opacity', opacity_shown_in_view);
                d3.select(this).style('stroke', 'grey');
            } else if (selectedIndex !== i) {
                d3.select(this).style('opacity', opacity_rest);
                d3.select(this).style('stroke', 'grey');
            }

            /*if (i !== 0) {
                d3.select(this).style('opacity', 1);
            }

            if (i > selectedIndex && dimensions.includes(d.data.key)) {
                d3.select(this).style('fill', 'lightgrey');
                d3.select(this).style('stroke', 'grey');

            } else if (selectedIndex !== i) {
                d3.select(this).style('fill', 'white');
                d3.select(this).style('stroke', 'grey');

            }
            d3.select(this).attr('d', arc);*/
        })
        .on('click', function (d, i) {

            highlight_dimension(d.data.key);
            highlight_circles(d.data.key);
        })
        .attr('data-tippy-content', function (d, i) {
            return column_values_grouped[i][key_header];
        });

    tippy_instance_donut = tippy(svg.selectAll('path').nodes());

    path.attr("d", arc);
}

function update_donut_chart_color() {
    let svg = d3.select('#' + id_donut_chart_div).select('svg').select('g');

// set the color scale
    svg.selectAll('path').each(function (d, i) {

        tippy_instance_donut[i].setContent(column_values_cleaned[i][key_header]);

        d3.select(this).style('fill', column_values_cleaned[i][id_applied_color]);
    });


}

function highlight_donut_chart_after_rotation() {
    let svg = d3.select('#' + id_donut_chart_div).select('svg').select('g');


// set the color scale
    svg.selectAll('path').each(function (d, i) {

        let index_for_emphasis;
        if (selectedIndex < 0) {
            index_for_emphasis = column_values_grouped.length + selectedIndex - (parseInt(selectedIndex / column_values_grouped.length + "") * column_values_grouped.length);

            if (index_for_emphasis > column_values_grouped.length - 1) {
                index_for_emphasis = 0;
            }
        } else {
            index_for_emphasis = selectedIndex - (parseInt(selectedIndex / column_values_grouped.length + "") * column_values_grouped.length);

        }

        if (i === index_for_emphasis) {
            d3.select(this).style('opacity', 1);
            d3.select(this).style('stroke', 'black');
        } else if (dimensions.includes(d.data.key)) {
            d3.select(this).style('opacity', opacity_shown_in_view);
            d3.select(this).style('stroke', 'grey');
        } else {
            d3.select(this).style('opacity', opacity_rest);
            d3.select(this).style('stroke', 'grey');
        }

        if (dimensions_brushed_filtered.includes(d.data.key)) {
            d3.select(this).style('fill', color_upper_vis_variance);
        }

        d3.select(this).attr('data-tippy-content', column_values_grouped[index_for_emphasis][key_header]);
    });

}