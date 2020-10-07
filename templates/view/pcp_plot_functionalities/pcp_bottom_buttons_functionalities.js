function add_bottom_buttons(axis_svg, current_dimension, current_dim_g) {

    axis_svg.append("svg:image")
        .attr('class', id_swap_dimension)
        .attr('x', -30)
        .attr('y', 'calc(' + 100 + '% - ' + (margin_pcp_plot_new.bottom / 2 + margin_pcp_plot_new.top) + 'px)')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", "resources/round_refresh_black_18dp.png")
        .attr('data-tippy-content', get_language_label_by_id(id_swap_dimension))
        .on('click', function () {

            current_dimension = column_values_cleaned.filter(x => x.id === current_dim_g.attr('id'))[0];

            let index_grouped = column_values_grouped.map(e => e.id).indexOf(current_dimension.id);

            let new_id_string = current_dimension.id;
            if (current_dimension.PCone_or_two === id_PC2) {
                new_id_string = new_id_string.slice(0, -1) + '1';
            } else {
                new_id_string = new_id_string.slice(0, -1) + '2';
            }

            column_values_grouped[index_grouped] = column_values_cleaned.filter(x => x.id === new_id_string)[0];

            let copied_dim = JSON.parse(JSON.stringify(column_values_cleaned.filter(x => x.id === new_id_string)[0]));
            copied_dim.id = copied_dim.id + id_duplicate_dimensions;
            if (column_values_grouped.filter(x => x.id === current_dimension.id + id_duplicate_dimensions).length>0) {
                column_values_grouped.splice(column_values_grouped.map(col => col[key_id]).indexOf(current_dimension.id + id_duplicate_dimensions), 1, copied_dim);
            }

            // if (actives_copy.filter(x => x.dimension === current_dimension).length > 0) {
            //     actives_copy.filter(x => x.dimension === current_dimension)[0].dimension = new_id_string;
            // }

            update_after_swapping(current_dimension.id, column_values_cleaned.filter(x => x.id === new_id_string)[0]);
            //rotateCarousel(true);
        });

    axis_svg.append("svg:image")
        .attr('class', id_drilldown_dimension)
        .attr('id', current_dimension.id + id_drilldown_dimension)
        .attr('x', -10)
        .attr('y', 'calc(' + 100 + '% - ' + (margin_pcp_plot_new.bottom / 2 + margin_pcp_plot_new.top) + 'px)')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", "resources/round_subdirectory_arrow_right_black_18dp.png")
        .attr('fill', 'white')
        .attr("visibility", "visible")
        .attr('data-tippy-content', get_language_label_by_id(id_drilldown_dimension))
        .on('click', function () {

            disable_allow_dragging(current_dimension, false);

            current_dimension = column_values_cleaned.filter(x => x.id === current_dim_g.attr('id'))[0];

            let copied_dim = JSON.parse(JSON.stringify(current_dimension));
            copied_dim.id = current_dimension.id + id_duplicate_dimensions;
            column_values_grouped.splice(column_values_grouped.map(col => col[key_id]).indexOf(current_dimension.id), 0, copied_dim);

            if (dimensions_brushed_filtered.includes(current_dimension.id)) {
                dimensions_brushed_filtered.splice(dimensions_brushed_filtered.indexOf(current_dimension.id), 0, current_dimension.id + id_duplicate_dimensions);
            }

            rotateCarousel(true, true);

            d3.select(this).attr('visibility', 'hidden');
            axis_svg.select('.' + id_drillup_dimension).attr('visibility', 'visible');

            hide_show_expansion_buttons(current_dimension.id, 0);
        });

    axis_svg.append("svg:image")
        .attr('class', id_drillup_dimension)
        .attr('id', current_dimension.id + id_drillup_dimension)
        .attr('x', -10)
        .attr('y', 'calc(' + 100 + '% - ' + (margin_pcp_plot_new.bottom / 2 + margin_pcp_plot_new.top) + 'px)')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", "resources/round_subdirectory_arrow_right_black_18dp2.png")
        .attr('fill', 'white')
        .attr("visibility", "hidden")
        .attr('data-tippy-content', get_language_label_by_id(id_drillup_dimension))
        .on('click', function () {

            current_dimension = column_values_cleaned.filter(x => x.id === current_dim_g.attr('id'))[0];

            column_values_grouped.splice(column_values_grouped.map(col => col[key_id]).indexOf(current_dimension.id + id_duplicate_dimensions), 1);
            dimensions_brushed_filtered.splice(dimensions_brushed_filtered.indexOf(current_dimension.id + id_duplicate_dimensions), 1);

            rotateCarousel(true);
            d3.select(this).attr('visibility', 'hidden');
            axis_svg.select('.' + id_drilldown_dimension).attr('visibility', 'visible');

            hide_show_expansion_buttons(current_dimension.id, 1);

            disable_allow_dragging(current_dimension, true);

        });

    if (dimensions_new.includes(current_dimension.id + id_duplicate_dimensions)) {
        axis_svg.select('.' + id_drilldown_dimension).attr('visibility', 'hidden');
        axis_svg.select('.' + id_drillup_dimension).attr('visibility', 'visible');
    }

    axis_svg.append("svg:image")
        .attr('class', id_expand_dimension)
        .attr('id', current_dimension.id + id_expand_dimension)
        .attr('x', 10)
        .attr('y', 'calc(' + 100 + '% - ' + (margin_pcp_plot_new.bottom / 2 + margin_pcp_plot_new.top) + 'px)')
        .attr('width', 20)
        .attr('height', 20)
        .attr("visibility", "visible")
        .attr("xlink:href", "resources/round_unfold_more_black_18dp.png")
        .attr('data-tippy-content', get_language_label_by_id(id_expand_dimension))
        .on('click', function () {

            disable_allow_dragging(current_dimension, false);

            current_dimension = column_values_cleaned.filter(x => x.id === current_dim_g.attr('id'))[0];

            let related_actives = actives_copy.filter(x => x.dimension === current_dimension.id);
            let old_brushed_values = [];
            if (related_actives.length > 0) {
                old_brushed_values.push(y_scale_pcp_new[current_dimension.id].scale.invert(related_actives[0].extent[0]));
                old_brushed_values.push(y_scale_pcp_new[current_dimension.id].scale.invert(related_actives[0].extent[1]));
            }

            d3.select(this).attr('visibility', 'hidden');
            axis_svg.select('.' + id_shrink_dimensions).attr('visibility', 'visible');

            original_column_values_grouped = JSON.parse(JSON.stringify(column_values_grouped));

            d3.select('#' + current_dimension.id)
                .attr('class', id_class_dimension_expanded);

            current_dimension.contributing_variables.forEach(function (contri) {

                column_values_grouped.splice(column_values_grouped.map(col => col[key_id]).indexOf(current_dimension.id) + 1, 0, column_values_initially.filter(x => x.id === contri.column_id)[0]);
            });

            column_values_grouped.splice(column_values_grouped.map(col => col[key_id]).indexOf(current_dimension.id), 1);

            //selectedIndex = 0;
            rotateCarousel(true);

            if(related_actives.length>0) {
                set_brush_programmatically(current_dimension.id, [y_scale_pcp_new[current_dimension.id].scale(old_brushed_values[0]), y_scale_pcp_new[current_dimension.id].scale(old_brushed_values[1])], true);
            }

        });

    axis_svg.append("svg:image")
        .attr('class', id_shrink_dimensions)
        .attr('id', current_dimension.id + id_shrink_dimensions)
        .attr('x', 10)
        .attr('y', 'calc(' + 100 + '% - ' + (margin_pcp_plot_new.bottom / 2 + margin_pcp_plot_new.top) + 'px)')
        .attr('width', 20)
        .attr('height', 20)
        .attr("visibility", "hidden")
        .attr("xlink:href", "resources/round_unfold_less_black_18dp.png")
        .attr('data-tippy-content', get_language_label_by_id(id_shrink_dimensions))
        .on('click', function () {
            current_dimension = column_values_cleaned.filter(x => x.id === current_dim_g.attr('id'))[0];

            let related_actives = actives_copy.filter(x => x.dimension === current_dimension.id);
            let old_brushed_values = [];
            if (related_actives.length > 0) {
                old_brushed_values.push(y_scale_pcp_new[current_dimension.id].scale.invert(related_actives[0].extent[0]));
                old_brushed_values.push(y_scale_pcp_new[current_dimension.id].scale.invert(related_actives[0].extent[1]));
            }

            let index = 0;
            current_dimension.contributing_variables.forEach(function (contri) {
                index = column_values_grouped.map(col => col[key_id]).indexOf(contri.column_id);
                column_values_grouped.splice(column_values_grouped.map(col => col[key_id]).indexOf(contri.column_id), 1);
            });

            column_values_grouped.splice(index, 0, column_values_filtered.filter(x => x[key_id] === current_dimension.id)[0]);

            selectedIndex = column_values_grouped.map(col => col[key_id]).indexOf(current_dimension.id);
            x_scale_pcp_new.domain(get_visible_dimensions());

            d3.select(this).attr('visibility', 'hidden');
            axis_svg.select('.' + id_expand_dimension).attr('visibility', 'visible');

            return_style_transform(current_dimension, duration_time);

            Object.keys(y_scale_pcp_new).forEach(function (key) {
                y_scale_pcp_new[key].scale.range([pcp_new_height, 0]);
            });

            d3.select('#' + current_dimension.id).selectAll('.' + id_tick_lines).each(function () {
                d3.select(this).attr("visibility", "hidden");
            });

            setTimeout(function () {

                d3.select('#' + current_dimension.id).remove();

                rotateCarousel(true);

                disable_allow_dragging(current_dimension, true);
            }, duration_time + 20);

        });
    tippy(axis_svg.selectAll('image').nodes(), {dynamicTitle: true});

}

function disable_allow_dragging(current_dimension, disable_allow) {

    let current_id = current_dimension.id.slice(0,-1);
    for (let i = 1; i< 3; i++) {
        allow_dragging.filter(x => x.id === current_id + i)[0].draggable = disable_allow;
    }
}