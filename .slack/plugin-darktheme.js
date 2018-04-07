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
                window.slackPlugins.isPluginEnabled("reactionsHoverPosition")) {
            window.slackPlugins.loadCSSFile("black-message-separator-lines.css");
        }
    },
    loadLeftNavFunction: function() {
        window.slackPlugins.loadCSSFile("black-leftnav.css");
    }
});

