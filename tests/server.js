var fs = require("fs");
var path = require("path");
var http = require("http");
var url = require("url");

var _ = require("underscore");
var connect = require("connect");

var template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");


exports.startServer = startServer;

function startServer(options) {
    var app = connect();

    for (name in options.dependencies) {
        app = app.use(serveFile(name, options.dependencies[name]));
    }
    var testSrcs = options.tests.map(function(testFile, index) {
        var name = "/__tests/" + index + ".js";
        app = app.use(serveFile(name, testFile));
        return name;
    });

    app = app.use(connect.static(__dirname));

    app = app.use(serveIndex(options, testSrcs));

    http.createServer(app).listen(options.port);
}

function serveFile(name, path) {
    return function(request, response, next) {
        if (url.parse(request.url).pathname === name) {
            response.writeHead(200, {"content-type": "text/javascript"});
            fs.readFile(path, function(err, contents) {
                response.write(contents);
                response.end();
            });
        } else {
            next();
        }
    };
}

function serveIndex(options, testSrcs) {
    return function(request, response, next) {
        if (request.url !== "/") {
            next();
        } else {
            response.writeHead(200, {
                "content-type": "text/html;charset=utf8"
            });
            
            var dependencies = _.keys(options.dependencies);
            
            var html = writeScriptTags(template, "DEPENDENCY_SCRIPTS", dependencies);
            html = writeScriptTags(html, "TEST_SCRIPTS", testSrcs);
            response.write(html);
            
            response.end();
        }
    };
}

function writeScriptTags(template, holeName, fileNames) {
    var scriptElements = fileNames.map(function(name) {
        // TODO: escaping
        return '<script src="' + name + '"></script>';
    });
    var scriptHtml = scriptElements.join("\n");
    return template.replace("<!-- " + holeName + " -->", scriptHtml);
}

