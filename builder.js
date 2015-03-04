function setDescription(d) {
    chrome.tabs.executeScript(null, {file: 'content.js'}, function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tabId = tabs[0].id;
            chrome.tabs.sendMessage(tabId, {
                redmineNo: d.redmineNo,
                releaseSystem: d.releaseSystem,
                pmRequest: d.pmRequest,
                sourceSrc: d.sourceSrc
            });
        });
    });
}

chrome.contextMenus.create({"title": "buildNoteSelector", "onclick": function () {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.executeScript(tab.id, {file: 'picker.js'});
    });
}});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getLocalStorage") {
        sendResponse({status: localStorage[request.key]});
    }
});
