module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        qunit: {
            files: ["test.html"],
            options: {
                urls: ["http://localhost:54321"]
            }
        },
        "serve-qunit-tests": {
            options: {
                port: 54321,
                dependencies: {
                    "/web-widgets-jquery.js": "_build/web-widgets-jquery.js"
                },
                tests: "tests/**/*.test.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask("serve-qunit-tests", "Server qunit tests", function() {
        var options = this.options();
        require("./tests/server").startServer({
            port: options.port,
            dependencies: options.dependencies,
            tests: options.tests
        });
    });

    grunt.registerTask("test", ["serve-qunit-tests", "qunit"]);

};
