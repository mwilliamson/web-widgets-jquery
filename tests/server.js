var fs = require("fs");
var path = require("path");
var http = require("http");
var url = require("url");

var _ = require("underscore");
var connect = require("connect");

var template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");


function startServer(options) {
    var app = connect()
        .use(serveIndex(options));

    for (name in options.dependencies) {
        app = app.use(serveFile(name, options.dependencies[name]));
    }

    app = app.use(connect.static(__dirname));

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

function serveIndex(options) {
    return function(request, response, next) {
        if (request.url !== "/") {
            next();
        } else {
            response.writeHead(200, {
                "content-type": "text/html;charset=utf8"
            });
            
            var dependencies = _.keys(options.dependencies);
            
            fs.readdir(__dirname, function(err, filenames) {
                var testFiles = Array.prototype.filter.call(filenames, function(name) {
                    return /\.test\.js$/.test(name);
                });

                var html = writeScriptTags(template, "DEPENDENCY_SCRIPTS", dependencies);
                html = writeScriptTags(html, "TEST_SCRIPTS", testFiles);
                response.write(html);
                
                response.end();
            });
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

if (require.main === module) {
    startServer({
        port: 54321,
        dependencies: {
            "/web-widgets-jquery.js": path.join(__dirname, "../_build/web-widgets-jquery.js")
        }
    });
}
