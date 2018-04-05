window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "LQR4rUtwc9gG29br",
    pluginName: "reactionsHoverPosition",
    pluginNameFriendly: "Reactions Hover Position",
    pluginDescriptionShort: "Reposition the message reactions (emoji/share) row to be inline with the row instead of staggered.",
    pluginDescriptionLong: "Reposition the message reactions (emoji/share) row to be inline with the row instead of staggered.",
    loadFunction: function() {
        window.slackPlugins.loadCSSFile("message-reactions-hover-positioning.css");
        // TODO: put a time limit to the hover, and/or put mousedown protection for the hover
    }
});

