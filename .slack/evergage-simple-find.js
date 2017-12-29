var findText = "";
var findResults = [];
var findResultsCounter = -1;

var css = document.createElement("style");
css.innerText = "span.simpleTextSearchHighlight {\n" +
                "    background-color: yellow;\n" +
                "    color: black;\n" +
                "}\n" +
                "\n" +
                "span.simpleTextSearchHighlight.selected {\n" +
                "    background-color: orange;\n" +
                "}\n" +
                "\n" +
                "#col_messages {\n" +
                "    margin-top: 8px;\n" +
                "}\n";
document.getElementsByTagName("head")[0].appendChild(css);

Mousetrap.bind(['esc'], function() {
    if ($("#simpleSearchBox").is(":visible")) {
        $("#simpleSearchBox").hide();
        window.resetExistingHighlightNodes();
    }
});

// Disable default ctrl+f
TS.key_triggers.getFromCode(70).func = function() {};
// TS.prefs.setPrefLocal("f_key_search", true);
// Mousetrap.unbind(['ctrl+f']);

Mousetrap.bind(['ctrl+d', 'ctrl+f'], function() {
    var existingSearchBox = $("#simpleSearchBox");
    if (existingSearchBox.size() > 0) {
        $("#simpleSearchBox").show();
    } else {
        var searchBox = $("<div></div>");
        searchBox.attr("id", "simpleSearchBox");
        searchBox.css({
            position: "absolute",
            top: "10px",
            right: "20px",
            "z-index": "4000"
        });
        var textSearchNode = $("<input></input>");
        textSearchNode.attr("type", "text");
        textSearchNode.attr("placeholder", "Find in chat...");
        textSearchNode.addClass("simpleTextSearchInputNode");
        textSearchNode.css({
            "font-size": "0.85rem",
            padding: ".40rem",
            "margin-bottom": "0px",
            width: "200px",
            "padding-right": "80px"
        });
        textSearchNode.appendTo(searchBox);
        $(textSearchNode).keyup(function (event) {
            if (event.keyCode == 13) {
                var newFindText = this.value;
                if (event.ctrlKey) {
                    TS.client.ui.doLoadScrollBackHistory(true);
                    return;
                }
                if (newFindText == null || newFindText === "") {
                    clearSimpleFind();
                    return;
                }
                if (event.shiftKey) {
                    if (newFindText === findText) {
                        goToPreviousFindResult();
                    } else {
                        goToNewFindResult(newFindText);
                    }
                } else {
                    if (newFindText === findText) {
                        goToNextFindResult();
                    } else {
                        goToNewFindResult(newFindText);
                    }
                }
            }
        });
        var findCounterNode = $("<div></div>");
        findCounterNode.addClass("findCounter");
        findCounterNode.css({
            display: "inline-block",
            height: "100%",
            "font-size": "0.85rem",
            padding: ".40rem",
            position: "absolute",
            top: "1px",
            right: "0px",
            color: "#a3a3a3",
            width: "70px"
        });
        findCounterNode.appendTo(searchBox);
        setFindCounterText("| 0/0");
        searchBox.prependTo("#client_header");
    }

    var inputNode = $("#simpleSearchBox .simpleTextSearchInputNode");
    inputNode.focus();
    inputNode[0].setSelectionRange(0, inputNode[0].value.length)
});

function clearSimpleFind() {
    findResultsCounter = -1;
    findResults = [];
    findText = "";
    setFindCounterText();
}

function setFindCounterText() {
    var findCounterNode = $("#simpleSearchBox .findCounter");
    findCounterNode.text("| " + (findResultsCounter + 1) + "/" + findResults.length);
}

function isElementVisible(element) {
    var rect = element.getBoundingClientRect(), top = rect.top, height = rect.height,
            element = element.parentNode;
    do {
        rect = element.getBoundingClientRect();
        if ((top <= rect.bottom) === false) return false;
        // Check if the element is out of view due to a container scrolling
        if ((top + height) <= rect.top) return false;
        element = element.parentNode;
    } while (element != document.body);
    // Check its within the document viewport
    return top <= document.documentElement.clientHeight;
}

