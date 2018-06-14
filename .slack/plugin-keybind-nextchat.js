window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "Bo8i9wji7Qomvokt",
    pluginName: "keybindNextchat",
    pluginNameFriendly: "Keybind - Next/Prev Chat",
    pluginDescriptionShort: "Adds ctrl+pageup/ctrl+pagedown keybinds to go to the next/previous chats.",
    pluginDescriptionLong: "Adds ctrl+pageup/ctrl+pagedown keybinds to go to the next/previous chats.",
    prereqsReady: function() {
        return (typeof window.Mousetrap === "function" && typeof window.TS === "object" && window.TS != null && typeof window.$ === "function");
    },
    loadFunction: function() {
        var selectNodeTimeout = -1;
        var newSelectedNode = null;

        // I've implemented some rudimentary event burst handling so that changing nodes isn't so damn laggy
        // Go to previous (up) channel or message
        // TODO: mac key binds should consider "cmd" instead of control.  Maybe use Mousetrap here?
        Mousetrap.bind(['ctrl+pageup'], function() {
            var selectedNode = getSelectedNode();
            if (selectNodeTimeout !== -1) {
                selectedNode = newSelectedNode;
            }
            var nodeToTest = selectedNode.prevAll("div:has(a)").first();
            if (nodeToTest.size() === 0) {
                return;
            }
            newSelectedNode = nodeToTest;
            newSelectedNode[0].scrollIntoViewIfNeeded();
            selectedNode.find("a").removeClass("p-channel_sidebar__channel--selected");
            newSelectedNode.find("a").addClass("p-channel_sidebar__channel--selected");
            clearTimeout(selectNodeTimeout);
            selectNodeTimeout = setTimeout(function() {
                openItemByNode(newSelectedNode.find("a"));
                selectNodeTimeout = -1;
                newSelectedNode = null;
            }, 250);
        });
        // Go to next (down) channel or message
        // TODO: mac key binds should consider "cmd" instead of control.  Maybe use Mousetrap here?
        Mousetrap.bind(['ctrl+pagedown'], function() {
            var selectedNode = getSelectedNode();
            if (selectNodeTimeout !== -1) {
                selectedNode = newSelectedNode;
            }
            var nodeToTest = selectedNode.nextAll("div:has(a)").first();
            if (nodeToTest.size() === 0) {
                return;
            }
            newSelectedNode = nodeToTest;
            newSelectedNode[0].scrollIntoViewIfNeeded();
            selectedNode.find("a").removeClass("p-channel_sidebar__channel--selected");
            newSelectedNode.find("a").addClass("p-channel_sidebar__channel--selected");
            clearTimeout(selectNodeTimeout);
            selectNodeTimeout = setTimeout(function() {
                openItemByNode(newSelectedNode.find("a"));
                selectNodeTimeout = -1;
                newSelectedNode = null;
            }, 250);
        });

        /* General Utility Functions */

        function openItemByNode(node) {
            var type = node.attr("data-qa-channel-sidebar-channel-type");
            var id = node.attr("data-qa-channel-sidebar-channel-id");
            if (type === "im") {
                TS.ims.legacyDisplayIm(id);
            } else if (type === "channel") {
                TS.channels.legacyDisplayChannel({id: id});
            } else if (type === "private") {
                TS.groups.legacyDisplayGroup({id: id});
            } else if (type === "mpim") {
                TS.mpims.legacyDisplayMpim({id: id});
            }
        }

        function getSelectedNode() {
            var selectedId = $("[data-qa-channel-sidebar-selected-item-id]").attr("data-qa-channel-sidebar-selected-item-id");
            var selectedNode = $("[data-qa-channel-sidebar-channel-id=" + selectedId + "]").parent();
            if (selectedNode.hasClass("p-channel_sidebar__close_container")) {
                selectedNode = selectedNode.parent();
            }
            return selectedNode;
        }
    }
});

