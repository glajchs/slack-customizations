// Note this module is still a little bit of a work in progress.
// It still needs work when the content is refreshed by way of loading new pages
// It still needs to work better when going between different conversations with the find window open
// But it's already so much better than the built-in find that I'm going to release it as not in progress as I keep finishing it out

var findText = "";
var findResults = window.findResults = [];
var findResultsCounter = -1;
var findResultsExceeded = false;
var isKeyRepeatMode = false;
var isKeyAlreadyDown = false;

var scrollerDivSelector = ".message_pane_scroller .c-scrollbar__hider";
var messageViewportSelector = ".c-virtual_list--scrollbar";

// Make the pageup/pagedown not laggy, not sure why they think animations are cool
$(".client_main_container").bind("keydown.slackcustomizations", function(event) {
    if (!event.ctrlKey && !event.shiftKey && !event.altKey) { // Page Up
        if (event.keyCode === 33) {
            event.preventDefault();
            event.stopImmediatePropagation();
            var originalScrollTop = $(scrollerDivSelector).scrollTop();
            $(scrollerDivSelector).scrollTop(originalScrollTop - $(messageViewportSelector).height());
        } else if (event.keyCode === 34) {
            event.preventDefault();
            event.stopImmediatePropagation();
            var originalScrollTop = $(scrollerDivSelector).scrollTop();
            $(scrollerDivSelector).scrollTop(originalScrollTop + $(messageViewportSelector).height());
        }
    }
});

var css = document.createElement("style");
css.classList.add("evergage-simple-find");
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

// Bind ctrl+shift+f and ctrl+shift+d to old school slack find.  Must be bound on keydown to happen in time
Mousetrap.bind(['ctrl+shift+d'], window.originalFindFunction);
$(document).bind("keydown", function(event) {
    // 70 === f
    if (event.keyCode === 70 && event.shiftKey && event.ctrlKey) {
        originalFindFunction();
        event.preventDefault();
    }
});

// Disable default ctrl+f
window.originalFindFunction = TS.key_triggers.getFromCode(70).func;
TS.key_triggers.getFromCode(70).func = function() {};


Mousetrap.bind(['ctrl+d', 'ctrl+f'], handleFindToggle);

