/**
 * initialize likelihood of correlations plot
 */
function initialize_likelihood_of_correlations_plot() {
    add_heading(id_likelihood_of_correlation, get_language_label_by_id(language_id_likelihood_of_correlation_plot_heading));
    add_content_div(id_likelihood_of_correlation);



    /*let content_div = d3.select('#' + id_likelihood_of_correlation + id_content_ending);
    content_div.attr('id', 'div').style('overflow-x', 'auto');
    content_div.append('div').attr('id', id_likelihood_of_correlation + id_content_ending).style('width', '100%').style('height', '100%')
        .style('display', 'flex').style('flex-direction', 'row').style('flex-wrap', 'nowrap');
*/
}

function initialize_one_dimensional_plot() {

    let col_width = column_values_cleaned.length * (200 + 20);

    d3.select('#' + id_likelihood_of_correlation + id_content_ending).style('width', col_width + 'px');

    column_values_cleaned.forEach(function (col, index) {
        let col_div = d3.select('#' + id_likelihood_of_correlation + id_content_ending)
            .append('div')
            .attr('class', id_likelihood_of_correlation_divs_class)
            .attr('id', col[key_id] + id_likelihood_of_correlations_ending)
            .style('order', index)
            .on('click', function () {
                selectedIndex = column_values_filtered.map(col => col[key_id]).indexOf(col[key_id]);
                rotateCarousel(true);
            });

        let radar_chart_div = col_div.append('div')
            .attr('id', col[key_id] + id_likelihood_of_correlations_ending + id_likelihood_of_correlations_radar_plot_ending)
            .attr('class', id_radarChartDiv_class);

        append_radar_chart(radar_chart_div, col[key_data_type], col);


        col_div.append('div')
            .attr('class', id_class_heading).append('svg')//.attr('id', parent_div_id + id_heading_ending + id_svg_endging)
            .style('width', '100%')
            .style('height', '100%')
            .append('text')
            .text(col[key_header])
            .attr('font-size', '0.8em')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(' + parseFloat(getComputedStyle(col_div.node()).width) / 2 + ',' + 33 / 2 + ')');
    });


}

function append_radar_chart(parent_div, dataType) {

    var margin = {top: 30, right: 30, bottom: 20, left: 30},
        width = parseFloat(getComputedStyle(parent_div.node()).width) - margin.left - margin.right,
        height = Math.min(width, parseFloat(getComputedStyle(parent_div.node()).height) - margin.top - margin.bottom - 20);


    let data = [[]];


    let color_data_type = color__numerical_data;

    if (dataType === id_data_type__numerical || dataType === id_data_type__date) {
        all_descriptive_statistic_measures_numerical.forEach(function (key_stat) {
            data[0].push({'axis': get_language_label_by_id(key_stat+radar_chart_stats_key_ending), value: 0});
        });

        if (dataType === id_data_type__date) {
            color_data_type = color__date_data;
        }
    } else {
        color_data_type = color__categorical_data;
        all_descriptive_statistic_measures_categorical.forEach(function (key_stat) {
            data[0].push({'axis': get_language_label_by_id(key_stat+radar_chart_stats_key_ending), value: 0});
        })
    }
    //////////////////////////////////////////////////////////////
    //////////////////// Draw the Chart //////////////////////////
    //////////////////////////////////////////////////////////////

    let color = d3version3.scale.ordinal()
        .range([color_data_type]);

    radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 1,
        levels: 3,
        roundStrokes: true,
        color: color
    };
    //Call function to draw the Radar chart
    RadarChart(parent_div.node(), data, radarChartOptions);

    parent_div.selectAll('.axisLabel').style('opacity', 0);
    parent_div.selectAll('.legend').style('fill', 'white');
    parent_div.selectAll('.gridCircle').style('fill', 'white').style('filter', '').style('opacity', 0.4);
    if (dataType === id_data_type__categorical) {
        // parent_div.selectAll('.legend').style('opacity', 0);
        // parent_div.selectAll('.axis').style('opacity', 0);


    }
}

