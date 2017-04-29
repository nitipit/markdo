/* Just enough of CodeMirror to run runMode under node.js */

function splitLines(string){ return string.split(/\r?\n|\r/); }

function StringStream(string) {
  this.pos = this.start = 0;
  this.string = string;
}
StringStream.prototype = {
  eol() {return this.pos >= this.string.length;},
  sol() {return this.pos == 0;},
  peek() {return this.string.charAt(this.pos) || null;},
  next() {
    if (this.pos < this.string.length)
      return this.string.charAt(this.pos++);
  },
  eat(match) {
    var ch = this.string.charAt(this.pos);
    if (typeof match == "string") var ok = ch == match;
    else var ok = ch && (match.test ? match.test(ch) : match(ch));
    if (ok) {++this.pos; return ch;}
  },
  eatWhile(match) {
    var start = this.pos;
    while (this.eat(match)){}
    return this.pos > start;
  },
  eatSpace() {
    var start = this.pos;
    while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
    return this.pos > start;
  },
  skipToEnd() {this.pos = this.string.length;},
  skipTo(ch) {
    var found = this.string.indexOf(ch, this.pos);
    if (found > -1) {this.pos = found; return true;}
  },
  backUp(n) {this.pos -= n;},
  column() {return this.start;},
  indentation() {return 0;},
  match(pattern, consume, caseInsensitive) {
    if (typeof pattern == "string") {
      function cased(str) {return caseInsensitive ? str.toLowerCase() : str;}
      if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {
        if (consume !== false) this.pos += pattern.length;
        return true;
      }
    }
    else {
      var match = this.string.slice(this.pos).match(pattern);
      if (match && consume !== false) this.pos += match[0].length;
      return match;
    }
  },
  current() {return this.string.slice(this.start, this.pos);}
};
exports.StringStream = StringStream;

exports.startState = (mode, a1, a2) => mode.startState ? mode.startState(a1, a2) : true;

var modes = exports.modes = {};
var mimeModes = exports.mimeModes = {};
exports.defineMode = (name, mode) => { modes[name] = mode; };
exports.defineMIME = (mime, spec) => { mimeModes[mime] = spec; };
exports.getMode = (options, spec) => {
  if (typeof spec == "string" && mimeModes.hasOwnProperty(spec))
    spec = mimeModes[spec];
  if (typeof spec == "string")
    var mname = spec, config = {};
  else if (spec != null)
    var mname = spec.name, config = spec;
  var mfactory = modes[mname];
  if (!mfactory) throw new Error("Unknown mode: " + spec);
  return mfactory(options, config || {});
};

exports.runMode = (string, modespec, callback) => {
  var mode = exports.getMode({indentUnit: 2}, modespec);
  var lines = splitLines(string);
  var state = exports.startState(mode);
  for (var i = 0, e = lines.length; i < e; ++i) {
    if (i) callback("\n");
    var stream = new exports.StringStream(lines[i]);
    while (!stream.eol()) {
      var style = mode.token(stream, state);
      callback(stream.current(), style, i, stream.start);
      stream.start = stream.pos;
    }
  }
};