function handleFindToggle() {
    var existingSearchBox = $("#simpleSearchBox");
    if (existingSearchBox.length > 0) {
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
            isKeyRepeatMode = false;
            var newFindText = this.value;
            if (newFindText == null || newFindText === "") {
                clearSimpleFind();
                return;
            }
            if (newFindText !== findText || (event.keyCode === 13 && event.ctrlKey)) {
                goToNewFindResult(newFindText);
                return;
            }
        });
        $(textSearchNode).keydown(function (event) {
            if (event.keyCode === 13) {
                if (isKeyAlreadyDown) {
                    isKeyRepeatMode = true;
                }
                isKeyAlreadyDown = true;
                if (event.ctrlKey) {
                    var originalScrollTop = $(scrollerDivSelector).scrollTop();
                    var originalOuterHeight = $(scrollerDivSelector).outerHeight();
                    $(scrollerDivSelector).scrollTop(0);
                    requestAnimationFrame(function() {
                        var heightDifference = $(scrollerDivSelector).outerHeight() - originalOuterHeight;
                        $(scrollerDivSelector).scrollTop(originalScrollTop + heightDifference);
                    });
                    return;
                }
                if (event.shiftKey) {
                    if (isKeyRepeatMode) {
                        goToPreviousFindResult();
                    } else {
                        resetAndGoToPreviousFindResult();
                    }
                } else {
                    if (isKeyRepeatMode) {
                        goToNextFindResult();
                    } else {
                        resetAndGoToNextFindResult();
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
            width: "80px"
        });
        findCounterNode.appendTo(searchBox);
        setFindCounterText("| 0/0");
        searchBox.prependTo("#client_header");
    }

    var inputNode = $("#simpleSearchBox .simpleTextSearchInputNode");
    inputNode.focus();
    inputNode[0].setSelectionRange(0, inputNode[0].value.length)
}

function clearSimpleFind() {
    resetExistingHighlightNodes();
    findResultsCounter = -1;
    findText = "";
    setFindCounterText();
}

function setFindCounterText() {
    var findCounterNode = $("#simpleSearchBox .findCounter");
    findCounterNode.text("| " + (findResultsCounter + 1) + "/" + findResults.length + (findResultsExceeded ? "+" : ""));
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
    if (!isElementVisible($(findResults[findResultsCounter])[0])) {
        $(scrollerDivSelector).scrollTop(determineScrollTopForItem(findResultsCounter));
    }
}

function determineScrollTopForItem(itemCounter) {
    var elementTop = $(findResults[itemCounter]).parents(".c-message").parent().position().top
                     + $(findResults[itemCounter]).position().top;
    var scrollAreaHeightToSubtract = Math.round($(messageViewportSelector).height() / 2);
    // Don't allow you to scroll to/past the "load more history" section, otherwise scrolling to the top will automatically
    // load another frame of results, which aside from being bad, is also very laggy
    return Math.max(elementTop - scrollAreaHeightToSubtract, $(".p-degraded_list__loading").outerHeight());
}

function resetFindNodes() {
    findMatchingTextNodes();
}

function resetAndGoToNextFindResult() {
    resetFindNodes();
}

function goToNextFindResult() {
    if (findResults.length > 0) {
        findResultsCounter++;
        if (findResultsCounter > findResults.length - 1) {
            findResultsCounter = 0;
        }
    }
    activateFindResult();
}

function activateFindResult() {
    if (findResults.length > 0) {
        scrollToItem();
    }
    setFindCounterText();
}

function resetAndGoToPreviousFindResult() {
    resetFindNodes();
}

function goToPreviousFindResult() {
    if (findResults.length > 0) {
        findResultsCounter--;
        if (findResultsCounter < 0) {
            findResultsCounter = findResults.length - 1;
        }
    }
    activateFindResult();
}

function goToNewFindResult(newFindText) {
    findText = newFindText;
    findResultsCounter = -1;
    resetFindNodes();
    if (findResults.length > 0) {
        findResultsCounter = 0;
        for (var i = 0; i < findResults.length; i++) {
            if (isElementVisible(findResults[i])) {
                findResultsCounter = i;
                break;
            } else if (determineScrollTopForItem(i) >= $(scrollerDivSelector).scrollTop()) {
                findResultsCounter = i;
                break;
            }
        }
        scrollToItem();
    }
    setFindCounterText();
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
    findResults = window.findResults = [];
}
window.resetExistingHighlightNodes = resetExistingHighlightNodes;

function findMatchingTextNodes() {
    resetExistingHighlightNodes();
    // This still doesn't work on anything more than your current viewport, as they are now removing DOM elements
    // as you scroll up and down!! (which is making for *very* buggy scrolling).  I'm not sure what would posses them to do this.
    var textNodes = $(".c-virtual_list__scroll_container").find(":not(iframe, script, style)").contents().filter(function() {
        return this.nodeType === 3 && this.textContent.toLowerCase().indexOf(findText.toLowerCase()) > -1 && $(this).parent().is(":visible");
    });
    findResultsExceeded = false;
    for (var i = textNodes.length - 1; i >= 0; i--) {
        if (findResults.length >= 100) {
            findResultsExceeded = true;
            break;
        }
        var textNode = textNodes[i];
        var textContent = textNode.textContent;
        if (textContent !== findText || !$(textNode).parent().hasClass("simpleTextSearchHighlight")) {
            var startingIndex = textContent.toLowerCase().indexOf(findText.toLowerCase());
            var beforeTextNode = document.createTextNode(textContent.substring(0, startingIndex));
            var foundTextWithOriginalCasing = textContent.substr(startingIndex, findText.length); // Substr is different than substring with arguments /facepalm
            var afterTextNode = document.createTextNode(textContent.substring(startingIndex + findText.length));
            var wrapperFoundTextNode = $("<span></span>");
            wrapperFoundTextNode.addClass("simpleTextSearchHighlight");
            wrapperFoundTextNode[0].textContent = foundTextWithOriginalCasing;
            $(textNode).before($(beforeTextNode));
            $(textNode).after($(afterTextNode));
            $(textNode).before(wrapperFoundTextNode);
            textNode.parentNode.removeChild(textNode);

            findResults.unshift(wrapperFoundTextNode[0]);
        }
    }
}