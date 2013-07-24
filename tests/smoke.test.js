(function() {
    var jquery = require("jquery");
    require("web-widgets-jquery");
    // TODO: jquery seems to enter global scope    

    test("widget plugin applies widget to elements", function() {
        var helloWidget = function(options) {
            options.element.textContent = "Hello " + options.name;
        };

        var element = createEmptyDiv();
        $(element).widget(helloWidget, {name: "Bob"});

        strictEqual(element.textContent, "Hello Bob");
    });

    function createEmptyDiv() {
        var div = document.createElement("div");
        var fixture = document.getElementById("qunit-fixture");
        fixture.appendChild(div);
        return div;
    }

})();
