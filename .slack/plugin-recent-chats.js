window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "Tz8eHYqf7HUKZdjN",
    pluginName: "recentChats",
    pluginNameFriendly: "Recent Chats",
    pluginDescriptionShort: "See your recent chats, in the order that they were most recently accessed.",
    pluginDescriptionLong: "See your recent chats, in the order that they were most recently accessed.  This includes channels, chats, direct messages, and multi-person direct messages.  This also includes ones you have closed.",
    prereqsReady: function() {
        return (typeof window.TS === "object" && window.TS != null
                && window.TS.interop != null && window.TS.interop.ChannelSidebar != null
                && typeof window.TS.interop.ChannelSidebar.onItemSelect === "function");
    },
    loadFunction: function() {
        var channelHistory = [];
        var originalOnItemSelect = window.TS.interop.ChannelSidebar.onItemSelect;
        window.TS.interop.ChannelSidebar.onItemSelect = function() {
            if (arguments.length > 0 && typeof arguments[0] === "string") {
                var channelId = arguments[0];
                channelHistory.push(channelId);
                console.log(channelHistory);
            }
            originalOnItemSelect.apply(this, arguments);
        };

        // TS.templates.jumper_results
        // TS.model.frecency_jumper - this is the history of all the searches you've done

        // // TODO: TS.stars.toggleStarForActiveModel()
        //
        // // The "jump to" dialog (for opening new or existing conversations by name, type-completion)
        // // TODO: mac key binds should consider "cmd" instead of control.  Maybe use Mousetrap here?
        // Mousetrap.bind(['ctrl+n'], function() {
        //     TS.key_triggers.getFromCode(75).func();
        // });
        // // TODO: mac key binds should consider "cmd" instead of control.  Maybe use Mousetrap here?
        // Mousetrap.bind(['ctrl+e'], function() {
        //     TS.key_triggers.getFromCode(75).func();
        //     // TODO: I've made this the same as ctrl+n for now
        //     // TS.ui.im_browser.start();
        // });
    }
});
