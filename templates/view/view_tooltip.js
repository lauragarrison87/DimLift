
function append_tooltip_radar_chart_and_heading(parent_div_id, col, deviation) {

    let min_width = 300;

    // get the computed width of text
    if (BrowserText.getWidth(col[key_header], 11) + 30 > min_width) {
        //min_width = BrowserText.getWidth(col[key_header], 11) + 30;
    }

    let tippy_div;
    let tippy_div_width = Math.floor(min_width);

    if (d3.select('#' + col[key_id] + id_tooltip_div_ending).empty()) {
        tippy_div = d3.select('#' + parent_div_id).append('div')
            .attr('id', col[key_id] + id_tooltip_div_ending)
            .style('width', tippy_div_width + 'px')
            .style('height', 280 + 'px')
            .style('float', 'left')
            .style('display', 'block')
            .style('display', 'none');
    } else {
        tippy_div = d3.select('#' + col[key_id] + id_tooltip_div_ending);
        tippy_div.selectAll('*').remove();
    }

    tippy_div.style('width', tippy_div_width + 'px');


    let radar_chart_div = tippy_div.append('div')
        .attr('id', col[key_id]  + id_radarChartDiv_class)
        .style('height', 280 - 20 +'px')
        .style('width', tippy_div_width+'px');


    append_radar_chart_tooltip(radar_chart_div, col[key_data_type], col, deviation);


    tippy_div.append('div')
        .style('width', tippy_div_width + 'px')
        .style('height', 20 + 'px')
        .append('svg')
        .style('width', '100%')
        .style('height', '100%')
        .append('text')
        .text(function () {
            if (col[key_header].length > 52) {
                return col[key_header].substring(0, 52) + "...";
            } else return col[key_header];
        })
        .attr('fill', 'white')
        .attr('font-size', '0.8em')
        .attr('font-weight', 500)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + tippy_div_width / 2 + ',' + 33 / 2 + ')');

    return tippy_div.node().innerHTML;
}



