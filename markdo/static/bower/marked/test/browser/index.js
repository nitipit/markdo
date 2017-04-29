var fs = require('fs');

var test = require('../');
var runTests = test.runTests;
var load = test.load;
var express = require('express');
var app = express();

app.use((req, res, next) => {
  var setHeader = res.setHeader;
  res.setHeader = function(name) {
    switch (name) {
      case 'Cache-Control':
      case 'Last-Modified':
      case 'ETag':
        return;
    }
    return setHeader.apply(res, arguments);
  };
  next();
});

var dir = __dirname + '/../tests';
var files = {};

app.get('/test.js', (req, res, next) => {
  var test = fs.readFileSync(__dirname + '/test.js', 'utf8');
  var files = load();

  test = test.replace('__TESTS__', JSON.stringify(files));
  test = test.replace('__MAIN__', runTests + '');

  res.contentType('.js');
  res.send(test);
});

app.use(express.static(__dirname + '/../../lib'));
app.use(express.static(__dirname));

app.listen(8080);
