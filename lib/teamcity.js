/**
 * Module dependencies.
 */

var Base, log, isfailed;

if (typeof window === 'undefined') {
  // running in Node
  Base = require('mocha').reporters.Base;
  log = console.log;
} else {
  // running in mocha-phantomjs
  Base = require('./base');
  log = function(msg) { process.stdout.write(msg + "\n"); };
}

/**
 * Expose `Teamcity`.
 */

exports = module.exports = Teamcity;

/**
 * Initialize a new `Teamcity` reporter.
 *
 * @param {Runner} runner
 * @api public
 */
 
function Teamcity(runner) {
  Base.call(this, runner);
  var stats = this.stats;

  runner.on('suite', function(suite) {
    if (suite.root) return;
    	isfailed = false;
    	log("##teamcity[testStarted name='" + escape(suite.title) + "' captureStandardOutput='true']");
  });

  runner.on('test', function(test) {
  	log("test step started: name='" + escape(test.title) + "' captureStandardOutput='true']");
  });

  runner.on('fail', function(test, err) {
  	log("test step failed name='" + escape(test.title) + "' message='" + escape(err.message) + "' captureStandardOutput='true' details='" + escape(err.stack) + "']");
  	isfailed = true;
  });

  runner.on('pending', function(test) {
  	log("test step ignored name= " + escape(test.title));
  });

  runner.on('test end', function(test) {
  	log("test step finished name= " + escape(test.title));
  });

  runner.on('suite end', function(suite) {
  	if (suite.root) return;
  	if(isfailed) {
  		log("##teamcity[testFailed name='" + escape(suite.title) + "']");
  	}
	else {
		log("##teamcity[testFinished name='" + escape(suite.title) + "']");	
	}
  });

  runner.on('end', function() {
    //console.log("##teamcity[testSuiteFinished name='mocha.suite'" + "']");
  });
}

/**
 * Escape the given `str`.
 */

function escape(str) {
  if (!str) return '';
  return str
    .replace(/\|/g, "||")
    .replace(/\n/g, "|n")
    .replace(/\r/g, "|r")
    .replace(/\[/g, "|[")
    .replace(/\]/g, "|]")
    .replace(/\u0085/g, "|x")
    .replace(/\u2028/g, "|l")
    .replace(/\u2029/g, "|p")
    .replace(/'/g, "|'");
}
