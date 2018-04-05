window.slackPlugins = window.slackPlugins || (function(window) {
    var slackPluginsAPI = {};

    var fs = require("fs");
    var homedir = window.process.env.HOME;
    // For some stupid reason, "env HOME" isn't actually the homedir for macs...it's some weird slack directory 6 levels deep beyond that.
    // Trim to just be the actual homedir instead.
    if (homedir.startsWith("/Users/")) {
        var homedirStartingWithUsername = homedir.substring("/Users/".length);
        homedir = "/Users/" + homedirStartingWithUsername.substring(0, homedirStartingWithUsername.indexOf("/"));
    }

    // TODO: I obviously shouldn't have to use this 2xinterval mess.  Need to figure out a reliable insertion point for these functions
    var prefsDialogInitializedIntervalMaxTries = 100;
    var prefsDialogInitializedIntervalCounter = 0;
    var prefsDialogInitializedInterval = setInterval(function() {
        try {
            prefsDialogInitializedIntervalCounter++;
            if (prefsDialogInitializedIntervalCounter > prefsDialogInitializedIntervalMaxTries) {
                clearInterval(prefsDialogInitializedInterval);
                return;
            }
            if (typeof TS.ui.prefs_dialog.start === "function") {
                replacePrefsDialogStartFunction();
                clearInterval(prefsDialogInitializedInterval);
            }
        } catch (exception) {
            // no-op
        }
    }, 100);

    var prefsDialogInsertPluginsIntervalMaxTries = 100;
    var prefsDialogInsertPluginsIntervalCounter = 0;
    var prefsDialogInsertPluginsInterval;
    function replacePrefsDialogStartFunction() {
        var originalPrefsStart = TS.ui.prefs_dialog.start;
        TS.ui.prefs_dialog.start = function (a, b) {
            originalPrefsStart(a, b);
            clearInterval(prefsDialogInsertPluginsInterval);
            prefsDialogInsertPluginsInterval = setInterval(function () {
                try {
                    prefsDialogInsertPluginsIntervalCounter++;
                    if (prefsDialogInsertPluginsIntervalCounter > prefsDialogInsertPluginsIntervalMaxTries) {
                        clearInterval(prefsDialogInsertPluginsInterval);
                        return;
                    }
                    if ($(".fs_modal_sidebar:visible").length > 0) {
                        insertPluginSection();
                        clearInterval(prefsDialogInsertPluginsInterval);
                    }
                } catch (exception) {
                    // no-op
                }
            }, 100);
        };
    }

    function insertPluginSection() {
        var pluginsSectionLink = $("<li><button type=\"button\" class=\"btn_basic sidebar_menu_list_item\" data-section=\"plugins\">Plugins</button></li>");
        pluginsSectionLink.unbind("click.slackPlugins");
        pluginsSectionLink.bind("click.slackPlugins", function (event){
            showPluginsUI();
            $("#fs_modal_sidebar button").removeClass("is_active");
            pluginsSectionLink.find("button").addClass("is_active");
        });
        $("fs_modal_sidebar li").not(pluginsSectionLink).bind("click.slackPlugins", function(event) {
            pluginsSectionLink.find("button").removeClass("is_active");
        });
        $("#fs_modal_sidebar").append(pluginsSectionLink);
    }

    function showPluginsUI() {
        var contentsDiv = $("#fs_modal .contents");
        contentsDiv.empty();
        $("<h2 id=\"prefs_plugins\" class=\"inline_block\">Plugins</h2>").appendTo(contentsDiv);
        var enablePluginsElement = $("<p></p>");
        enablePluginsElement.appendTo(contentsDiv);
        var enablePluginsObject = {
            pluginName: "enable_plugins",
            pluginNameFriendly: "Enable Slack Plugins (Third Party)"
        };
        createOptionCheckbox(enablePluginsObject).appendTo(enablePluginsElement);
        $("<h2 id=\"prefs_plugins_list\" class=\"inline_block\">Plugins List</h2>").appendTo(contentsDiv);
        var pluginsListElement = $("<p></p>");
        pluginsListElement.appendTo(contentsDiv);
        for (var i = 0; i < window.slackPluginList.length; i++) {
            var plugin = window.slackPluginList[i];
            createOptionCheckbox(plugin).appendTo(pluginsListElement);
        }
        var applyDiv = $("<div></div>");
        applyDiv.addClass("c-button").addClass("c-button--small").addClass("c-button--outline");
        applyDiv.unbind("click.slackPlugins");
        applyDiv.bind("click.slackPlugins", function () {
            window.location.reload();
        });
        $("<span></span>").text("Apply").appendTo(applyDiv);
        applyDiv.appendTo(contentsDiv);
    }

    function createOptionCheckbox(plugin) {
        // TODO: Use an actual css file so I can do styling of this in a sane way, and also an HTML template file (or section)
        // TODO: Add cursor: pointer on hover of the expandy icons once that's done
        var divWrapper = $("<div></div>");
        var labelElement = $("<label class=\"checkbox\"></label>");
        if (plugin.pluginName !== "enable_plugins") {
            labelElement.css("padding-left", "3rem");
        }
        var inputElement = $("<input type=\"checkbox\">");
        inputElement.attr("id", plugin.pluginName);
        // TODO: Can't get TS.prefs.setPrefLocal to stick across reloads.  Figure that out maybe?  Or just keep using localStorage
        inputElement.prop("checked", "true" === window.localStorage.getItem("slackPlugins_" + plugin.pluginName));
        inputElement.unbind("change.slackPlugins");
        inputElement.bind("change.slackPlugins" , function(event) {
            var name = event.target.id;
            var value = !!event.target.checked;
            window.localStorage.setItem("slackPlugins_" + name, value);
        });
        labelElement.append(inputElement);
        labelElement.append(plugin.pluginNameFriendly);
        labelElement.appendTo(divWrapper);
        if (plugin.pluginName !== "enable_plugins") {
            var descriptionRow = $("<div></div>");
            var showIcon = $("<i></i>").addClass("c-deprecated-icon").addClass("c-ison--caret-down").attr("type", "caret-down").attr("aria-hidden", "true").text("");
            showIcon.css({
                fontFamily: "Slack v2",
                fontSize: "20px",
                fontStyle: "normal",
                verticalAlign: "middle"
            });
            showIcon.appendTo(descriptionRow);
            showIcon.unbind("click.slackPlugins");
            showIcon.bind("click.slackPlugins", function () {
                descriptionRow.hide();
                fullDescriptionRow.show();
            });
            descriptionRow.append($("<span></span>").text(plugin.pluginDescriptionShort));
            descriptionRow.css("padding-left", "3rem");
            descriptionRow.css("padding-bottom", "10px");
            descriptionRow.css("font-size", "14px");
            descriptionRow.appendTo(divWrapper);

            var fullDescriptionRow = $("<div></div>");
            var hideIcon = $("<i></i>").addClass("c-deprecated-icon").addClass("c-ison--caret-up").attr("type", "caret-up").attr("aria-hidden", "true").text("");
            hideIcon.appendTo(fullDescriptionRow);
            hideIcon.unbind("click.slackPlugins");
            hideIcon.bind("click.slackPlugins", function () {
                descriptionRow.show();
                fullDescriptionRow.hide();
            });
            hideIcon.css({
                fontFamily: "Slack v2",
                fontSize: "20px",
                fontStyle: "normal",
                verticalAlign: "middle"
            });
            fullDescriptionRow.append($("<span></span>").text(plugin.pluginDescriptionLong));
            fullDescriptionRow.css("padding-left", "3rem");
            fullDescriptionRow.css("padding-bottom", "10px");
            fullDescriptionRow.css("font-size", "14px");
            fullDescriptionRow.hide();
            fullDescriptionRow.appendTo(divWrapper);
        }
        return divWrapper;
    }

    slackPluginsAPI.loadCSSFile = function(filepart) {
        fs.readFile(homedir + "/" + ".slack" + "/" + filepart, {encoding: "utf-8"}, function(err, data) {
            if (!err) {
                var css = document.createElement("style");
                css.innerText = data;
                $(css).attr("filename", file);
                document.getElementsByTagName("head")[0].appendChild(css);
            }
        });
    };

    slackPluginsAPI.loadJSFile = function(filepart) {
        fs.readFile(homedir + "/" + ".slack" + "/" + filepart, {encoding: "utf-8"}, function(err, data) {
            if (!err) {
                data += "\n\n//# sourceURL=/slack-customizations/" + file;
                eval(data);
            }
        });
    };

    slackPluginsAPI.loadPlugins = function() {
        if ("true" === window.localStorage.getItem("slackPlugins_enable_plugins")) {
            for (var i = 0; i < window.slackPluginList.length; i++) {
                var plugin = window.slackPluginList[i];
                if ("true" === window.localStorage.getItem("slackPlugins_" + plugin.pluginName)) {
                    if (typeof plugin.loadFunction === "function") {
                        plugin.loadFunction();
                    }
                }
            }
        }
    };

    return slackPluginsAPI;
}(window));

window.slackPlugins.loadPlugins();
