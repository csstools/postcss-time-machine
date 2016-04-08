var tests = {
	'postcss-time-machine': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:current-color': {
			message: 'supports { "current-color": false }',
			options: {
				'current-color': false
			}
		},
		'basic:link': {
			message: 'supports { ":link": false }',
			options: {
				':link': false
			}
		},
		'basic:box-sizing': {
			message: 'supports { "box-sizing": false }',
			options: {
				'box-sizing': false
			}
		}
	}
};

var debug = true;
var dir   = './test/';

var fs      = require('fs');
var path    = require('path');
var plugin  = require('./');
var test    = require('tape');

Object.keys(tests).forEach(function (name) {
	var parts = tests[name];

	test(name, function (t) {
		var fixtures = Object.keys(parts);

		t.plan(fixtures.length * 2);

		fixtures.forEach(function (fixture) {
			var message    = parts[fixture].message;
			var options    = parts[fixture].options;
			var warning    = parts[fixture].warning || 0;
			var warningMsg = message + ' (# of warnings)';

			var baseName   = fixture.split(':')[0];
			var testName   = fixture.split(':').join('.');

			var inputPath  = path.resolve(dir + baseName + '.css');
			var expectPath = path.resolve(dir + testName + '.expect.css');
			var actualPath = path.resolve(dir + testName + '.actual.css');

			var inputCSS = '';
			var expectCSS = '';

			try {
				inputCSS = fs.readFileSync(inputPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(inputPath, inputCSS);
			}

			try {
				expectCSS = fs.readFileSync(expectPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(expectPath, expectCSS);
			}

			plugin.process(inputCSS, options).then(function (result) {
				var actualCSS = result.css;

				if (debug) fs.writeFileSync(actualPath, actualCSS);

				t.equal(actualCSS, expectCSS, message);

				t.equal(result.warnings().length, warning, warningMsg);
			});
		});
	});
});