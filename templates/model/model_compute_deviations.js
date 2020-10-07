/**
 * using backend for deviation computation
 * @param callback
 * @param active_patients
 */
function compute_deviations_new(callback, active_patients) {
    d3.selectAll('#' + id_view).style('pointer-events', 'none');

    $.ajax({
        url: "http://127.0.0.1:5000/compute_deviations_and_get_current_values/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(active_patients)
    }).done(function(data) {

        column_values_filtered = JSON.parse(data)[0];
        column_values_filtered.sort((a,b) => a.descriptive_statistics[sort_parallel_coordinates_by] < b.descriptive_statistics[sort_parallel_coordinates_by] ? 1 : -1);
        d3.selectAll('#' + id_view).style('pointer-events', 'auto');

        callback(true);
    });
}