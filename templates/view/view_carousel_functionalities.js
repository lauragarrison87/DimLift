function initialize_carousel() {
    let content_div_parallel_coordinates = d3.select('#' + item_plot_preferences[0].id + id_content_ending).select('.' + id_items_parallel_coordinates_class);

    initialize_items_plot_new(content_div_parallel_coordinates)

    let carousel_options_p = content_div_parallel_coordinates.append('div').attr('class', id_carousel_options).append('p');

    let circle_width_height = parseFloat(getComputedStyle(carousel_options_p.node()).getPropertyValue(id_view_property_dimension_button_width_height));
    let circle_width_height_radius = circle_width_height - 2;


    let circle_div_left = carousel_options_p.append('div')
        .attr('class', id_previous_button)//.style('float', 'left')
        .style('width', circle_width_height + 'px')
        .style('height', circle_width_height + 'px')
        .style('left', 'calc(50% - ' + circle_width_height + 'px - var(--padding)')
        .style('position', 'absolute')
        .append('svg')
        .style('width', circle_width_height + 'px')
        .style('height', circle_width_height + 'px')
        .attr('data-tippy-content', get_language_label_by_id(id_previous_button));


    tippy(circle_div_left.nodes());

    circle_div_left
        .append('circle')
        .attr("cx", circle_width_height_radius / 2)
        .attr("cy", circle_width_height_radius / 2 + 2)
        .attr("r", circle_width_height_radius / 2)
        .attr("stroke", "none")
        .style('fill', getComputedStyle(carousel_options_p.node()).getPropertyValue(id_view_propertiy_dimensions_background_color));

    let svg_width_height = circle_width_height_radius - 10;
    circle_div_left.append("svg:image")
        .attr('x', circle_width_height_radius / 2 - svg_width_height / 2)
        .attr('y', circle_width_height_radius / 2 - svg_width_height / 2 + 2)
        .attr('width', svg_width_height)
        .attr('height', svg_width_height)
        .attr('fill', 'white')
        .attr("xlink:href", "resources/left.png");

    let circle_div_right = carousel_options_p.append('div')
        .attr('class', id_next_button)
        .style('width', circle_width_height + 'px')
        .style('height', circle_width_height + 'px')
        .style('left', 'calc(50% + ' + circle_width_height + 'px + var(--padding)')
        .style('position', 'absolute')
        .append('svg')
        .style('width', circle_width_height + 'px')
        .style('height', circle_width_height + 'px')
        .attr('data-tippy-content', get_language_label_by_id(id_next_button));

    tippy(circle_div_right.nodes());

    circle_div_right
        .append('circle')
        .attr("cx", circle_width_height_radius / 2)
        .attr("cy", circle_width_height_radius / 2 + 2)
        .attr("r", circle_width_height_radius / 2)
        .attr("stroke", "none")
        .style('fill', getComputedStyle(carousel_options_p.node()).getPropertyValue(id_view_propertiy_dimensions_background_color));

    circle_div_right.append("svg:image")
        .attr('x', circle_width_height_radius / 2 - svg_width_height / 2)
        .attr('y', circle_width_height_radius / 2 - svg_width_height / 2 + 2)
        .attr('width', svg_width_height)
        .attr('height', svg_width_height)
        .attr('fill', 'white')
        .attr("xlink:href", "resources/right.png");

    selectedIndex = 0;

    rotateFn = 'rotateY';

    let prevButton = document.querySelector('.previous-button');
    prevButton.addEventListener('click', function () {
        selectedIndex--;
        rotateCarousel(true);
    });

    let nextButton = document.querySelector('.next-button');
    nextButton.addEventListener('click', function () {
        selectedIndex++;
        rotateCarousel(true);
    });
}

function rotateCarousel(bool_also_down) {

    if (column_values_grouped.length + selectedIndex === 0) {
        selectedIndex = 0;
    } else if (column_values_grouped.length - selectedIndex === 0) {
        selectedIndex = 0;
    }

    if (bool_also_down) {
        update_pcp_plot(get_visible_dimensions());
        highlight_donut_chart_after_rotation();

    }
}

function get_visible_dimensions() {
    let new_dimensions = [];

    for (let i = 0; i < d3.min([dimensions_count_shown, column_values_grouped.length]); i++) {
        let push_index = i + selectedIndex;

        if (push_index > column_values_grouped.length - 1) {
            push_index = push_index - column_values_grouped.length
        } else if (push_index < 0) {
            push_index = column_values_grouped.length + push_index
        }

        new_dimensions.push(column_values_grouped[push_index].id);
    }

    return (new_dimensions);
}