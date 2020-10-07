
function initialize_run_famd_button(parent_div_id, button_id) {

    for (let i=0; i< data_cleansing_buttons.length; i++) {
        let append_filter_div = d3.select('#' + parent_div_id).append('div')
            .attr('id', parent_div_id + id_dimension_button_ending_div)
            .attr('class', id_dimension_button_class);


        let circle_width_height = parseFloat(getComputedStyle(append_filter_div.node()).getPropertyValue(id_view_property_dimension_button_width_height));
        let circle_width_height_radius = circle_width_height - 2;

        append_filter_div.style('right', i * circle_width_height  + 70+ 'px');

        let svg_append_filter_button = append_filter_div
            .append('svg').attr('id', parent_div_id + button_id + id_dimension_button_ending)
            .style('width', 100 + '%')
            .style('height', 100 + '%')
            .attr('data-tippy-content', get_language_label_by_id(data_cleansing_buttons[data_cleansing_buttons.length-1 -i].id));

        tippy(svg_append_filter_button.nodes());


        svg_append_filter_button.append('circle')
            .attr("cx", circle_width_height_radius / 2)
            .attr("cy", circle_width_height_radius / 2 + 2)
            .attr("r", circle_width_height_radius / 2)
            .attr("stroke", "none")
            .style('fill', getComputedStyle(append_filter_div.node()).getPropertyValue(id_view_propertiy_dimensions_background_color));

        let svg_width_height = circle_width_height_radius - 10;
        svg_append_filter_button.append("svg:image")
            .attr('x', circle_width_height_radius / 2 - svg_width_height / 2)
            .attr('y', circle_width_height_radius / 2 - svg_width_height / 2 + 2)
            .attr('width', svg_width_height)
            .attr('height', svg_width_height)
            .attr('fill', 'white')
            .attr("xlink:href", data_cleansing_buttons[i].image);

        svg_append_filter_button.on('click', function () {

            if (data_cleansing_buttons[i].id === id_data_type_identification_and_formatting_button) {

                update_data_type_automatically();
            } else if (data_cleansing_buttons[i].id === id_outlier_removing_button) {
                remove_outliers();
            } else if (data_cleansing_buttons[i].id === id_applied_data_cleansing_button) {
                open_run_famd_view(parent_div_id, brushed_dimensions);
            }
        });
    }

}

function initialize_run_famd_pop_up_view(parent_div_id) {

    let popup_view_applied_data_cleansing = d3.select('#' + parent_div_id).append('div').attr('id', parent_div_id + id_applied_data_cleansing_ending_div).attr('class', id_applied_data_cleansing_pop_up_view_class);
    popup_view_applied_data_cleansing.append('div').attr('class', id_closebtn_class);

    let close_buttn_svg = d3.select('#' + parent_div_id).select('.' + id_closebtn_class).append('svg')
        .style('width', 100 + '%')
        .style('height', 100 + '%')
        .style('top', 0)
        .style('left', 0)
        .style('position', 'absolute')
        .on('click', function () {
            close_run_famd_view(parent_div_id);
        });
    let circle_width_height = parseFloat(getComputedStyle(d3.select('#' + parent_div_id).node()).getPropertyValue('--close_btn_width_height'));
    let circle_width_height_radius = circle_width_height - 2;

    let circle_padding_top = 2;
    let plus_color = getComputedStyle(d3.select('#' + parent_div_id).node()).getPropertyValue('--element-background-color');

    close_buttn_svg.append('circle')
        .attr("cx", circle_width_height_radius / 2)
        .attr("cy", circle_width_height_radius / 2 + 2)
        .attr("r", circle_width_height_radius / 2)
        .attr("stroke", "none")
        .style('fill', getComputedStyle(d3.select('#' + parent_div_id).node()).getPropertyValue('--navbar-highlight-font-color'));

    close_buttn_svg.append('line')
        .attr('x1', 5)
        .attr('y1', 5 + circle_padding_top)
        .attr('x2', circle_width_height_radius - 5)
        .attr('y2', circle_width_height_radius - 5 + circle_padding_top)
        .attr('stroke', plus_color)
        .attr('stroke-width', "2");

    close_buttn_svg.append('line')
        .attr('y2', circle_width_height_radius - 5 + circle_padding_top)
        .attr('x1', circle_width_height_radius - 5)
        .attr('y1', 5 + circle_padding_top)
        .attr('x2', 5)
        .attr('stroke', plus_color)
        .attr('stroke-width', "2");


    add_heading(parent_div_id + id_applied_data_cleansing_ending_div, get_language_label_by_id(language_id_applied_data_cleansing_heading));
    add_content_div(parent_div_id + id_applied_data_cleansing_ending_div);

    d3.select('#' + parent_div_id + id_applied_data_cleansing_ending_div + id_content_ending).style("overflow-y", "auto");
}

