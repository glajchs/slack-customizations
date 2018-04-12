window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "LJnZ7nIj9NdExbBl",
    pluginName: "keybindNewChat",
    pluginNameFriendly: "Keybind - New/Open Chat",
    pluginDescriptionShort: "Adds/changes the keybinds for new/open chat to be ctrl+n and ctrl+e, and makes them both be the same function.",
    pluginDescriptionLong: "Adds/changes the keybinds for new/open chat to be ctrl+n and ctrl+e, and makes them both be the same function.",
    loadFunction: function() {
        // TODO: TS.stars.toggleStarForActiveModel()

        // TODO: figure out when to do this programatically, instead of using intervals
        var mousetrapIntervalMaxTries = 100;
        var mousetrapIntervalCounter = 0;
        var mousetrapInitializedInterval = setInterval(function() {
            try {
                mousetrapIntervalCounter++;
                if (mousetrapIntervalCounter > mousetrapIntervalMaxTries) {
                    clearInterval(mousetrapInitializedInterval);
                    return;
                }
                if (typeof window.Mousetrap === "function") {
                    initializeMousetrap();
                    clearInterval(mousetrapInitializedInterval);
                }
            } catch (exception) {
                // no-op
            }
        }, 100);

        function initializeMousetrap() {
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
    }
});
