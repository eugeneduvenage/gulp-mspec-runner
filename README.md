# gulp-mspec-runner
[![NPM version](http://img.shields.io/npm/v/gulp-mspec-runner.svg?style=flat)](http://npmjs.org/gulp-mspec-runner)
[![NPM downloads](http://img.shields.io/npm/dm/gulp-mspec-runner.svg?style=flat)](http://npmjs.org/gulp-mspec-runner)
[![Build Status](http://img.shields.io/travis/eugeneduvenage/gulp-mspec-runner/master.svg?style=flat)](https://travis-ci.org/eugeneduvenage/gulp-mspec-runner)
[![Dependencies Status](http://img.shields.io/david/eugeneduvenage/gulp-mspec-runner.svg?style=flat)](https://david-dm.org/eugeneduvenage/gulp-mspec-runner)
[![DevDependencies Status](http://img.shields.io/david/dev/eugeneduvenage/gulp-mspec-runner.svg?style=flat)](https://david-dm.org/eugeneduvenage/gulp-mspec-runner#info=devDependencies)

A [Gulp.js](http://gulpjs.com/) plugin to facilitate running [MSpec](https://github.com/machine/machine.specifications) tests on .NET assemblies. Much of this work is based on the [gulp-nunit-runner](http://npmjs.org/gulp-nunit-runner) plugin.

## Installation
From the root of your project (where your `gulpfile.js` is), issue the following command:

```bat
npm install --save-dev gulp-mspec-runner
```

## Usage
The plugin uses standard `gulp.src` globs to retrieve a list of assemblies that should be tested with MSpec. By default the plugin looks for the MSpec console runner in your `PATH`. You can optionally specify the MSpec `bin` folder or the full path of the runner as demonstrated below. You should add `{read: false}` to your `gulp.src` so that it doesn't actually read the files and only grabs the file names.

```javascript
var gulp = require('gulp'),
    mspec = require('gulp-mspec-runner');

gulp.task('mspec-test', function () {
    return gulp.src(['**/*.Specs.dll'], {read: false})
        .pipe(mspec({
            executable: 'C:/mspec/bin/mspec-clr4.exe',
        }));
});
```

This would result in the following command being executed (assuming you had Database and Services specification assemblies.)

```bat
C:/mspec/bin/mspec-clr4.exe "C:\full\path\to\Database.Specs.dll" "C:\full\path\to\Services.Specs.dll"
```

Note: If you use Windows paths with `\`'s, you need to escape them with another `\`. (e.g. `C:\\mspec\\bin\\mspec-clr4.exe`). However, you may also use forward slashes `/` instead which don't have to be escaped.

You may also add options that will be used as MSpec command line switches. Any property that is a boolean `true` will simply be added to the command line, String values will be added to the switch parameter separated by a colon and arrays will be a comma seperated list of values.

For more information on available switches, see the MSpec documentation:

[https://github.com/machine/machine.specifications#command-line-reference](https://github.com/machine/machine.specifications#command-line-reference)

```javascript
var gulp = require('gulp'),
    mspec = require('gulp-mspec-runner');

gulp.task('mspec-test', function () {
    return gulp.src(['**/*.Specs.dll'], {read: false})
        .pipe(mspec({
            executable: 'C:/mspec/bin/mspec-clr4.exe',
            options: {
              "silent": true,
              "no-color": true
            }
        }));
});
```

This would result in the following command:

```bat
C:/mspec/bin/mspec-clr4.exe --silent --no-color "C:\full\path\to\Database.Test.dll" "C:\full\path\to\Services.Test.dll"
```

## Options
Below are all available options.

```js
mspec({

    // The MSpec bin folder or the full path of the console runner.
    // If not specified the MSpec bin folder must be in the `PATH`.
    executable: 'c:/Program Files/MSpec/bin',

    // The options below map directly to the MSpec console runner. See here
    // for more info: https://github.com/machine/machine.specifications#command-line-reference
    options: {
        // Filter file specifying contexts to execute (full type name, one per line). Takes precedence over tags.
        "filters": 'filters.txt',

        // Executes all specifications in contexts with these comma delimited tags. Ex. -include "foo, bar, foo_bar".
        "include": ['foo', 'bar'],

        // Exclude specifications in contexts with these comma delimited tags. Ex. -exclude "foo, bar, foo_bar".
        "exclude": ['foo', 'bar'],

        // Shows time-related information in HTML output.
        "timeinfo": true|false,

        // Suppress progress output (print fatal errors, failures and summary).
        "silent": true|false,

        // Print dotted progress output.
        "progress": true|false,

        // Suppress colored console output.
        "no-color": true|false,        

        // Wait 15 seconds for debugger to be attached.
        "wait": true|false,      

        // Reporting for TeamCity CI integration (also auto-detected).
        "teamcity": true|false,

        // Disables TeamCity autodetection.
        "no-teamcity-autodetect": true|false

        // Reporting for AppVeyor CI integration (also auto-detected).
        "appveyor": true|false

        // Disables AppVeyor autodetection.
        "no-appveyor-autodetect": true|false

        // Outputs the HTML report to path, one-per-assembly w/ index.html (if directory, otherwise all are in one file).
        "html": './output/results.html'

        // Outputs the XML report to the file referenced by the path.
        "xml": './output/results.xml'                
    }
});
```

## Release Notes
### 0.1.0 (26 December 2015)
- Initial release