function initialize_pop_up_view_content(parent_div_id, brushed_dimensions, updated_dim_id) {
    let content_div = d3.select('#' + parent_div_id + id_applied_data_cleansing_ending_div + id_content_ending);

    console.log(content_div.style('height'))
    let select_run_famd_listbox = content_div.append('select')
        .attr('multiple', 'multiple')
        .attr('name', "dimensions")
        .attr('id', id_run_famd_listbox);

    column_values_filtered.forEach(function (dim) {
        if (dim.type_element_group === "dimension") {
            let last_option = select_run_famd_listbox.append('option').attr('id', dim.id).text(dim.header);

            if (brushed_dimensions.includes(dim.id)) {
                last_option.attr('selected', 'selected');
            }
        }
    });



    $('#' + id_run_famd_listbox).multi({
        non_selected_header:'Dimensions',
        selected_header:'Selected Dimensions for Dimensionality Reduction (minimum 2)',
        enable_search: true,
        // placeholder of search input
        search_placeholder: get_language_label_by_id(language_id_search)
    });

    let multi_select_height = parseFloat(content_div.style('height')) - 90;

    content_div.select('.multi-wrapper .non-selected-wrapper').style('height', multi_select_height+'px');
    content_div.select('.multi-wrapper .selected-wrapper').style('height', multi_select_height+'px');

    $("#" + id_run_famd_listbox).change(function (d) {

        if ($('#' + id_run_famd_listbox).val() === null || $('#' + id_run_famd_listbox).val().length < 2) {
            svg_button.style('opacity', 0.5);
            svg_button.selectAll('*').on('click', null);
        } else {
            svg_button.style('opacity', 1);
            svg_button.selectAll('*').on('click', function () {
                return run_famd(updated_dim_id);
            });
        }
    });

    let svg_button = content_div.append('svg').style('width', 100 + '%')
        .style('height', 40 + 'px')
        .style('margin-top', 15 + 'px')
        .style('opacity', function () {
            if ($('#' + id_run_famd_listbox).val() === null || $('#' + id_run_famd_listbox).val().length < 2) {
                return 0.5;
            } else {
                return 1;
            }
        });

    svg_button.append('rect')
        .style('width', 240 +'px')
        .style('height', 40 + 'px')
        .attr("rx", 6)
        .attr("ry", 6)
        .style('x', (parseFloat(d3.select('#' + parent_div_id).style('width')) - 260) + 'px')
        .attr('fill', '#9ebcda')
        .on('click', function () {
            if ($('#' + id_run_famd_listbox).val() === null || $('#' + id_run_famd_listbox).val().length < 2) {
                return null
            } else {
                return run_famd(updated_dim_id);
            }
        });

    svg_button
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .attr('transform', 'translate(' + (parseFloat(d3.select('#' + parent_div_id).style('width')) - 140) + ','+40/2 +')')
        .text(get_language_label_by_id(language_id_run_dimensionality_reduction))
        .on('click', function () {
            console.log($('#' + id_run_famd_listbox).val().length)
            if ($('#' + id_run_famd_listbox).val() === null || $('#' + id_run_famd_listbox).val().length < 2) {
                return null
            } else {
                return run_famd(updated_dim_id);
            }
        });
}

function run_famd(updated_dim_id) {

    let list_selected_headers = $('#' + id_run_famd_listbox).val();
    let list_ids = [];
    d3.select('#' + id_run_famd_listbox).selectAll('option').each(function (option) {

        if (list_selected_headers.includes(this.value)) {
            list_ids.push(this.id);
        }
    });

    // remove brushed selection
    d3.select('#' + id_likelihood_of_errors_dimensions + id_content_ending).select("g").call(d3.brush().move, null);

    run_famd_on_user_selection(function (response) {
        close_run_famd_view(id_likelihood_of_errors_dimensions);
    }, list_ids, updated_dim_id);
}

function open_run_famd_view(parent_div_id, brushed_dimensions, updated_dim_id) {

    initialize_pop_up_view_content(parent_div_id, brushed_dimensions, updated_dim_id);
    d3.select(d3.select('#' + parent_div_id).node().parentNode)
        .select('.' + id_applied_data_cleansing_pop_up_view_class)
        .style('z-index', 1)
        .transition().duration(animation_duration_time_pop_up_view).style('width', 'calc(' + 100 + '%)');
}


function close_run_famd_view(parent_div_id) {

    d3.select(d3.select('#' + parent_div_id).node().parentNode)
        .select('.' + id_applied_data_cleansing_pop_up_view_class)
        .transition().duration(animation_duration_time_pop_up_view).style('width', 0 + '%')
        .on('end', function () {
            d3.select(this).style('z-index', -1);
            d3.select('#' + parent_div_id + id_applied_data_cleansing_ending_div + id_content_ending).selectAll('*').remove();

        });
}