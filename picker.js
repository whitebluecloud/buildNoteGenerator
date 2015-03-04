var redminePicker = {
	that : this
  
  , h2_pattern : /^h2\.\s[\s0-9a-zA-Z가-힣\W]+/g
  , key_value_pattern : /\|\s[\s0-9a-zA-Z가-힣]+\s\|\s[\s0-9a-zA-Z가-힣\W]+\|/g

  , targetSystem : [""] 
  , pm : []
  , taskWatcher : []  
  , releaseSystem : ""
  , releaseDate : ""
	
  , content : ""
  , targetSystemSelector : $('#issue_custom_field_values_26') // 변경작업시스템id
  , pmSelector : $('#issue_custom_field_values_29') // 기획자
  , taskWatcherCheckBoxes : $('#watchers_inputs label') // task지킴이
  , releaseSystemOptions : $('#issue_custom_field_values_37 > option') // 배포시스템
  , releaseDateInput : $('#issue_custom_field_values_38') // 배포일자
  , releaseType : $('#issue_tracker_id'), staffSelector: $('#issue_assigned_to_id') // 담당자
    , staffNo: ""
  
  , hasResourceFront : false
  , hasSsgLib : false
  , hasEmallLib : false
  , hasBoLib : false
  , hasPayLib : false
  
  , releaseSystemMatchingMap : {
		"ssg-ssgmall-webapp":"SSG"
	  , "ssg-small-webapp":"신세계몰"
	  , "ssg-department-webapp":"신세계백화점"        
	  , "ssg-msmall-webapp":"m신세계몰"
	  , "ssg-mssgmall-webapp":"mSSG"      
	  , "ssg-mlguplus-webapp":"mlguplus"
	  , "ssg-emart-webapp":"이마트몰"
	  , "ssg-traders-webapp":"트레이더스"
	  , "ssg-boons-webapp":"분스"
	  , "ssg-memall-webapp":"m이마트몰"
	  , "ssg-mtraders-webapp":"m트레이더스"      
	  
	  , "ssg-bo-webapp":"BO" 
	  , "ssg-po-webapp":"PO" 
	  
	  , "ssg-batch-app":"batch"
	  
	  , "ssg-event-webapp":"이벤트"
	  
	  , "ssg-eapi-webapp":"eAPI"
	  , "ssg-uapi-webapp":"uAPI"
	  , "ssg-capi-webapp":"cAPI"
	  , "ssg-mapi-webapp":"mAPI" 
	  
	  , "ssg-pay-webapp":"pay"
	  , "ssg-mpay-webapp":"mpay"
	  
	  , "ssg-pco-webapp":"PCO"
	  , "ssg-pdo-webapp":"PDO"	  
	  , "ssg-ecms-webapp":"ECMS"	  
	  , "pg-api-webapp":"PG_API"
	  , "pg-www-webapp":"PG_프론트"	  
	  , "pg-bo-webapp":"PG_BO"	  	  
	  
  }
  , getInfo : function() {
	  var that = this;
	  var b = this.content;
	  var a = b.split("|");
	  for(i=0; i< a.length; i++) {
		a[i] = a[i].trim();
		if(a[i] == "기획 담당자") {
		  var pmArr = a[i+1].split(',');
		  $.each(pmArr , function(i, v) {
			 that.pm.push(v.trim());
		  });
		  this.taskWatcher = this.pm.slice(0);
		}
		if(a[i] == "QA 반영 일자") {
		  this.releaseDate = a[i+1].trim();
		}
		if(a[i] == "대상 서비스") {
			var tempSystem = a[i+1].split(/,|\//g);
			//var tempSystem = a[i+1].split(',');
			if(tempSystem instanceof Array) {
				$.each(tempSystem, function(j,w){
					that.targetSystem.push(w.trim());
				});
			}
		}
		if(a[i] == "개발/빌드 담당") {
		  this.taskWatcher.push(a[i+1].trim());
		}
	  }
  }
  , init : function(content) {
		var that = this;
		this.content = $('#issue_description').val();
		this.getInfo();
	
		// library check
		$.each(this.targetSystem, function(i, v) {
			if(v == "ssg-resource.front-webapp") that.hasResourceFront = true;
			if(v == "ssg-ssgmall-library") that.hasSsgLib = true;
			if(v == "ssg-emall-library") that.hasEmallLib = true;
			if(v == "ssg-bo-library") that.hasBoLib = true;
			if(v == "ssg-pay-library") that.hasPayLib = true;
		});

        chrome.runtime.sendMessage({method: "getLocalStorage", key: "staffNo"}, function (response) {
            if (response) {
                this.staffNo = response.data;
            }
        });
	}
  , parse : function() {
		console.log("=============== parsing start ==================");
		this.selectPm();
		this.selectTargetSystem();  
		this.selectReleaseDate();
		this.selectReleaseSystem();
		this.selectTaskWatcher();
        this.selectStaffNo();
		console.log("=============== parsing end ==================");
  }
  
  , getName : function(str, token) {
	  return str.substring(0, str.indexOf(token));
  }
  
  , selectPm : function() {
		var that = this;
		$.each(that.pmSelector.children('option'), function(i, v){
		  $.each(that.pm, function(j, w) {
			  if(w.indexOf(that.getName(v.text, "(")) != -1) {
				  console.log("선택된 기획자 : " + v.text);
				  v.selected = true;
				}    
		  });  
		  
		});
  }
  , selectTargetSystem : function() {
	var that = this;
	$.each(that.targetSystemSelector.children('option'), function(i,v) {
	 v.selected = false;
	 $.each(that.targetSystem, function(j, w) {            
	   if(v.value == w) {
		 console.log("선택된 변경작업시스템 : " + w);
		 v.selected = true;
	   }
	 });
	});    
  }
  , selectTaskWatcher : function() {
	var that = this;
	$.each(that.taskWatcherCheckBoxes, function(i,v) {
	 $.each(that.taskWatcher, function(j, w) {
		 if(that.getName(w, " ").length > 1) {
		   if(v.textContent.indexOf(that.getName(w , " ")) != -1) {
			 console.log("체크된 Task지킴이 : " + w);
			 $(v).children('input').attr("checked","checked");
		   }
		 }
	 });
	});
  }
  , selectReleaseDate : function() {
		var rDateArr = this.releaseDate.split("/");
		var result = "";
		// month/date 형식
		if(rDateArr.length < 2) {
		  console.log("잘못된 배포일자입니다. -> " + rDateArr);
		  return;
		}
		
		var year = "2015"
		var month = "";
		var date = "";
		
		tempDate = new Date(year, rDateArr[0]-1, rDateArr[1]);
		
		// 정기배포인 경우
		if(this.releaseType.val() === '13') {
			tempDate.getDay() > 3 ? tempDate.setDate(tempDate.getDate() - (tempDate.getDay() - 3 )+ 7) 
								  : tempDate.setDate(tempDate.getDate() + (3 - tempDate.getDay()));  
		}
		
		month = (tempDate.getMonth()+1).toString();
		date = tempDate.getDate().toString();
		if(month.length == 1) month = "0" + month;
		if(date.length == 1) date = "0" + date;
		
		result = tempDate.getFullYear() + "-" + month + "-" + date;
		console.log("선택된 배포일은 : " + result);
		
		this.releaseDateInput.val(result);
		
		// 확인 필요
		$('#issue_custom_field_values_38').val(result);
  }
  , selectReleaseSystem : function() {
		var that = this;
	
		// selected 초기화
		$.each(that.releaseSystemOptions, function(j, w) {
		  w.selected = false;
		});
		
		if(that.hasResourceFront) {
		  $.each(that.releaseSystemOptions, function(i, v) {
			if(v.value == "프론트PC ALL" || v.value == "프론트Mobile ALL" ) {
			  v.selected = true;
			  console.log("변경된 작업시스템 : " + v.value);
			}
		  });
		}

		if(that.hasBoLib) {
		  // bo, po
		  $.each(that.releaseSystemOptions, function(i, v) {
			if(v.value == "BO" || v.value == "PO") {
			  v.selected = true;
			  console.log("변경된 작업시스템 : " + v.value);
			}
		  });
		}
		
		if(that.hasSsgLib) {
		  // ssg, mlguplus, small, department, msmall
		  $.each(that.releaseSystemOptions, function(i, v) {
			if(v.value == "SSG" || v.value == "신세계몰" || v.value == "신세계백화점" || v.value == "m신세계몰" || v.value == "mlguplus" ) {
			  v.selected = true;
			  console.log("변경된 작업시스템 : " + v.value);
			}
		  });
		}
		
		if(that.hasEmallLib) {
		  //이마트몰, 트레이더스, 분스, m이마트몰, m트레이더스
		  $.each(that.releaseSystemOptions, function(i, v) {
			if(v.value == "이마트몰" || v.value == "트레이더스" || v.value == "분스" || v.value == "m이마트몰" || v.value == "m트레이더스" ) {
			  v.selected = true;
			  console.log("변경된 작업시스템 : " + v.value);
			}
		  });
		}
		
		if(that.hasPayLib) {
		  //pay, mpay
		  $.each(that.releaseSystemOptions, function(i, v) {
			if(v.value == "pay" || v.value == "mpay") {
			  v.selected = true;
			  console.log("변경된 작업시스템 : " + v.value);
			}
		  });
		}		
		
		// webapp단위
		$.each(that.targetSystem, function(i, v) {
		  $.each(that.releaseSystemOptions, function(j, w) {
			if(that.releaseSystemMatchingMap[v] != "undefined") {
			  if(typeof that.releaseSystemMatchingMap[v] == "string") {
				var tempStr = that.releaseSystemMatchingMap[v];
				that.releaseSystemMatchingMap[v] = tempStr;
			  }
			  if(that.releaseSystemMatchingMap[v] == w.value) {
				w.selected = true;
				console.log("변경된 작업시스템 : " + w.value);
			  }
			}
		  });
		});
    }, selectStaffNo: function () {
        if (this.staffNo) {
            var that = this;
            $.each(that.staffSelector.children('option'), function (i, v) {
                v.selected = false;
                if (v.value == that.staffNo) {
                    console.log("선택된 담당자 : " + v.value);
                    v.selected = true;
                }
            });
        }
    }
};
redminePicker.init();
redminePicker.parse();
