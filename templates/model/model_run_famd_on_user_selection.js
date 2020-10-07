function run_famd_on_user_selection(callback, list_ids, updated_dim_id) {
    d3.selectAll('#' + id_view).style('pointer-events', 'none');

    $.ajax({
        url: "http://127.0.0.1:5000/run_famd_user_driven/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(list_ids)
    }).done(function (data) {

        let new_pcs_initial = JSON.parse(data)[0];
        let new_pcs_filtered = JSON.parse(data)[1];




        function remove_original_variable_in_case_of_updated_or_dublicated(updated_dim_id) {
            updated_dim_id = updated_dim_id.slice(0, -1);
            for (let index_pc = 1; index_pc < 3; index_pc++) {
                if (column_values_grouped.map(col => col.id).indexOf(updated_dim_id + index_pc) > -1) {
                    column_values_grouped.splice(column_values_grouped.map(col => col.id).indexOf(updated_dim_id + index_pc), 1);
                }

                if (column_values_filtered.map(col => col.id).indexOf(updated_dim_id + index_pc) > -1) {
                    column_values_filtered.splice(column_values_filtered.map(col => col.id).indexOf(updated_dim_id + index_pc), 1);
                }

                if (column_values_cleaned.map(col => col.id).indexOf(updated_dim_id + index_pc) > -1) {
                    column_values_cleaned.splice(column_values_cleaned.map(col => col.id).indexOf(updated_dim_id + index_pc), 1);
                }

                if (column_values_initially.map(col => col.id).indexOf(updated_dim_id + index_pc) > -1) {
                    column_values_initially.splice(column_values_cleaned.map(col => col.id).indexOf(updated_dim_id + index_pc), 1);
                }
            }
        }
        if (updated_dim_id) {
            remove_original_variable_in_case_of_updated_or_dublicated(updated_dim_id);
        }


        if (column_values_initially.filter(x => x.id === new_pcs_initial[0].id).length > 0) {
            remove_original_variable_in_case_of_updated_or_dublicated(new_pcs_initial[0].id);
        }

        new_pcs_filtered.forEach(function (new_pc_filtered) {
            new_pc_filtered.descriptive_statistics.index_round = -1;
            column_values_filtered.push(new_pc_filtered);

            allow_dragging.push({
                id: new_pc_filtered.id,
                draggable: true
            });

        });

        new_pcs_initial.forEach(function (new_pc) {
            new_pc.descriptive_statistics.index_round = -1;

            column_values_cleaned.push(new_pc);

            if (new_pc.PCone_or_two === 'PC1') {
                column_values_grouped.push(new_pc)
            }

            column_values_initially.push(new_pc);

            y_scale_pcp_new[new_pc.id] = {
                scale_type: id_data_type__numerical,
                scale: d3.scaleLinear()
                    .domain(d3.extent(new_pc.column_values))
                    .range([pcp_new_height, 0]),
                header: new_pc.header
            };

            new_pc.column_values.forEach(function (col_value, index_val) {
                if (!data_table_cleaned[index_val]) {
                    data_table_cleaned[index_val] = {};
                }
                data_table_cleaned[index_val][new_pc.id] = col_value;
            })
        });

        column_values_filtered.sort((a, b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);
        column_values_grouped.sort((a,b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);


        columns_not_contributing = [];
        column_values_raw_dimensions.forEach(function (raw_dim) {
            let found = false;
            column_values_filtered.filter(x => x.type_element_group === 'group').forEach(function (group_dim) {
                if (group_dim.contributing_variables.find(x => x.column_id === raw_dim.id)) {
                    found = true;
                }
            })

            if (!found) {
                columns_not_contributing.push(raw_dim.id);
                if (!column_values_grouped.find(x => x.id === raw_dim.id)) {
                    column_values_grouped.push(raw_dim);
                }

            } else {
                column_values_grouped = JSON.parse(JSON.stringify(column_values_grouped.filter(x => x.id !== raw_dim.id)));
            }
        })

        update_after_filtering();

        append_data_to_donut_chart_div();

        selectedIndex = 0;
        rotateCarousel(true);


        d3.selectAll('#' + id_view).style('pointer-events', 'auto');


        new_pcs_initial.forEach(function (d) {
            highlight_dimension(d[key_id]);
            highlight_circles(d[key_id]);
        });

        callback(true);
    });
}