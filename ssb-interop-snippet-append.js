
var timesThroughWaitingForHome = 0;
var waitForEnvironmentHomeVariableInterval = setInterval(function() {
    if (window.process && window.process.env && window.process.env.HOME) {
        loadEvergageCustom();
        clearInterval(waitForEnvironmentHomeVariableInterval);
    } else if (timesThroughWaitingForHome > 15) {
        // *maybe* do stuff now (but without home dir portion)
        clearInterval(waitForEnvironmentHomeVariableInterval);
    } else {
        timesThroughWaitingForHome++;
    }
}, 1000);

function loadEvergageCustom() {
    var fs = require("fs");
    var homedir = window.process.env.HOME;
    // For some stupid reason, "env HOME" isn't actually the homedir for macs...it's some weird slack directory 6 levels deep beyond that.
    // Trim to just be the actual homedir instead.
    if (homedir.startsWith("/Users/")) {
        var homedirStartingWithUsername = homedir.substring("/Users/".length);
        homedir = "/Users/" + homedirStartingWithUsername.substring(0, homedirStartingWithUsername.indexOf("/"));
    }
    fs.readdir(homedir + "/" + ".slack", function(arg1, files) {
        if (files && files.length > 1) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file.endsWith(".js")) {
                    fs.readFile(homedir + "/" + ".slack" + "/" + file, {encoding: "utf-8"}, function(err, data) {
                        if (!err) {
                            var script = document.createElement("script");
                            script.innerText = data;
                            eval(data);
                            script.setAttribute("type", "text/javascript");
                            document.getElementsByTagName("head")[0].appendChild(script);
                        }
                    });
                } else if (file.endsWith(".css")) {
                    fs.readFile(homedir + "/" + ".slack" + "/" + file, {encoding: "utf-8"}, function(err, data) {
                        if (!err) {
                            var css = document.createElement("style");
                            css.innerText = data;
                            document.getElementsByTagName("head")[0].appendChild(css);
                        }
                    });
                }
            }
        }
    });
}

// TODO: occasionally the find stuff is getting bound too early, requiring another refresh (ctrl+r) for it to work
// window.TS.ensureFullyBooted().then(function() { console.log(arguments); })