// Tests for the calculator.
//var ScreenshotReporter = require('./screenshotReporter.js');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

exports.config = {
  directConnect: true,

  specs: [
    'spec.js'
  ],

  framework: 'jasmine2',

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8888',

  onPrepare: function() {

    beforeEach(function() {
      //jasmine.addMatchers(protractorMatchers);
      //Some code that needs to be executed before every test.
      console.info('********************************* Before Every Test from conf.js *********************************')
    });

    var myReporter = {

      currDate: new Date().toISOString(),

      getDir: function(dir_){
        dir_ ? dir_ : "/tmp/protractorss/";
        return path.join(dir_, this.currDate);
      },

      screenshot: function(testDescription, id) {
        var fname = testDescription.replace(/\s/g, "_") + "_" + id + ".png";
        var dir = this.getDir("/tmp/protractorss/");
        mkdirp(dir);
        browser.takeScreenshot().then(function(png) {
          var stream = fs.createWriteStream(path.join(dir, fname));
          stream.write(new Buffer(png, 'base64'));
          stream.end();
        });
      },

      specDone: function(result) {
        console.log(`specDone event - result.description: ${result.description} & result.status: ${result.status}`);
        for(var i = 0; i < result.failedExpectations.length; i++) {
          this.screenshot(result.description , i);
          console.log(`specDone event - Failure: result.failedExpectations[i].message: ${result.failedExpectations[i].message}`);
          console.log(`specDone event - result.failedExpectations[i].stack ${result.failedExpectations[i].stack}`);
        }
        console.log(`specDone event - result.failedExpectations.length: ${result.failedExpectations.length}`);
        console.log(`specDone event - result.passedExpectations.length: ${result.passedExpectations.length}`);
      }
    }

    jasmine.getEnv().addReporter(myReporter);
  }
};
