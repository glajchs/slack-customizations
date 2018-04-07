
var timesThroughWaitingForHome = 0;
var waitForEnvironmentHomeVariableInterval = setInterval(function() {
    if (window.process && window.process.env && window.process.env.HOME) {
        loadSlackPlugins();
        clearInterval(waitForEnvironmentHomeVariableInterval);
    } else if (timesThroughWaitingForHome > 15) {
        // *maybe* do stuff now (but without home dir portion)
        clearInterval(waitForEnvironmentHomeVariableInterval);
    } else {
        timesThroughWaitingForHome++;
    }
}, 1000);

function loadSlackPlugins() {
    var fs = require("fs");
    var homedir = window.process.env.HOME;
    // For some stupid reason, "env HOME" isn't actually the homedir for macs...it's some weird slack directory 6 levels deep beyond that.
    // Trim to just be the actual homedir instead.
    if (homedir.startsWith("/Users/")) {
        var homedirStartingWithUsername = homedir.substring("/Users/".length);
        homedir = "/Users/" + homedirStartingWithUsername.substring(0, homedirStartingWithUsername.indexOf("/"));
    }
    fs.readdir(homedir + "/" + ".slack", function (arg1, files) {
        if (files && files.length > 1) {
            // Ensure that plugin-framework.js runs last
            var pluginFrameworkFound = false;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file === "plugin-framework.js") {
                    pluginFrameworkFound = true;
                    continue;
                } else {
                    if (file.endsWith(".js")) {
                        var data = fs.readFileSync(homedir + "/" + ".slack" + "/" + file, {encoding: "utf-8"});
                        data += "\n\n//# sourceURL=/slack-customizations/" + file;
                        eval(data);
                    }
                }
            }
            var data = fs.readFileSync(homedir + "/" + ".slack" + "/" + "plugin-framework.js", {encoding: "utf-8"});
            data += "\n\n//# sourceURL=/slack-customizations/" + file;
            eval(data);
        }
    });
}

// TODO: occasionally the find stuff is getting bound too early, requiring another refresh (ctrl+r) for it to work
// window.TS.ensureFullyBooted().then(function() { console.log(arguments); })