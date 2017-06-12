/*global module, require */
module.exports = function (grunt) {
    'use strict';
    
    require('grunt-springroll')(grunt);
	
    grunt.registerTask('increment-version', function (level) {
        var increment = function (value) {
                var arr = value.split('.');

                switch (level) {
                case "1":
                    arr[0] = +arr[0] + 1;
                    arr[1] = 0;
                    arr[2] = 0;
                    break;
                case "2":
                    arr[1] = +arr[1] + 1;
                    arr[2] = 0;
                    break;
                case "3":
                    arr[2] = +arr[2] + 1;
                    break;
                default:
                    arr[2] = +arr[2] + 1;
                    break;
                }

                return arr.join('.');
            },
            updateVersion = function (fileName) {
                var content = null;

                if (grunt.file.exists(fileName)) {
                    if (fileName.indexOf('json') < 0) {
                        content = grunt.file.read(fileName);
                        content = content.replace(oldVersion, newVersion);
                        grunt.file.write(fileName, content);
                        grunt.log.writeln('"' + fileName + '" updated to version ' + newVersion);
                    } else {
                        content = grunt.file.readJSON(fileName);
                        if (content && content.version) {
                            content.version = newVersion;
                            grunt.file.write(fileName, JSON.stringify(content, null, 4));
                            grunt.log.writeln('"' + fileName + '" updated to version ' + newVersion);
                        } else {
                            grunt.log.warn('"' + fileName + '" does not have a version. Version not incremented.');
                        }
                    }
                } else {
                    grunt.log.warn('"' + fileName + '" does not exist. Version not incremented.');
                }
            },
            oldVersion = grunt.file.readJSON('springroll.json').version,
            newVersion = increment(oldVersion);

        updateVersion('springroll.json');
        updateVersion('package.json');
        updateVersion('bower.json');
        updateVersion('src/main.js');
        updateVersion('README.md');
    });

	// Override-able tasks for adding to the build
    grunt.registerTask('_pre-build', ['increment-version:3']);
    grunt.registerTask('_post-build', []);
    grunt.registerTask('_pre-build-debug', []);
    grunt.registerTask('_post-build-debug', []);
};