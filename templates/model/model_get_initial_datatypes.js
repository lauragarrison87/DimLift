function replace_spaces_with_underscore(value) {
    value = value.split(" ").join("_");
    value = value.split(")").join("_");
    value = value.split("(").join("_");
    value = value.split("/").join("_");
    value = value.split("-").join("_");
    value = value.split("[").join("_");
    value = value.split("]").join("_");
    value = value.split(".").join("_");
    value = value.split("?").join("_");
    value = value.split("!").join("_");
    value = value.split("@").join("_");
    value = value.split("*").join("_");

    value = value.split("ä").join("ae");
    value = value.split("ü").join("ue");
    value = value.split("ö").join("oe");
    value = value.split("ß").join("ss");

    value = "id_qualitative_rectangle" + value;


    return value;
}

/**
 * This function identifies the initial datatypes
 * @param data
 * @returns {*}
 */
function identify_initial_datatypes(data) {

    let headerNames = d3.keys(data[0]);

    let headerNames_underscore = headerNames.map(replace_spaces_with_underscore);

    let columns = [];

 //   for (let i = 0; i < 91; i++) {
    for (let i = 0; i < headerNames.length; i++) {
        let obj = {};
        obj[key_header] = headerNames[i];
        obj[key_id] = headerNames_underscore[i];
        obj[key_column_values] = data.map(function (d) {

            if (d !== undefined) {
                return d[headerNames[i]];
            }

        });
        obj[key_data_type] = check_data_types(obj[key_column_values]);

        columns.push(obj);
    }

    /**
     * This function identifies the data types
     * @param x
     * @returns {string}
     */
    function check_data_types(x) {

        const regExp_date = /^(0?[1-9]|[12][0-9]|3[01])[\.\-](0?[1-9]|1[012])[\.\-]\d{4}$/; // regular Expression for dd.mm.yyyy

        if (x.every(function(i){ return !isNaN(i)})) {
            if (x.every(function(i){ return Number.isInteger(i)})) {
                return id_data_type__categorical;
            }
            return id_data_type__numerical;
        } else if (x.every(function(i){ return i === undefined || i === "" || regExp_date.test(i)})) {
            return id_data_type__date;
        } else if (x.every(function(i){ return typeof i === "string" })) {
            return id_data_type__categorical;
        }
    }

    return columns;
}