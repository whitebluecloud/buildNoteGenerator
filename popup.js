// onLoad
window.addEventListener('load', function(evt) {
	// redmine 작성탭 띄우기
	chrome.tabs.getSelected(null, function(tab) {
		var tabUrl = tab.url;
		var redmineWriteURL = "http://redmine.ssgadm.com/redmine/projects/project-0103/issues/new";
		if(tab.url != redmineWriteURL) {
			chrome.tabs.create({ url: redmineWriteURL })
		};
	});
	
	// 로컬스토리지
	var ls = localStorage;
	
	// 레드마인번호
	var redmineNo = ls.getItem("no");
	if(redmineNo != null) {
		document.getElementById('redmine_no').value = redmineNo;
	}
	
	// 배포시스템
	var r = ls.getItem("releaseSystem");
	if(r != null) {
		rs = r.split(',');
		if(rs.length != 0) {	
			var checkBoxes = document.querySelectorAll('input[type=checkbox]');
			
			for(var i=0; i<rs.length; i++) {
				for(var j=0; j<checkBoxes.length; j++) {
					if(rs[i] == checkBoxes[j].id){
						document.getElementById(checkBoxes[j].id).checked = true;
					}
				}
			}
		}
	}
	
	// 기획자
	var pr = ls.getItem("pmRequest");
	if(pr != null) {
		document.getElementById("pmRequest").value = pr;
	}
	
	// 소스파일경로
	var ss = ls.getItem("sourceSrc");
	if(ss != null) {
		document.getElementById("sourceSrc").value = ss;
	}
	
	//
	
});

function onPageDetailsReceived()  { 
    document.getElementById('release').value = pageDetails.release; 
};

// 레드마인번호 엔터 입력시
document.getElementById('redmine_no').onkeyup = function(e) {
	if(e.keyCode == '13') {
		createDescription();
	}
};

// 확인버튼 클릭시
document.getElementById('confirmBtn').addEventListener('click', function(evt){
	createDescription();
});

function createDescription() {
	chrome.runtime.getBackgroundPage(function(eventPage) {
		var releaseSystem = getReleaseSystem();
		var pmRequest = getTextArea("pmRequest");
		var sourceSrc = getTextArea("sourceSrc");

		eventPage.setDescription({
		                    "redmineNo" : document.getElementById('redmine_no').value
		                   ,"releaseSystem" : releaseSystem
						   ,"pmRequest" : pmRequest
						   ,"sourceSrc" : sourceSrc
							});
    });
}

// 선택하기 버튼 클릭시
document.getElementById('pickBtn').addEventListener('click', function(evt){
	chrome.runtime.getBackgroundPage(function(eventPage) {
		eventPage.pick();
    });
});

function getReleaseSystem() {
	var chkList = document.getElementsByName('chkList');
	var releaseSystem = [];

	for(var i=0; i< chkList.length; i++) {
		if(chkList[i].checked === true){
			releaseSystem.push(chkList[i].id);
		}
	}
	return releaseSystem;
}

function getTextArea(targetId) {
	var srcArr = document.getElementById(targetId).value.split("\n");
	var sourceSrc = "";
	
	if(srcArr.length >= 2 || (srcArr.length == 1 && srcArr[0] != '')) {
		for(var i=0; i< srcArr.length; i++) {
			var tempStr = "| " + srcArr[i] + " |\n"
			sourceSrc += tempStr;
		};
	}
	return sourceSrc;
}

var background = chrome.extension.getBackgroundPage();

// 팝업 unfocus
window.addEventListener("unload", function (event) {
	var ls = localStorage;
	
	// 레드마인 no
	ls.setItem("no", document.getElementById("redmine_no").value);
	
	// 대상 서비스
	var checkedService = document.querySelectorAll('input:checked')
	var releaseSystem = [];
	if(checkedService.length != 0) {
		for(var i=0; i<checkedService.length;i++){
			releaseSystem.push(checkedService[i].id);
		}
		ls.setItem("releaseSystem", releaseSystem);
	}
	
	// 기획자 요구사항
	var pmRequest = document.getElementById('pmRequest').value;
	if(pmRequest != "") {
		ls.setItem("pmRequest",pmRequest);
	}
	// 소스파일 경로
	var sourceSrc = document.getElementById('sourceSrc').value;
	if(sourceSrc != "") {
		ls.setItem("sourceSrc",sourceSrc);
	}	
	
});

document.getElementById('init').onclick = function(e){
	localStorage.clear();
	
	document.getElementById('redmine_no').value = "";
	document.getElementById('pmRequest').value = "";
	document.getElementById('sourceSrc').value = "";
	
	var s = document.querySelectorAll('input[type=checkbox]');
	for(var i=0; i<s.length; i++) {
		s[i].checked = false;
	}
};

document.getElementById('githubLink').onclick = function(e){
	chrome.tabs.getSelected(null, function(tab) {
		var redmineWriteURL = "https://github.com/whitebluecloud/buildNoteGenerator";
		chrome.tabs.create({ url: redmineWriteURL })
	});
}