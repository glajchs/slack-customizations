window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "dpe8Pk3VmkgZihSJ",
    pluginName: "noLaggyScroll",
    pluginNameFriendly: "No Laggy Scroll",
    pluginDescriptionShort: "Disables the laggy animation for scrolling when using page+up/page+down",
    pluginDescriptionLong: "Disables the laggy animation for scrolling when using page+up/page+down",
    prereqsReady: function() {
        return typeof window.$ === "function";
    },
    loadFunction: function() {
        var scrollerDivSelector = ".message_pane_scroller .c-scrollbar__hider";
        var messageViewportSelector = ".c-virtual_list--scrollbar";
        // Make the pageup/pagedown not laggy, not sure why they think animations are cool
        // TODO: how do stupid laptops without pageup/pagedown work?  Is it a different keybind?
        $(document).bind("keydown.slackcustomizations", function(event) {
            if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                if (event.keyCode === 33) { // Page Up
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    var originalScrollTop = $(scrollerDivSelector).scrollTop();
                    $(scrollerDivSelector).scrollTop(originalScrollTop - $(messageViewportSelector).height());
                } else if (event.keyCode === 34) { // Page Down
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    var originalScrollTop = $(scrollerDivSelector).scrollTop();
                    $(scrollerDivSelector).scrollTop(originalScrollTop + $(messageViewportSelector).height());
                }
            }
        });
    }
});

