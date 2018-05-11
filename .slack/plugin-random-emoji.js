window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "9yKGJx0o0Fixz4t0",
    pluginName: "randomEmoji",
    pluginNameFriendly: "Random Emoji",
    pluginDescriptionShort: "Inserts a random \"I'm Feeling Lucky\" section of emoji right below the \"Frequently Used\" section at the top.",
    pluginDescriptionLong: "Inserts a random \"I'm Feeling Lucky\" section of emoji right below the \"Frequently Used\" section at the top.\nThis section changes every time you open the dialog.",
    prereqsReady: function() {
        return (typeof window.Mousetrap === "function"
                    && typeof window.TS === "object"
                    && window.TS != null
                    && typeof window.TS.emoji === "object"
                    && typeof window.TS.emoji.makeMenuLists === "function");
    },
    loadFunction: function() {
        // TODO: make emoticon search do substring searches as well!!!

        // By default, the emoji window is hard coded to be wide enough for 9 columns via explicity width: 361px;
        // But since width: auto renders fine too, we'll just override it
        var css = document.createElement("style");
        css.classList.add("plugin-random-emoji");
        css.innerText = ".menu.p-emoji_picker {\n" +
                "    width: auto;\n" +
                "}\n";
        document.getElementsByTagName("head")[0].appendChild(css);

        if (window.oldMakeMenuLists_custom == null) {
            window.oldMakeMenuLists_custom = window.TS.emoji.makeMenuLists;
        }
        window.TS.emoji.makeMenuLists = function() {
            window.oldMakeMenuLists_custom.call(this);
            // All icons, that aren't skins, uniqued
            var allIcons = _.filter(_.uniqBy(_.flatten(_.map(TS.model.emoji_groups, "items")), "name"), function(item) { return !item.is_skin; });
            var randomIndexes = [];
            while (randomIndexes.length < 27) {
                var randomIndex = Math.floor(Math.random() * 10000) % allIcons.length;
                if (randomIndexes.indexOf(randomIndex) === -1) {
                    randomIndexes.push(randomIndex);
                }
            }
            var randomIcons = [];
            for (var i = 0; i < randomIndexes.length; i++) {
                randomIcons.push(allIcons[randomIndexes[i]]);
            }
            var randomGroup = {
                name: "random",
                display_name: "I'm Feeling Lucky",
                // I'd prefer a dice icon, but font-awesome doesn't
                tab_icon_name: "random",
                tab_icon: "ts_icon_random",
                tab_html: "<span class=\"emoji-sizer\"><i class=\"ts_icon ts_icon_random\"></i></span>",
                items: randomIcons
            };
            // 1 means after the 1st element (after frequently used).  Consider making this configurable later
            TS.model.emoji_groups.splice(1, 0, randomGroup);
        };

        // This is kind of a hack to get the randomization to run on every time the emoji window pops up.
        // This will actually get run on every open and close, but it's not a huge resource hog, so that's fine for now
        window.oldMountEmojiPicker = TS.interop.mountEmojiPicker;
        TS.interop.mountEmojiPicker = function(t, n, r, o) {
            window.TS.emoji.makeMenuLists();
            window.oldMountEmojiPicker.call(this, t, n, r, o);
        };
    }
});



