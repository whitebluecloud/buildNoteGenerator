function setDescription(d){
	chrome.tabs.executeScript(null, {file: 'content.js'}, function(){
		chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
		    var tabId = tabs[0].id;
			chrome.tabs.sendMessage(tabId, {
			                                    redmineNo : d.redmineNo,
												releaseSystem : d.releaseSystem,
												pmRequest : d.pmRequest,
												sourceSrc : d.sourceSrc
											});
		});
	});
//chrome.runtime.sendMessage({gretting:"aaa"}, function(res){console.log(res);});
	//chrome.tabs.executeScript(null, {file: 'content.js'});
	//chrome.runtime.onMessage.addListener(function(message) {
	//	d(message);
	//});
	//chrome.tabs.executeScript(null, {file: 'content.js'});
}

function pick(){
	chrome.tabs.executeScript(null, {file: 'picker.js'}, function(){
		chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
		    var tabId = tabs[0].id;
			chrome.tabs.sendMessage(tabId, {"1":"1"});
		});
	});	
};

chrome.tabs.getSelected(null, function(tab){
	chrome.contextMenus.create({"title": "buildNoteSelector", "id":tab.id.toString()}, function() {
	  if (chrome.extension.lastError) {
		console.log("Got expected error: " + chrome.extension.lastError.message);
	  }
	});
	chrome.contextMenus.onClicked.addListener(function() {
		pick();
		if (chrome.extension.lastError) {
		console.log("Got expected error: " + chrome.extension.lastError.message);
		}
	});	
});


