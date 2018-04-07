window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "LJnZ7nIj9NdExbBl",
    pluginName: "keybindNewChat",
    pluginNameFriendly: "Keybind - New/Open Chat",
    pluginDescriptionShort: "Adds/changes the keybinds for new/open chat to be ctrl+n and ctrl+e, and makes them both be the same function.",
    pluginDescriptionLong: "Adds/changes the keybinds for new/open chat to be ctrl+n and ctrl+e, and makes them both be the same function.",
    loadFunction: function() {
        // TODO: TS.stars.toggleStarForActiveModel()

        // The "jump to" dialog (for opening new or existing conversations by name, type-completion)
        // TODO: mac key binds should consider "cmd" instead of control.  Maybe use Mousetrap here?
        Mousetrap.bind(['ctrl+n'], function() {
            TS.key_triggers.getFromCode(75).func();
        });
        // TODO: mac key binds should consider "cmd" instead of control.  Maybe use Mousetrap here?
        Mousetrap.bind(['ctrl+e'], function() {
            TS.key_triggers.getFromCode(75).func();
            // TODO: I've made this the same as ctrl+n for now
            // TS.ui.im_browser.start();
        });
    }
});
