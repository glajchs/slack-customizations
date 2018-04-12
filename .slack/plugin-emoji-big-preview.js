window.slackPluginList = window.slackPluginList || [];
window.slackPluginList.push({
    pluginId: "xKS7MAzFN8iMZUDv",
    pluginName: "emojiBigPreview",
    pluginNameFriendly: "Emoji Big Preview",
    pluginDescriptionShort: "Upon clicking an emoji (or alt-clicking for voting style emojis), show an enlarged preview of the image.",
    pluginDescriptionLong: "Upon clicking an emoji (or alt-clicking for voting style emojis), show an enlarged preview of the image.  This helps when emojis are too hard to see when they are small.  Note that Slack has a max width and height limit of 128px for emojis, as well as 64KB total size, so the enlarge image is probably still pretty poor quality.",
    loadFunction: function() {
        $(document).off("click.slackPluginsEmojiBigPreview");
        $(document).on("click.slackPluginsEmojiBigPreview", ".c-custom_status .emoji, .c-message__body .emoji, .c-custom_status .emoji-sizer, .c-reaction_bar .emoji-sizer", function(event) {
            // For emojis where they are the inline "voting" style emojis, only show the previews on alt clicks
            // TODO: mac keybindings
            if ($(event.target).closest(".c-reaction_bar .emoji-sizer").length > 0 && !event.altKey) {
                return;
            }
            var backgroundImage = $(event.target).css("background-image");
            var backgroundPosition = $(event.target).css("background-position");
            var backgroundSize = $(event.target).css("background-size");
            var emojiUrl = backgroundImage.split("(\"")[1].split("\")")[0];
            var imageBigBackdrop = $("<div></div>");
            imageBigBackdrop.addClass("slackPluginsEmojiLarge");
            imageBigBackdrop.css("position", "fixed");
            imageBigBackdrop.css("z-index", 2147483637);
            imageBigBackdrop.css("top", "0px");
            imageBigBackdrop.css("left", "0px");
            imageBigBackdrop.css("width", "100%");
            imageBigBackdrop.css("height", "100%");
            imageBigBackdrop.css("backgroundColor", "rgba(255, 255, 255, 0.2)");
            imageBigBackdrop.appendTo("body");
            var imageBigWrapper = $("<div></div>");
            imageBigWrapper.addClass("slackPluginsEmojiLarge");
            imageBigWrapper.css("position", "absolute");
            imageBigWrapper.css("z-index", 2147483638);
            imageBigWrapper.css("top", "50%");
            imageBigWrapper.css("left", "50%");
            imageBigWrapper.css("width", "88px");
            imageBigWrapper.appendTo(imageBigBackdrop);
            if (backgroundSize != "contain") {
                imageBigWrapper.css("height", "88px");
                imageBigWrapper.css("background-image", backgroundImage);
                imageBigWrapper.css("background-position", backgroundPosition);
                imageBigWrapper.css("background-size", backgroundSize);
            } else {
                var imageBig = $("<img></img>");
                imageBig.attr("src", emojiUrl);
                imageBig.css("width", "100%");
                imageBig.appendTo(imageBigWrapper);
            }

            $(document).unbind("click.slackPluginsEmojiLarge");
            $(document).unbind("keydown.slackPluginsEmojiLarge");
            $(document).bind("click.slackPluginsEmojiLarge", function(event) {
                // TODO: right-click detection might be different on macs, see if we can use Mousetrap here?
                if (event.button !== 2) {
                    $("div.slackPluginsEmojiLarge").remove();
                }
            });
            $(document).bind("keydown.slackPluginsEmojiLarge", function(event) {
                if (event.keyCode === 27) { // 27 == Escape key
                    $("div.slackPluginsEmojiLarge").remove();
                }
            });

            event.stopImmediatePropagation();
            event.preventDefault();
        });
    }
});

