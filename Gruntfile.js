module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        qunit: {
            files: ["test.html"],
            options: {
                urls: ["http://localhost:54321"]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');

//    grunt.registerTask("test", ["qunit"]);
};
