function initialize_autocomplete(parent_div, autocomplete_options, select_multiple, functionality) {

    if (select_multiple) {
        let single_multi_select_class = "multi-select";

        parent_div
            .append('span')
            .attr('class', single_multi_select_class)
            .style('height', 20 + 'px');

        autocomplete_options = autocomplete_options.sort((a, b) => a.label < b.label ? -1 : 1);

        var multiple = new SelectPure(parent_div.select('.' + single_multi_select_class).node(), {
            options: autocomplete_options,
            multiple: select_multiple,
            autocomplete: true,
            value: [],
            icon: "fa fa-times",
            onChange: value => {

                //console.log(value);
            },
        });

    } else {
        let single_multi_select_class = "single-select";

        parent_div
            .append('span')
            .attr('class', single_multi_select_class)
            .style('height', 20 + 'px');

        autocomplete_options = autocomplete_options.sort((a, b) => a.label < b.label ? -1 : 1);

        for (let i = 0; i < autocomplete_options.length; i++) {
            let name = autocomplete_options[i].label;
            if (name.length > 22) {
                autocomplete_options[i].label = name.substring(0, 22) + "...";
            }
        }
        var single = new SelectPure(parent_div.select('.' + single_multi_select_class).node(), {
            options: autocomplete_options,
            multiple: select_multiple,
            autocomplete: true,
            onChange: value => {

                if (functionality === language_id_sort_by) {

                    sort_parallel_coordinates_by = value;

                    // remove duplicates from grouped columns
                    column_values_grouped = column_values_grouped.filter(x => !x.id.includes(id_duplicate_dimensions));//map(col => col[key_id]).search(id_duplicate_dimensions);
                    d3.selectAll('.' + id_drillup_dimension).attr('visibility', 'hidden');
                    d3.selectAll('.' + id_drilldown_dimension).attr('visibility', 'visible');

                    d3.selectAll('.' + id_shrink_dimensions).attr('visibility', 'hidden');
                    d3.selectAll('.' + id_expand_dimension).attr('visibility', 'visible');


                    // shrink expansion again :)
                    d3.selectAll('.' + id_class_dimension_expanded).each(function () {

                        let current_dimension = column_values_cleaned.filter(x => x.id === this.id)[0];

                        current_dimension.contributing_variables.forEach(function (contri) {
                            column_values_grouped.splice(column_values_grouped.map(col => col[key_id]).indexOf(contri.column_id), 1);
                        });

                        column_values_grouped.splice(0, 0, column_values_filtered.filter(x => x[key_id] === current_dimension.id)[0]);

                        d3.select('#' + current_dimension.id)
                            .remove();

                        Object.keys(y_scale_pcp_new).forEach(function (key) {
                            y_scale_pcp_new[key].scale.range([pcp_new_height, 0]);
                        });
                    });


                    // sort by applied filters to have them at first
                    column_values_filtered.sort((a, b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);
                    column_values_grouped.sort((a, b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);


                    allow_dragging.forEach(function (d) {
                        d.draggable = true;
                    });

                    selectedIndex = 0;
                    rotateCarousel(true);

                } else if (functionality === language_id_search) {
                    highlight_dimension(value);
                    highlight_circles(value);

                    parent_div.select('.select-pure__label').text(get_language_label_by_id(language_id_search));
                }
            },
        });

        if (functionality === language_id_search) {
            parent_div.select('.select-pure__label').text(get_language_label_by_id(language_id_search));
        }
    }
}

function update_search_for_dimensions(parent_div, autocomplete_options, select_multiple, functionality) {

    parent_div.selectAll('*').remove();

    let single_multi_select_class = "single-select";

    parent_div
        .append('span')
        .attr('class', single_multi_select_class)
        .style('height', 20 + 'px');

    autocomplete_options = autocomplete_options.sort((a, b) => a.label < b.label ? -1 : 1);

    for (let i = 0; i < autocomplete_options.length; i++) {
        let name = autocomplete_options[i].label;
        if (name.length > 22) {
            autocomplete_options[i].label = name.substring(0, 22) + "...";
        }
    }
    var single = new SelectPure(parent_div.select('.' + single_multi_select_class).node(), {
        options: autocomplete_options,
        multiple: select_multiple,
        autocomplete: true,
        onChange: value => {

            highlight_dimension(value);
            highlight_circles(value);
            parent_div.select('.select-pure__label').text(get_language_label_by_id(language_id_search));
        },
    });

    if (functionality === language_id_search) {
        parent_div.select('.select-pure__label').text(get_language_label_by_id(language_id_search));
    }
}