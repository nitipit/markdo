#!/usr/bin/env node

var lint = require("./lint/lint");

lint.checkDir("mode");
lint.checkDir("lib");

var ok = lint.success();

var files = new (require('node-static').Server)('.');

var server = require('http').createServer((req, res) => {
  req.addListener('end', () => {
    files.serve(req, res);
  });
}).addListener('error', err => {
  throw err;
}).listen(3000, () => {
  var child_process = require('child_process');
  child_process.exec("which phantomjs", err => {
    if (err) {
      console.error("PhantomJS is not installed. Download from http://phantomjs.org");
      process.exit(1);
    }
    var cmd = 'phantomjs test/phantom_driver.js';
    child_process.exec(cmd, (err, stdout) => {
      server.close();
      console.log(stdout);
      process.exit(err || !ok ? 1 : 0);
    });
  });
});
