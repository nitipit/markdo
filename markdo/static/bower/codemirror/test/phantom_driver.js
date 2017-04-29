var page = require('webpage').create();

page.open("http://localhost:3000/test/index.html", status => {
  if (status != "success") {
    console.log("page couldn't be loaded successfully");
    phantom.exit(1);
  }
  waitFor(() => page.evaluate(() => {
    var output = document.getElementById('status');
    if (!output) { return false; }
    return (/^(\d+ failures?|all passed)/i).test(output.innerText);
  }), () => {
    var failed = page.evaluate(() => window.failed);
    var output = page.evaluate(() => document.getElementById('status').innerText);
    console.log(output);
    phantom.exit(failed > 0 ? 1 : 0);
  });
});

function waitFor (test, cb) {
  if (test()) {
    cb();
  } else {
    setTimeout(() => { waitFor(test, cb); }, 250);
  }
}
