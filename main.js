// Init
let idList = [];
let chatDiv = $("div.chat-list__lines > div.simplebar-scroll-content > div > div");

function init() {
    console.log("init");
    chatDiv = $("div.chat-list__lines > div.simplebar-scroll-content > div > div");
    if(chatDiv.length == 0) {
        setTimeout(function() {
            init();
        }, 1000);
    } else {
        chatDiv.bind("DOMNodeInserted", highlight);
    }
}

init();

// Url Move Handle
let prevUrl = $(location).attr('href');
function handleUrlChange() {
    const url = $(location).attr('href');
    if(prevUrl != url) {
        prevUrl = url;
        init();
    }
}

setInterval(handleUrlChange, 1000);

// Highlighting
function highlight() {
    var added = chatDiv.children().last();
    if(idList.includes(added.find("button > span").children().first().attr("data-a-user"))) {
        added.css("font-size", "18px");
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.idList) {
        idList = request.idList;
    }
});