function append_radar_chart_tooltip(parent_div, dataType, col, deviation) {

    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = parseFloat(getComputedStyle(parent_div.node()).width) - margin.left - margin.right,
        height = Math.min(width, parseFloat(getComputedStyle(parent_div.node()).height) - margin.top - margin.bottom - 20);

    let data = [[]];

    let color_data_type = color__numerical_data;

    if (dataType === id_data_type__numerical || dataType === id_data_type__date) {
/*        all_descriptive_statistic_measures_numerical.forEach(function (key_stat) {
            data[0].push({'axis': get_language_label_by_id(key_stat+radar_chart_stats_key_ending), value: Math.abs(col.descriptive_statistics[key_stat] / 100)});
        });*/

        if (dataType === id_data_type__date) {
            color_data_type = color__date_data;
        }
    } else {
        color_data_type = color__categorical_data;
/*        all_descriptive_statistic_measures_categorical.forEach(function (key_stat) {
            data[0].push({'axis': get_language_label_by_id(key_stat+radar_chart_stats_key_ending), value: Math.abs(col.descriptive_statistics[key_stat] / 100)});
        })*/
    }

    let deviation_ending_ = "";
    if (deviation) {
        deviation_ending_ = deviation_ending;
    }
    all_descriptive_statistic_measures_all_dimensions.forEach(function (key_stat) {

        if (key_stat !== number_of_modes) {
            data[0].push({'axis': get_language_label_by_id(key_stat+radar_chart_stats_key_ending + deviation_ending_), value: Math.abs(col.descriptive_statistics[key_stat+deviation_ending_])});
        }
    });
    //////////////////////////////////////////////////////////////
    //////////////////// Draw the Chart //////////////////////////
    //////////////////////////////////////////////////////////////

    let color = d3version3.scale.ordinal()
        .range([color_data_type]);

    radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 1,
        levels: 3,
        roundStrokes: true,
        color: color
    };
    //Call function to draw the Radar chart
    RadarChart(parent_div.node(), data, radarChartOptions);

    parent_div.selectAll('.axisLabel').style('opacity', 0);
    parent_div.selectAll('.legend').style('fill', 'white');
    parent_div.selectAll('.gridCircle').style('fill', 'white').style('filter', '').style('opacity', 0.4);
}

let radarChartOptions = {};

function update_likelihood_of_correlations_plot() {


    let col_values_filtered = JSON.parse(JSON.stringify(column_values_filtered)).sort((a, b) => (a.descriptive_statistics[statistics_key_overall_deviation] < b.descriptive_statistics[statistics_key_overall_deviation]) ? 1 : -1);

    let myColor = d3.scaleLinear()
        .domain([0, col_values_filtered.length-1])
        .range([color_applied_filters, 'white']);

    col_values_filtered.forEach(function (col, index) {

        d3.select('#' + col[key_id] + id_likelihood_of_correlations_ending).style('order', index);

        let data = [[]];

        let data_type = id_data_type__numerical;
        let color_data_type = color__numerical_data;

        if (col[key_data_type] === id_data_type__numerical || col[key_data_type] === id_data_type__date) {
            all_descriptive_statistic_measures_numerical.forEach(function (key_stat) {
                data[0].push({
                    'axis': get_language_label_by_id(key_stat),
                    value: Math.abs(col.descriptive_statistics[key_stat + deviation_ending] / 100)
                });
            });

            if (col[key_data_type] === id_data_type__date) {
                color_data_type = color__date_data;
            }

        } else {
            data_type = id_data_type__categorical;
            color_data_type = color__categorical_data;

            all_descriptive_statistic_measures_numerical.forEach(function (key_stat) {
                data[0].push({
                    'axis': get_language_label_by_id(statistics_key__highest_relative_frequency),
                    value: Math.abs(col.descriptive_statistics[statistics_key__highest_relative_frequency + deviation_ending] / 100)
                });
            })
        }

        let color = d3version3.scale.ordinal()
            .range([color_data_type]);

        radarChartOptions.color = color;

        let radar_div = d3.select('#' + col[key_id] + id_likelihood_of_correlations_ending + id_likelihood_of_correlations_radar_plot_ending);

        d3.select('#' + col[key_id] + id_likelihood_of_correlations_ending).select('.' + id_class_heading)
            .transition().duration(animation_duration_time).style('background-color', myColor(index));
        RadarChart(radar_div.node(), data, radarChartOptions);

        radar_div.selectAll('.axisLabel').style('opacity', 0);

        if (data_type === id_data_type__categorical) {
            radar_div.selectAll('.legend').style('opacity', 0);
            radar_div.selectAll('.axisLabel').style('opacity', 0);
            radar_div.selectAll('.axis').style('opacity', 0);
        }
    })
}