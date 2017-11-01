(function() {
  'use strict';
  var mspec,
    _ = require('lodash');

  function clearMSpec() {
    delete require.cache[require.resolve('../')];
    mspec = require('../');
  }

  describe('Tests for gulp-mspec-runner', function() {
    beforeEach(function() {
      clearMSpec();

      jasmine.addMatchers({
        toDeepEqual: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              var result = {};
              result.pass = _.isEqual(actual, expected);
              return result;
            }
          };
        }
      });
    });

    describe('Test quoted executable path and path with spaces.', function() {
      var opts;

      it('Should not quote a non-quoted string', function() {
        opts = {
          executable: 'C:\\mspec\\bin\\mspec-clr4.exe'
        };

        expect(mspec.getExecutable(opts)).toEqual('C:\\mspec\\bin\\mspec-clr4.exe');
      });

      it('Should unquote a double-quoted string', function() {
        opts = {
          executable: '"C:\\mspec\\bin\\mspec-clr4.exe"'
        };

        expect(mspec.getExecutable(opts)).toEqual('C:\\mspec\\bin\\mspec-clr4.exe');
      });

      it('Should unquote a single-quoted string', function() {
        opts = {
          executable: "'C:\\mspec\\bin\\mspec-clr4.exe'"
        };

        expect(mspec.getExecutable(opts)).toEqual('C:\\mspec\\bin\\mspec-clr4.exe');
      });

    });

    describe('Adding assemblies and option switches should yield correct command.', function() {
      var stream,
        opts,
        assemblies;

      it('Should throw an error with no assemblies', function(cb) {
        stream = mspec({
          executable: 'C:\\mspec\\bin\\mspec-clr4.exe'
        });
        stream.on('error', function(err) {
          expect(err.message).toEqual('File may not be null.');
          cb();
        });
        stream.write();
      });

      it('Should have correct options with assemblies only.', function() {
        opts = {
          executable: 'C:\\mspec\\bin\\mspec-clr4.exe'
        };

        assemblies = ['First.Test.dll', 'Second.Test.dll'];

        expect(mspec.getArguments(opts, assemblies)).toDeepEqual(['First.Test.dll', 'Second.Test.dll']);
      });

      it('Should have correct options with options and assemblies.', function() {
        var switchChar = '--';

        opts = {
          executable: 'C:\\mspec\\bin\\mspec-clr4.exe',
          options: {
            "silent": true,
            "timeinfo": false,
						"no-color": true
          }
        };

        assemblies = ['First.Test.dll', 'Second.Test.dll'];


        expect(mspec.getArguments(opts, assemblies)).toDeepEqual(
          [
            switchChar + 'silent',
            switchChar + 'no-color',
            'First.Test.dll',
            'Second.Test.dll'
          ]);
      });

      it('Should properly format multi args.', function() {
        var switchChar = '--';

        opts = {
          options: {
            exclude: ['Acceptance', 'Integration']
          }
        };

        expect(mspec.getArguments(opts, [])).toDeepEqual(
          [
            switchChar + 'exclude', 'Acceptance,Integration'
          ]);
      });
    });
  });
}());
