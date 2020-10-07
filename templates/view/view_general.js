/**
 * This function adds headings to the parent div
 * @param parent_div_id
 * @param heading_label
 */
function add_heading(parent_div_id, heading_label) {
    let div_heading = d3.select('#' + parent_div_id).append('div').attr('class', id_class_heading)
        .attr('id', parent_div_id + id_heading_ending);

    div_heading.append('svg').attr('id', parent_div_id + id_heading_ending + id_svg_endging)
        .style('width', '100%')
        .style('height', '100%')
        .style('x', 0)
        .append('text')
        .text(heading_label)
        .attr('font-size', '1.2em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(0,'+33/2 +')');
}

function add_content_div(parent_div_id) {
    d3.select('#' + parent_div_id).append('div')
        .attr('id', parent_div_id + id_content_ending)
        .attr('class', id_content_class);
}

function objects_are_equivalent(a, b) {
// Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
