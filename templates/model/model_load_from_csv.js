/**
 * load data from csv
 * @param callback
 */
function load_csv(callback) {
    d3.selectAll('#' + id_view).style('pointer-events', 'none');

    $.ajax({
        url: "http://127.0.0.1:5000/load_csv/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({"message": "test"})
    }).done(function(data) {

        column_values_initially = JSON.parse(data)[0]; //format_datatypes_regarding_datatype(JSON.parse(JSON.stringify(column_values_right_from_data_without_formatting)));
        columns_not_contributing = JSON.parse(data)[1];

        let length_columns_grouped_initially = column_values_initially.filter(x => x.type_element_group === "group").length / 2;
        let scale_grouped_round = d3.scaleLinear().domain([1, length_columns_grouped_initially]).range([1,0]);

        column_values_initially.forEach(function (d) {
            if (d.index_round) {
                d.descriptive_statistics.index_round = scale_grouped_round(d.index_round);
            } else {
                d.descriptive_statistics.index_round = -2;
            }
        });


        column_values_raw_dimensions = JSON.parse(JSON.stringify(column_values_initially.filter(x => x.type_element_group === 'dimension')));
        column_values_cleaned = JSON.parse(JSON.stringify(column_values_initially));
        column_values_filtered = JSON.parse(JSON.stringify(column_values_initially));

        let summed_missing = 0;
        column_values_cleaned.forEach(function (col) {
            summed_missing += col.descriptive_statistics[statistics_key__missing_values_percentage];
        });

        column_values_cleaned.forEach(function (column, index_col) {
            column.column_values.forEach(function (col_value, index_val) {
                if (!data_table_cleaned[index_val]) {
                    data_table_cleaned[index_val] = {};
                }
                data_table_cleaned[index_val][column.id] = col_value;
            })
        });

        column_values_filtered.sort((a,b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);

        let contributing_list = [];
        column_values_filtered.forEach(function (dim) {

            if (columns_not_contributing.includes(dim.id)) {
                column_values_grouped.push(dim);
            } else if (dim.type_element_group === 'group' && dim.PCone_or_two === 'PC1') {
                column_values_grouped.push(dim);
                length_columns_grouped_initially +=1;

                let array_contri = []
                for (let contributing_index = 0; contributing_index < dim.contributing_variables.length; contributing_index ++) {
                    array_contri.push(dim.contributing_variables[contributing_index].column_id)
                }
                contributing_list.push({contri: array_contri})
            }
        });

        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }

        contributing_list.push({length: contributing_list.length});
        //download(JSON.stringify(contributing_list), 'clinical_data_imputed_MICE75.txt', 'text/plain');
        console.log(contributing_list)
        d3.selectAll('#' + id_view).style('pointer-events', 'auto');

        callback(true)
    });
}