function scrollToItem() {
    $(findResults).removeClass("selected");
    $(findResults[findResultsCounter]).addClass("selected");
    var elementTop = $(findResults[findResultsCounter]).parents("ts-message").position().top
                     + $(findResults[findResultsCounter]).position().top;
    // findResults[findResultsCounter].scrollIntoView();
    var dayMessagesPreviousSiblings = $(findResults[findResultsCounter]).parents("ts-message").parents(".day_msgs").prevAll();
    for (var i = 0; i < dayMessagesPreviousSiblings.length; i++) {
        elementTop += $(dayMessagesPreviousSiblings[i]).height();
    }
    var dayContainerPreviousSiblings = $(findResults[findResultsCounter]).parents("ts-message").parents(".day_container").prevAll();
    for (var i = 0; i < dayContainerPreviousSiblings.length; i++) {
        elementTop += $(dayContainerPreviousSiblings[i]).height();
    }
    var messagesDivPreviousSiblings = $(findResults[findResultsCounter]).parents("ts-message").parents("#msgs_div").prevAll();
    for (var i = 0; i < messagesDivPreviousSiblings.length; i++) {
        elementTop += $(messagesDivPreviousSiblings[i]).height();
    }
    var scrollAreaHeightToSubtract = Math.round($("#msgs_scroller_div").height() / 2);
    if (!isElementVisible($(findResults[findResultsCounter])[0])) {
        $("#msgs_scroller_div").scrollTop(elementTop - scrollAreaHeightToSubtract);
    }
}

function goToNextFindResult() {
    // findResults = $(".day_msgs").find("ts-message:contains(\"" + findText + "\")");
    findMatchingTextNodes();
    highlightFindings();
    if (findResults.length > 0) {
        findResultsCounter++;
        if (findResultsCounter > findResults.length - 1) {
            findResultsCounter = 0;
        }
        scrollToItem();
    }
    setFindCounterText();
}

function goToPreviousFindResult() {
    findMatchingTextNodes();
    highlightFindings();
    if (findResults.length > 0) {
        findResultsCounter--;
        if (findResultsCounter < 0) {
            findResultsCounter = findResults.size() - 1;
        }
        scrollToItem();
    }
    setFindCounterText();
}

function goToNewFindResult(newFindText) {
    findText = newFindText;
    findResultsCounter = -1;
    findMatchingTextNodes();
    highlightFindings();
    if (findResults.length > 0) {
        findResultsCounter = 0;
        scrollToItem();
    }
    setFindCounterText();
}

function highlightFindings() {
    for (var i = 0; i < findResults.length; i++) {
        var findResult = findResults[i];

    }
}

function resetExistingHighlightNodes() {
    var existingNodes = $(".simpleTextSearchHighlight");
    for (var i = 0; i < existingNodes.length; i++) {
        var existingNode = existingNodes[i];
        var parentContents = $(existingNode).parent().contents();
        var parentExistingIndex = -1;
        for (var j = 0; j < parentContents.length; j++) {
            if (parentContents[j] === existingNode) {
                parentExistingIndex = j;
            }
        }
        var beforeTextNode = null;
        var afterTextNode = null;
        var newTextString = "";
        if (parentExistingIndex > 0 && parentContents[parentExistingIndex - 1].nodeType === 3) {
            beforeTextNode = parentContents[parentExistingIndex - 1];
            newTextString = beforeTextNode.textContent + newTextString;
            beforeTextNode.parentNode.removeChild(beforeTextNode);
        }
        newTextString += existingNode.textContent;
        if (parentExistingIndex + 1 < parentContents.length && parentContents[parentExistingIndex - 1].nodeType === 3) {
            afterTextNode = parentContents[parentExistingIndex + 1];
            newTextString += afterTextNode.textContent;
            afterTextNode.parentNode.removeChild(afterTextNode);
        }
        var newTextNode = document.createTextNode(newTextString);
        $(existingNode).before($(newTextNode));
        existingNode.parentNode.removeChild(existingNode);
    }
    findResults = $();
}
window.resetExistingHighlightNodes = resetExistingHighlightNodes;

function findMatchingTextNodes() {
    resetExistingHighlightNodes();
    var textNodes = $(".day_msgs").find(":not(iframe, script, style)").contents().filter(function() {
        return this.nodeType == 3 && this.textContent.indexOf(findText) > -1;
    });
    for (var i = 0; i < textNodes.length; i++) {
        var textNode = textNodes[i];
        var textContent = textNode.textContent;
        if (textContent !== findText || !$(textNode).parent().hasClass("simpleTextSearchHighlight")) {
            var startingIndex = textContent.indexOf(findText);
            var beforeTextNode = document.createTextNode(textNode.textContent.substring(0, startingIndex));
            var afterTextNode = document.createTextNode(textNode.textContent.substring(startingIndex + findText.length));
            var wrapperFoundTextNode = $("<span></span>");
            wrapperFoundTextNode.addClass("simpleTextSearchHighlight");
            wrapperFoundTextNode[0].textContent = findText;
            $(textNode).before($(beforeTextNode));
            $(textNode).after($(afterTextNode));
            $(textNode).before(wrapperFoundTextNode);
            textNode.parentNode.removeChild(textNode);

            findResults.push(wrapperFoundTextNode[0]
                    // {
                    //     textNode: textNode,
                    //     parentNode: $(textNode).parent()
                    // }
            );
        }
    }
}