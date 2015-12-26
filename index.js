'use strict';
var _ = require('lodash'),
  child_process = require('child_process'),
  gutil = require('gulp-util'),
  PluginError = gutil.PluginError,
  es = require('event-stream'),
  path = require('path'),
  fs = require('fs'),

  PLUGIN_NAME = 'gulp-mspec-runner',
  MSPEC_CONSOLE = 'mspec-clr4.exe',
  MSPEC_X86_CONSOLE = 'mspec-x86-clr4.exe',
  runner;

// Main entry point
runner = function gulpMSpecRunner(opts) {
		var stream,
		files;
		opts = opts || {};

		files = [];

		stream = es.through(function write(file) {
			if (_.isUndefined(file)) {
				fail(this, 'File may not be null.');
			}

			files.push(file);
			this.emit('data', file);
		}, function end() {
			run(this, files, opts);
		});

		return stream;
	};

runner.getExecutable = function (options) {
		var executable,
		consoleRunner;
		consoleRunner = options.platform === 'x86' ? MSPEC_X86_CONSOLE : MSPEC_CONSOLE;
		if (!options.executable) {
			return consoleRunner;
		}
		// trim any existing surrounding quotes and then wrap in ""
		executable = trim(options.executable, '\\s', '"', "'");
		return !path.extname(options.executable) ?
		path.join(executable, consoleRunner) : executable;
	};

runner.getArguments = function (options, assemblies) {
		var args = [];

		if (options.options) {
			args = args.concat(parseSwitches(options.options));
		}
		args = args.concat(assemblies);

		return args;
	};

function parseSwitches(options) {
		var filtered,
		switches,
		switchChar = '--';

		switches = _.map(options, function (val, key) {
			var qualifier;
			if (typeof val === 'boolean') {
				if (val) {
					return (switchChar + key);
				}
				return undefined;
			}
			if (typeof val === 'string') {
				qualifier = val.trim().indexOf(' ') > -1 ? '"' : '';
				return (switchChar + key + ':' + qualifier + val + qualifier);
			}
			if (val instanceof Array) {
				return (switchChar + key + ':' + val.join(','));
			}
		});

		filtered = _.filter(switches, function (val) {
			return !_.isUndefined(val);
		});

		return filtered;
	}

function fail(stream, msg) {
		stream.emit('error', new gutil.PluginError(PLUGIN_NAME, msg));
	}

function end(stream) {
		stream.emit('end');
	}

function run(stream, files, options) {

	var child,
	args,
	exe,
	opts,
	assemblies,
	cleanupTempFiles;

	options.options = options.options || {};

	assemblies = files.map(function (file) {
			return file.path;
		});

	if (assemblies.length === 0) {
		return fail(stream, 'Some assemblies required.');
	}

	opts = {
			stdio: [process.stdin, process.stdout, process.stderr, 'pipe']
		};

	exe = runner.getExecutable(options);
	args = runner.getArguments(options, assemblies);

	child = child_process.spawn(exe, args, opts);

	child.on('error', function (e) {
			fail(stream, e.code === 'ENOENT' ? 'Unable to find \'' + exe + '\'.' : e.message);
		});

	child.on('close', function (code) {
			if (cleanupTempFiles) {
				cleanupTempFiles();
			}
			if (code !== 0) {
				gutil.log(gutil.colors.red('Machine Specification tests failed.'));
				fail(stream, 'Machine Specification tests failed.');
			} else {
				gutil.log(gutil.colors.cyan('Machine Specification tests passed'));
			}
			return end(stream);
		});
}

function trim() {
		var args = Array.prototype.slice.call(arguments),
		source = args[0],
		replacements = args.slice(1).join(','),
		regex = new RegExp("^[" + replacements + "]+|[" + replacements + "]+$", "g");
		return source.replace(regex, '');
	}

module.exports = runner;
