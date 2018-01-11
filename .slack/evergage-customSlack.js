// TODO: make emoticon search do substrings searches!!!
// TODO: Implement a proper ctrl+f find inline
// TODO: TS.stars.toggleStarForActiveModel()


// The "jump to" dialog (for opening new or existing conversations by name, type-completion)
Mousetrap.bind(['ctrl+n'], function() {
    TS.key_triggers.getFromCode(75).func();
});
// Get recent direct messages by name (type-completion)
Mousetrap.bind(['ctrl+e'], function() {
    TS.key_triggers.getFromCode(75).func();
    // TODO: I've made this the same as ctrl+n for now
    // TS.ui.im_browser.start();
});

// I've implemented some rudimentary event burst handling so that changing nodes isn't so damn laggy
// Go to previous (up) channel or message
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

var selectNodeTimeout = -1;
var newSelectedNode = null;

// Override close window command to instead of closing the whole program, close the current direct message or channel
// Note that a channel close is a channel leave
Mousetrap.bind(['ctrl+w'], function() {
    var selectedNodeId = window.TS.shared.legacyGetActiveModelOb().id;
    var selectedNode = getSelectedNode();
    var nodeToTest = selectedNode.prevAll("div:has(a)").first();
    if (nodeToTest.size() === 0) {
        nodeToTest = selectedNode.nextAll("div:has(a)").first();
    }
    if (nodeToTest.size() > 0) {
        openItemByNode(nodeToTest.find("a"));
        clearTimeout(selectNodeTimeout);
        selectNodeTimeout = -1;
        newSelectedNode = null;
    }
    window.TS.channels.leave(selectedNodeId);
    window.TS.ims.closeIm(selectedNodeId);
    window.TS.groups.leave(selectedNodeId);
    window.TS.mpims.closeMpim(selectedNodeId);
    return false;
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
