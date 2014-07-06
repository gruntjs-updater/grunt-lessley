/*
 * grunt-lessley
 * https://github.com/pixelass/grunt-lessley
 *
 * Copyright (c) 2014 Gregor Adams
 * Licensed under the MIT license.
 */

'use strict';
var color = require('cli-color');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('lessley', 'run lessley tests in grunt', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    // Iterate over all specified file groups.
    this.files.forEach(function (f) {
      // Concat specified files.
      var src = f.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
          var tests = grunt.file.read(filepath)
            .toString()
            .split(/\/\*\*\/\n\s\/\*\*/);

          var test;
          var results = {
            passes: 0,
            fails: 0
          };

          function printMultiLine(ln) {
            if (ln.match('✘:')) {
              grunt.log.writeln(color.red(ln.replace('✘:', '')));
              results.fails++;
            } else if (ln.match('✔︎:')) {
              grunt.log.writeln(color.green(ln.replace('✔︎:', '')));
              results.passes++;
            }
          }

          grunt.log.writeln(color.blue('Running tests'));

          for (var i = 0; i < tests.length; i++) {
            test = tests[i].toString()
              .replace(/\/\*+.*/ig, '')
              .replace('@test ', '')
              .replace(/\*/ig, '')
              .replace(/\*/ig, '')
              .replace(/\{/ig, '')
              .replace(/\}/ig, '');
            test = test.split('\n');

            grunt.log.writeln(test[1]);

            for (var j = 2; j < test.length - 2; j++) {
              printMultiLine(test[j]);
            }

          }

          grunt.log.write(color.blue('Completed ' + (results.fails + results.passes) + ((results.fails +
              results.passes) === 1 ? ' test' : ' tests') +
            ', '));
          grunt.log.write(color.red(results.fails + (results.fails === 1 ? ' test' : ' tests') +
            ' failed, '));
          grunt.log.write(color.green(results.passes + (results.passes === 1 ? ' test' :
            ' tests') + ' passed'));

        return tests;
      });

      // Write the destination file.
      grunt.file.write(f.dest, src);

    });
  });

};