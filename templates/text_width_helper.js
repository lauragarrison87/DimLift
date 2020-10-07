var BrowserText = (function () {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    /**
     * Measures the rendered width of arbitrary text given the font size and font face
     * @param {string} text The text to measure
     * @param {number} fontSize The font size in pixels
     * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
     * @returns {number} The width of the text
     **/
    function getWidth(text, fontSize, fontFace) {
        context.font = fontSize + ' ' + fontFace;
        return context.measureText(text).width;
    }

    return {
        getWidth: getWidth
    };
})();

const dots = '...';

function shorten_label_to_save_space(text, max_width, font_size) {
    if (BrowserText.getWidth(text, font_size) > max_width) {
        let splitted_by_dots = text.split(dots);

        splitted_by_dots[0] = splitted_by_dots[0].slice(0, -1);

        return shorten_label_to_save_space(splitted_by_dots[0] + dots, max_width, font_size);
    } else {
        return text;
    }
}