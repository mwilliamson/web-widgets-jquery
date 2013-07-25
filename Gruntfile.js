module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        qunit: {
            files: ["test.html"],
            options: {
                urls: ["http://localhost:54321"]
            }
        },
        serve_qunit_tests: {
            options: {
                port: 54321,
                dependencies: {
                    "/web-widgets-jquery.js": "_build/web-widgets-jquery.js"
                }
            },
            src: "tests/**/*.test.js"
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks("grunt-serve-qunit-tests");

    grunt.registerTask("test", ["serve_qunit_tests", "qunit"]);

};
