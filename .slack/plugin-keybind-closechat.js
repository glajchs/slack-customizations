window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "ZOx9uk3duEfcsiA7",
    pluginName: "keybindClosechat",
    pluginNameFriendly: "Keybind - Close Chat",
    pluginDescriptionShort: "Adds ctrl+w keybind to close the current chat window.",
    pluginDescriptionLong: "Adds ctrl+w keybind to close the current chat window.\nNote that closing multiple direct messages (mpims) as well as channels leaves them.  For channels you need to re-join (open), but for mpims, you need a re-invite to join.",
    loadFunction: function() {
        $("body").bind("keydown.slackcustomizations", function(event) {
            if (event.ctrlKey && event.keyCode === 87) { // 87 == "w"
                event.preventDefault();
                event.stopImmediatePropagation();
                closeCurrentChat();
            }
        });

        function closeCurrentChat() {
            var selectedNodeId = window.TS.shared.legacyGetActiveModelOb().id;
            var selectedNode = getSelectedNode();
            var nodeToTest = selectedNode.prevAll("div:has(a)").first();
            if (nodeToTest.size() === 0) {
                nodeToTest = selectedNode.nextAll("div:has(a)").first();
            }
            if (nodeToTest.size() > 0) {
                openItemByNode(nodeToTest.find("a"));
                // TODO: Only do this if the other plugin is enabled.
                // clearTimeout(selectNodeTimeout);
                // selectNodeTimeout = -1;
                // newSelectedNode = null;
            }
            TS.ms.msg_handlers.im_close({channel: selectedNodeId});
            TS.ms.msg_handlers.mpim_close({channel: selectedNodeId});
            TS.ms.msg_handlers.group_close({channel: selectedNodeId});
            TS.channels.leave(selectedNodeId);
            return false;
        }

        /* General Utility Functions */

        function openItemByNode(node) {
            var type = node.attr("data-qa-channel-sidebar-channel-type");
            var id = node.attr("data-qa-channel-sidebar-channel-id");
            if (type === "im") {
                TS.ims.legacyDisplayIm(id);
            } else if (type === "channel") {
                TS.channels.legacyDisplayChannel({id: id});
            } else if (type === "private") {
                TS.groups.displayGroup({id: id});
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

