var jQuery = require("jquery");
// TODO: jQuery seems to enter global scope


$.fn.widget = function(widget, options) {
    this.each(function() {
        var optionsWithElement = Object.create(options);
        optionsWithElement.element = this;
        widget(optionsWithElement);
    });
    return this;
};
