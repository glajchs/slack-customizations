
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
    fs.readdir(window.process.env.HOME + "/" + ".slack", function(arg1, files) {
        if (files && files.length > 1) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file.endsWith(".js")) {
                    fs.readFile(window.process.env.HOME + "/" + ".slack" + "/" + file, {encoding: "utf-8"}, function(err, data) {
                        if (!err) {
                            var script = document.createElement("script")
                            script.innerText = data;
                            eval(data);
                            script.setAttribute("type", "text/javascript");
                            document.getElementsByTagName("head")[0].appendChild(script);
                        }
                    });
                } else if (file.endsWith(".css")) {
                    fs.readFile(window.process.env.HOME + "/" + ".slack" + "/" + file, {encoding: "utf-8"}, function(err, data) {
                        if (!err) {
                            var css = document.createElement("style")
                            css.innerText = data;
                            document.getElementsByTagName("head")[0].appendChild(css);
                        }
                    });
                }
            }
        }
    });
}
