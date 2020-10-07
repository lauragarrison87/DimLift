/**
 * This function formats the columns regarding the pre-defined datatypes
 * @param columns
 */
function format_datatypes_regarding_datatype(columns) {


    for (let i = 0; i < columns.length; i++) {
        let col = columns[i];

        col[changes_key_datatype_change] = false;

        if (column_values_initially.length>0) {
            col[changes_key_datatype_change] = col[key_data_type] !== column_values_initially.find(col_initially => col[key_id] === col_initially[key_id])[key_data_type];
        }

        col[key_removed_during_data_formatting] = [];

        // convert strings to numbers for numerical identified columns
        if (col[key_data_type] === id_data_type__numerical) {
            for (let index_data = 0; index_data < col[key_column_values].length; index_data++) {

                if (col[key_column_values][index_data] === undefined || col[key_column_values][index_data] === "" || isNaN(col[key_column_values][index_data]) || col[key_column_values][index_data] === null) {

                    if (col[key_removed_during_data_formatting].indexOf(col[key_column_values][index_data]) === -1) {
                        col[key_removed_during_data_formatting].push(col[key_column_values][index_data]);
                    }
                    col[key_column_values][index_data] = undefined;
                } else {
                    col[key_column_values][index_data] = parseFloat(col[key_column_values][index_data]);
                }
            }
        }


        // convert strings to date
        if (col[key_data_type] === id_data_type__date) {
            for (let index_data = 0; index_data < col[key_column_values].length; index_data++) {
                if (col[key_column_values][index_data] !== undefined) {
                    let dd_mm_yyyy = col[key_column_values][index_data].split('.');

                    // convert to numbers
                    dd_mm_yyyy.forEach(function (d) {
                        d = +d;
                    });


                    if (col[key_column_values][index_data] === "" || col[key_column_values][index_data].split('.').length < 3) {
                        if (col[key_removed_during_data_formatting].indexOf(col[key_column_values][index_data]) === -1) {
                            col[key_removed_during_data_formatting].push(col[key_column_values][index_data]);
                        }
                        col[key_column_values][index_data] = undefined;
                    } else {
                        col[key_column_values][index_data] = new Date(dd_mm_yyyy[2], dd_mm_yyyy[1] - 1, dd_mm_yyyy[0]).getTime();
                    }
                }
            }
        }

        if (col[key_data_type] === id_data_type__categorical) {
            for (let index_data = 0; index_data < col[key_column_values].length; index_data++) {

                if (col[key_column_values][index_data] === undefined || col[key_column_values][index_data] === "" ||col[key_column_values][index_data] === null) {
                    col[key_column_values][index_data] = undefined;
                }
            }
        }

    }


    return get_descriptive_statistical_measures(columns);
}