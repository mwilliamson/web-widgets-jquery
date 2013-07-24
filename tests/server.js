var fs = require("fs");
var path = require("path");
var http = require("http");

var connect = require("connect");

var template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");


function serveIndex(request, response, next) {
    if (request.url !== "/") {
        next();
    } else {
        response.writeHead(200, {
            "content-type": "text/html;charset=utf8"
        });
        
        fs.readdir(__dirname, function(err, filenames) {
            var testFiles = Array.prototype.filter.call(filenames, function(name) {
                return /\.test\.js$/.test(name);
            });
            
            var scriptElements = testFiles.map(function(name) {
                var src = "/" + name;
                return '<script src="' + src + '"></script>';
            });
            var scriptHtml = scriptElements.join("\n");
            var html = template.replace("<!-- SCRIPTS -->", scriptHtml);
            
            response.write(html);
            
            response.end();
        });
    }
}

var app = connect()
    .use(serveIndex)
    .use(connect.static(path.join(__dirname, "../_build")))
    .use(connect.static(__dirname));

http.createServer(app).listen(54321);
