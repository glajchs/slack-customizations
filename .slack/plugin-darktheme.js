window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "Dfcl1aKM5G8LCWIG",
    pluginName: "darktheme",
    pluginNameFriendly: "Dark Theme",
    pluginDescriptionShort: "A Dark Theme for Slack based on laCour's slack-night-theme",
    pluginDescriptionLong: "A Dark Theme for Slack based on laCour's slack-night-theme",
    loadFunction: function() {
        window.slackPlugins.loadCSSFile("black.css");
        if (_.filter(window.slackPluginList, function(value) {
                    return value.pluginName === "reactionsHoverPosition";
                }).length > 0 &&
                ("true" === window.localStorage.getItem("slackPlugins_" + "reactionsHoverPosition"))) {
            window.slackPlugins.loadCSSFile("black-message-separator-lines.css");
        }
        // TODO: how do I do leftnav stuff now?
        // window.slackPlugins.loadLeftNavCSSFile("black-leftnav.css");
    }
});

