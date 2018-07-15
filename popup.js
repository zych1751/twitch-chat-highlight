// Execute main.js
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: 'thirdParty/jquery-3.3.1.min.js'}, function() {
        console.log("jquery loaded");
    });
});

// About idList
let idList = [];
let listOpened = false;

$(document).ready(function() {
    chrome.storage.sync.get('idList', function(result) {
        if(jQuery.isEmptyObject(result)) {
            idList = [];
        } else {
            idList = result.idList;
        }
    });

    $("#list-open").click(listOpen);

    $("#add-button").click(addId);
});

function deleteId(id) {
    const index = idList.indexOf(id);
    if(index == -1)
        return;

    idList.splice(index, 1);
    chrome.storage.sync.set({'idList': idList}, function(result) {
        listOpen();
        listOpen();
    });
}

// Add Twitch Id
function addId() {
    const input = $("input.add-id-input").val();
    if(input.length == 0)
        return;

    $("input.add-id-input").val("");

    if(idList.includes(input))
        return;

    idList.push(input);
    chrome.storage.sync.set({'idList': idList}, function(result) {
        listOpen();
        listOpen();
    });
}

// Added Twitch Id List Open
function listOpen() {
    let listContainer = $("#list-container");
    const button = $("#list-open");

    if(listOpened) {
        listContainer.empty();
        button.attr("class", "fas fa-angle-right");
    }
    else {
        for(var i in idList) {
            const id = idList[i];
            // onclick in html tag is not recommended
            listContainer.append("<li class='id-list-item'>" + id + " " +
                "<i class='fas fa-times delete-button'></i></li>");
            listContainer.children().last().children().last().click(function() {
                deleteId(id);
            });
        }
        button.attr("class", "fas fa-angle-down");
    }
    listOpened = !listOpened;
}

// Send IdList Change Message
const applyButton = document.getElementById('apply-button');
applyButton.onclick = function(element) {
    chrome.storage.sync.get('idList', function(result) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {idList: idList}, function(response) {
            });
        });
    });
};

const cancelButton = document.getElementById('cancel-button');
cancelButton.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {idList: []}, function(response) {
        });
    });
};
