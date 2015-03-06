chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var c = {
		content : ""
	   ,subject : ""
	   ,requester : ""
	   ,developer : ""
	   ,description : request.description
	   ,startDate: ""
	   ,dueDate: ""
	   ,redmineNo: request.redmineNo
	   ,releaseSystem: request.releaseSystem
	   ,pmRequest : request.pmRequest
	   ,sourceSrc : request.sourceSrc
	   
	   ,getContent : function(){
			//임시 레드마인번호 세팅
			var that = this;
			var url = "http://redmine.ssgadm.com/redmine/issues/" + this.redmineNo;
			
			$.get(url, function(data) {
				that.content = data;
				that.getSubject(data);
				that.getRequester(data);
				that.getDeveloper(data);
				that.getDescription(data);
				that.getStartDate(data);
				that.getDueDate(data);
				that.makeFormat();
				$('#ajax-indicator').hide();
			});
		}
	   ,getSubject : function(d) {
			this.subject = this.getTarget(d, "subject", "author", "<h3>", "</h3>");
			console.log("제목 : " + this.subject);
	   }
	   ,getRequester : function(d) {
			e = this.getTarget(d, "author", "이(가)", "active\">", "</a>"); 
			this.requester = e.substring(0,e.indexOf("(")) + e.substring(e.indexOf(" "), e.length);
			console.log("요청자 : " + this.requester);
	   }
	   ,getDeveloper : function(d) {
			e = this.getTarget(d, "담당자:", "progress", "active\">", "</a>");
			this.developer = e.substring(0,e.indexOf("(")) + e.substring(e.indexOf(" "), e.length); 
			console.log("개발자 : "  + this.developer);
	   }
	   ,getDescription : function(d) {
			if(this.description == "" || this.description == 'undefined' || this.description == null){
				this.description = this.getTarget(d, "class=\"wiki\">", "issue_tree", "<p>", "</p>"); 
				this.description = "| " + this.description + " |";
			}
			console.log("설명 : " + this.description);
	   }
	   ,getStartDate : function(d) {
			this.startDate = this.getTarget(d, "<th class=\"start-date", "우선순위", "<td class=\"start-date\">", "</td>");
			console.log("시작시간 : " + this.startDate);
	   }
	   ,getDueDate : function(d) {
			this.dueDate = this.getTarget(d, "<th class=\"due-date", "담당자", "<td class=\"due-date\">", "</td>");
			
			if(this.dueDate == null || this.dueDate == "" || this.dueDate == "undefined") {
				var today = new Date();
				
				var type = document.getElementById('issue_tracker_id');
				// 정기배포유형이고 화요일이 지난 경우 차주 수요일로 세팅
				if(type.value == '13') {
					if(today.getDay() >= 3) {
						today.setDate(today.getDate() + 10- today.getDay()); 
					}else {
						today.setDate(today.getDate() + 3- today.getDay()); 
					}
				}

				// 완료일자가 없는 경우는 작성일로 세팅
				this.dueDate = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
			}
			console.log("완료시간 : " + this.dueDate);
	   }
	   ,getTarget : function(d, s1, e1, s2, e2) {
			var e = d.substring(d.indexOf(s1),d.indexOf(e1));
			var result = e.substring(e.indexOf(s2) + s2.length, e.indexOf(e2));
			
			return result;
	   }
	   ,parseDueDate : function(str) {
			var a = str.split("-");
			var date = new Date(a[0], a[1]-1, a[2]);
			date.setDate(date.getDate()-2);
			
			return (date.getMonth()+1) + "/" + date.getDate();
	   }
	   ,makeFormat : function() {
			console.log("=====================첨부된 설명 start ========================");
			var result = "h2. 개요\n"
					  + "\n| 요청자 | " + this.requester 
					  + " |\n| 기획 담당자 | " + this.requester
					  + " |\n| 개발/빌드 담당 | " + this.developer
					  + " |\n| 개발 기간 | " + this.startDate + " ~ " + this.dueDate
					  + " |\n| QA 반영 일자 | " + this.parseDueDate(this.dueDate)
					  + " |\n| 대상 서비스 | " + this.releaseSystem
					  
					  + " |\n\n"
					  + "h2. 개발 SPEC (기능 추가 및 삭제/변경 내역)"
					  + " \n\n"
					  + "| Redmine key | #"+ this.redmineNo
					  + " |\n| 내역 " + this.description.replace(/<br \/>/gi, '\n')
					  
					  + " \n\n"
					  + "h2. 기획자 테스트 요구 사항"
					  + " \n\n" + this.pmRequest
					  
					  + "\n"
					  + " h2. 영향 받는 시스템 및 기능 (Dependency Module)"
					  + " \n\n"
					  + "| 담당자 확인 | 없음"
					  + " |\n| 시스템명 | 없음"
					  + " |\n| 영향 받는 기능 / 영역 | 없음"
					  
					  + " |\n\n"
					  + "h2. SQL 검수 완료 여부"
					  + " \n\n"
					  + "| SQL 검수 완료 확인 (.xml 소스 반영 시) | N/A"
					  + " |\n| SQL 검수 요청 Redmine Key | N/A"
					  
					  + " |\n\n"
					  + "h2. 소스 파일 경로"
					  + "\n\n"
					  + this.sourceSrc
					  
					  + "\n"
					  + "h2. 배포 요구 사항"
					  + "\n\n"
					  + "| 배포 유형 | WAR"
					  + " |\n| QA WAR 버전 | 추후작성"
					  + " |\n| 유희사항 | |"
					  ;
					 console.log(result);
			console.log("=====================첨부된 설명 end ========================");					 
				//제목	 
			    $('#issue_subject').val(this.subject);
			    //설명
				$('#issue_description').val(result);
	   }   
	}
	c.getContent();
});