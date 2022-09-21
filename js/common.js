var fv_arrTranBoolean = []; 
var fv_arrTran = []; 
var fv_nTranTotalCnt = 0;

/* loading resize */
jQuery(function($){	
	$(window).resize(function(){
		loadingResize();		
	});	
	setTimeout(function(){
		loadingResize();
	},1);
	
	/*$('.file_label').on('click',function(){
		$('#file').click();		
	});*/
});

/* loading height */
function loadingResize(){	
	var wh = $(window).height()/3;
	$('.loading_bar').css('padding-top',wh);	
}

$(document).ready(function(){
	//페이징(웹접근성작업)
	/*$('.paging .first').html('처음으로 이동');
	$('.paging .prev').html('10페이지 이전으로 이동');
	$('.paging .next').html('10페이지 다음으로 이동');
	$('.paging .end').html('마지막으로 이동');*/
	$('.paging').find('.on').attr('title', '현재 페이지');
});

/********************************************
@설명   	화면이 최초 호출될때, 달력 이벤트를 호출한다.
@작성일  	2014. 06. 05.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 06. 05.	              최초작성
*********************************************/
$(document).ready(function(){
	gfn_initCalendar();
});

/********************************************
@설명   	달력 이벤트를 호출한다.
@작성일  	2014. 07. 02.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 07. 02.	              최초작성
*********************************************/
function gfn_initCalendar(){
	$(".btn_calendar").each(function(){
		$(this).on("click",function(){
			gfn_openBtnCalendar($(this).attr("id"));
		});
		
		ib("#" + $(this).attr('id')).maskedit({
			mask: 'YYYY-MM-DD',          // mask
			guideChar: '_',    // 입력 가이드 문자열 (default: '_')
			type: 'date'
		});
	});
	$(".btn_calendar").trigger("click");
}

/********************************************
@설명   	alert, confirm dialog div tag 추가
@작성일  	2014. 06. 26.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 06. 26.	              최초작성
 *********************************************/
$(document).ready(function(){
	$("body").prepend('<div id="dialog-message"></div>');
});

/********************************************
@함수명  	ComAjax
			- setUrl 		: 전송할 URL을 지정한다.
			- setCallBack 	: 콜백함수명을 지정한다.
			- addParam 		: 파라메터키와 값을 설정한다. 
			- tran 			: 입력값을 전송한다.
@설명   	Ajax 통신을 한다.
@인자   	String formId
@반환    	없음
@작성일  	2014. 06. 05.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 06. 05.	              최초작성
*********************************************/
var fv_jsonNmArray = new Array();
fv_comAjaxCallBack = "";
function ComAjax(opt_formId){
	
	this.formId = "";	// 폼 id
	this.url = "";		// 호출 url
	this.formId = opt_formId;
	this.param = "";// 파라메터
	this.cmmParam = "TRAN_TYPE=ComAjax&SE_FLAG_YN="+gfv_flagYn+"&LANG_TYPE="+gfv_seLang;// 파라메터 구분
	 
	this.dataType ="json";	// json 형식 
	this.async = false;	// 동기
	
	fv_jsonNmArray = new Array();
	
	this.setUrl = function setUrl(url){
		this.url = url;
	};
	
	this.getUrl = function getUrl(){
		return this.url;
	};
	
	this.setCallBack = function setCallBack(callBack){
		fv_comAjaxCallBack = callBack;
	};

	this.addParam = function addParam(key,value){ 
		this.param = this.param + "&" + key + "=" + value; 
	};
	
	this.getParam = function getParam(){
		return this.param;
	};
	
	this.tran = function tran(){
		if(gfn_isNull(this.formId) == false){
			var body = $("#"+this.formId);
			body.find(".btn_calendar").each(function(){
				var id = $(this).attr("id");
				$("#"+id).val(gfn_getDateVal(id));
			});
			
			this.param += "&" + $("#" + this.formId).serialize();
			
			body.find(".btn_calendar").each(function(){
				var id = $(this).attr("id");
				gfn_setDateVal(id, gfn_getDateVal(id));
			});
		}
		$.ajax({
			url : this.url,    
			type : "POST",   
			data : gfn_isNull(this.param) == true ? this.cmmParam : this.cmmParam + "&" + this.param,
			//dataType : this.dataType,
			async : this.async, 
			success : function(data, status) {
				
				// 간단히 확인할때 주석 풀고 alert창 띄우기
				//var result = "Json-Result:" + "\n" + JSON.stringify(data);
				//alert(result);
				
				if(gfn_isNull(data._EXCEPTION) == true) {	// success
					if(typeof(fv_comAjaxCallBack) == "function"){
						fv_comAjaxCallBack(data);
					}else {
						eval(fv_comAjaxCallBack + "(data);");
					}
				}
				else {	// common error
					//data._EXCEPTION.ERROR_CODE
					//data._EXCEPTION.ERROR_MESSAGE
					if(data.ERROR_TYPE == "session") {	// session error
						var sessionErrorSubmit = new ComSubmit(); 
						sessionErrorSubmit.setUrl("/cmm/openSessionOut.do");		
						sessionErrorSubmit.addParam("BEFORE_LANG", data.BEFORE_LANG);
						sessionErrorSubmit.tran();
					}
					else{
						gfn_alertPrint(data._EXCEPTION.ERROR_MESSAGE);
					}
				}
			}
		});
	};
}

/********************************************
@함수명  	ComSubmit
			- setUrl 		: 전송할 URL을 지정한다.
			- setTarget 	: 타켓을 지정한다.
			- addParam 		: 파라메터의 키와 값을 설정한다.	 
			- tran 			: 입력값을 전송한다.
@설명   	입력폼을 전송(submit)한다.
@인자   	String formId
@반환    	없음
@작성일  	2014. 06. 05.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 06. 05.	              최초작성
*********************************************/
function ComSubmit(opt_formId) {
	
	this.formId = gfn_isNull(opt_formId) == true ? "frmCmmAuth" : opt_formId;
	this.url = '';
	this.target = '';
	this.delElementId = '';
	this.param = "";// 파라메터
	this.cmmParam = "TRAN_TYPE=ComSubmit";	// 파라메터 구분
	
	// url 세팅
	this.setUrl = function setUrl(url){
		this.url = url;
	};
	
	// param 세팅
	this.addParam = function addParam(key, value){
		if(this.formId == "frmCmmAuth"){
			
			// 추가할 key값이 존재하면 삭제 후 추가
			$("#"+this.formId).find("input[name=" + key + "]").remove();
			
			$("#"+this.formId).append($("<input type='hidden' name='"+key+"' id='"+key+"' value='"+value+"' >"));
			
			//팝업 호출시 해당 부모창에 남겨져 있는 input을 삭제하기 위해 저장
			if(gfn_isNull(this.delElementId) == true){
				this.delElementId = key;
			}else{
				this.delElementId = this.delElementId+":"+ key;
			}
		}
		else{
			if(gfn_isNull($("#"+this.formId).find($("#"+key)).attr("id")) == false){
				$("#"+this.formId).find($("#"+key)).remove();
			}
			$("#"+this.formId).append("<input type='hidden' id='"+key+"' name='"+key+"' value='"+value+"' />");
		}
	};
	
	// 타켓 세팅
	this.setTarget=function setTarget(target){
		this.target = target;
	};
	
	// 메뉴 Tran
	this.menuTran = function menuTran(menuId){
		this.url = "/openPage.do?MENU_ID=" + menuId;
		this.tran();
	};
		
	// 일반 Submit Tran
	this.tran = function tran(){
		var body = $("#"+this.formId);
		body.find(".btn_calendar").each(function(){
			var id = $(this).attr("id");
			$("#"+id).val(gfn_getDateVal(id));
		});

		// 공통 파라메터 세팅
		
		var cmmParamArray = this.cmmParam.split("=");
		
		$("#"+this.formId).find("input[name=" + cmmParamArray[0] + "]").remove();	// 기존 input 삭제
		$("#"+this.formId).find("input[name=SE_FLAG_YN]").remove();	// 기존 input 삭제
		$("#"+this.formId).find("input[name=LANG_TYPE]").remove();	// 기존 input 삭제
		
		$("#"+this.formId).append("<input type='hidden' id='"+cmmParamArray[0]+"' name='"+cmmParamArray[0]+"' value='"+cmmParamArray[1]+"' />");
		$("#"+this.formId).append("<input type='hidden' id='SE_FLAG_YN' name='SE_FLAG_YN' value='"+gfv_flagYn+"' />");
		$("#"+this.formId).append("<input type='hidden' id='LANG_TYPE' name='LANG_TYPE' value='"+gfv_seLang+"' />");
		this.delElementId = gfn_isNull(this.delElementId) == true ? cmmParamArray[0] : this.delElementId + ":" + cmmParamArray[0]; // 삭제 리스트에 추가
		
		//target 설정
		$("#"+this.formId)[0].target = this.target;
		$("#"+this.formId)[0].action = this.url; // url 설정
		$("#"+this.formId)[0].method = "post";
		$("#"+this.formId)[0].submit();	// submit

		// 타겟 & 파라메터 초기화
		//if(gfn_isNull(this.target) == false){
			this.target = '';
			
			var delElementIdList = this.delElementId.split(":");

			for(var i=0; i<delElementIdList.length; i++){
				
				var delElementId = delElementIdList[i];
				
				$("#"+this.formId+" input[id="+delElementId+"]").remove();
			}
		//}
	};
}


/********************************************
@함수명  	gfn_openPopUp
@설명   	팝업을 호출한다.
@인자   	String strFile, String strPopName, Object objParams, String strWidth, String strHeight
@입력형태	strFile : /sample/samplePop 등의 호출할 파일 경로
			strPopName : 팝업명 
			objParams : 팝업에 전달해야할 인자값 object
			strWidth : 팝업 넓이
			strHeight : 팝업 높이
@반환    	없음
@작성일  	2014. 5. 29.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 29.	              최초작성
*********************************************/
function gfn_openPopUp(strFile,strPopName,objParams,strWidth,strHeight) {
	
	var popupSubmit = new ComSubmit();

	//이동할 URL설정
	popupSubmit.setUrl("/cmm/comOpenUp.do");
	
	strPopName = gfn_trim(strPopName);
	//페이지를 이동시킬 target 설정
	popupSubmit.setTarget(strPopName);
	
	//전달할 파라미터들을 셋팅
	if(gfn_isNull(objParams) == false){
		$.each(objParams,function(key,val){
			popupSubmit.addParam(key, val);
		});
	}
	
	//화면 호출할 파일 (ex: /sample/sampleList)
	popupSubmit.addParam("file", strFile);
	
	//팝업 호출
	window.open("", strPopName, "width="+strWidth+",height="+strHeight+", scrollbars=yes , location=no");
	
	//팝업에 해당 url로 submit 시킴
	popupSubmit.tran();
}

/********************************************
@함수명  	gfn_getMsg
@설명   	메시지를 호출한다.
@인자   	String message, String opt_param, String opt_param1, String opt_param2, String opt_param3
@반환    	메시지
@작성일  	2014. 5. 30.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 30.	              최초작성
*********************************************/
function gfn_getMsg(message, opt_param, opt_param1, opt_param2, opt_param3){
	var setMsg = message;
	
	if(gfn_isNull(opt_param)==false){ //{0} 인곳에 param을 넣는다.
		setMsg = setMsg.replace("{0}",opt_param);
	}
	if(gfn_isNull(opt_param1)==false){ //{1} 인곳에 param1을 넣는다.
		setMsg = setMsg.replace("{1}",opt_param1);
	}
	if(gfn_isNull(opt_param2)==false){ //{2} 인곳에 param2을 넣는다.
		setMsg = setMsg.replace("{2}",opt_param2);
	}
	if(gfn_isNull(opt_param3)==false){ //{3} 인곳에 param3을 넣는다.
		setMsg = setMsg.replace("{3}",opt_param3);
	}
	
	return setMsg;
}


/********************************************
@함수명  	gfn_setTran
@설명   	화면별 트랜젝션 설정 (ready 함수에서 호출)
@인자   	String arrTran
@작성일  	2014. 6. 20.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 20.	              최초작성
*********************************************/
function gfn_setTran(arrTran){
	
	fv_arrTran = arrTran;
	
	var arrTranTemp = [];	// 임시 배열 
	for(var i=0; i<fv_arrTran.length; i++){
		arrTranTemp = [];
		for(var j=0; j<fv_arrTran[i].length; j++){
			arrTranTemp[j] = true;
			fv_nTranTotalCnt ++;	// 전체 갯수 종료시 사용된다.
		}
		fv_arrTranBoolean[i] = arrTranTemp;	 
	}
} 

/********************************************
@함수명  	gfn_beginLoad
@설명   	로딩 시작
@인자   	String strTranName : 해당트랜젝션 아이디
@작성일  	2014. 6. 20.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 20.	              최초작성
*********************************************/
function gfn_beginLoad(strTranName){
	
	$('.loading_bar').css("display", "block");
	
	var bChangeFalse = false;	// tran 대상으로 변경 할것인가에 대한 변수 
	
	for(var i=0; i<fv_arrTran.length; i++){
		bChangeFalse = false; // 기본은 변경하지 않는다.
		
		for(var j=0; j<fv_arrTran[i].length; j++){
			// 시작하는 tran name
			if(fv_arrTran[i][j] == strTranName){
				bChangeFalse = true;		
			}
			
			// 해당 tran부터 하위 tran 모두 tran 대상으로 변경
			if(bChangeFalse == true){
				fv_arrTranBoolean[i][j] = false;
			}
		}
	}
	//gfn_callLog("BEGIN : " + strTranName);
}

/********************************************
@함수명  	gfn_endLoad
@설명   	로딩 시작
@인자   	String strTranName : 해당트랜젝션 아이디
			bolean opt_bLowProcess : 하위 트랜젝션 강제 종료 여부
@작성일  	2014. 6. 20.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 20.	              최초작성
*********************************************/
function gfn_endLoad(strTranName, opt_bLowProcess){
	
	var bLowProcess = gfn_isNull(opt_bLowProcess) == true ? true : opt_bLowProcess;   
	var bLowChange = false;	// 하위 tran 종료상태로 변경
	var nTranTrueCnt = 0;
	
	for(var i=0; i<fv_arrTran.length; i++){
		bLowChange = false;
		for(var j=0; j<fv_arrTran[i].length; j++){
			
			// 해당 tran 종료
			if(fv_arrTran[i][j] == strTranName){
				fv_arrTranBoolean[i][j] = true;
				bLowChange = true;
				nTranTrueCnt++;	// tran 종료 수
				continue;
			}
			
			// 하휘 tran이 종료 상태 && 현재 프로세스에서 종료라면
			if(bLowChange == true && bLowProcess == false){
				fv_arrTranBoolean[i][j] = true;	// 하위 tran 대상이 아니도록 설정
			}
			
			if(fv_arrTranBoolean[i][j] == true){
				nTranTrueCnt ++;	// tran 종료 수		
			}
		}
	}	
	
	if(fv_nTranTotalCnt == nTranTrueCnt){
		//$('.loading_bar').css("display", "none");
		$('.loading_bar').fadeOut(300);
	}
	
	//gfn_callLog("END : " + strTranName);
}

/********************************************
@함수명  	gfn_callLog
@설명   	임시 함수
@인자   	
@작성일  	2014. 6. 20.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 20.	              최초작성
*********************************************/
function gfn_callLog(strTranName){
	//console.log("#" + strTranName + "#");
	
	for(var i=0; i<fv_arrTran.length; i++){
		for(var j=0; j<fv_arrTran[i].length; j++){
			//console.log(fv_arrTran[i][j] + " : " + fv_arrTranBoolean[i][j]);	
		}
	} 
	
	//console.log("");
}

/********************************************
@함수명  	gfn_alert
@설명   	공통 alert 함수
@인자   	string strMessageId : 메시지 아이디
			object objParam : {param = '{0}', param1 = '{1}', param2 = '{2}', param1 = '{3}'} 의 가변 메시지 설정
			function funcPost : alert 이후에 호출될 function 
@작성일  	2014. 6. 26.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 26.	              최초작성
*********************************************/
var fv_funcAlertPost = null;
function gfn_alert(strMessageId, objParam, funcPost){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcPost) == false){
		fv_funcAlertPost = funcPost;
	}else{
		fv_funcAlertPost = null;
	}
	
	var alertAjax = new ComAjax();
	alertAjax.setUrl("/cmm/selectMessage.do");
	alertAjax.setCallBack("gfn_alertCallback");
	alertAjax.addParam("MESSAGE_ID", encodeURI(strMessageId));
	if(gfn_isNull(objParam) == false){
		if(gfn_isNull(objParam.param)==false){ 
			alertAjax.addParam("MESSAGE_PARAM", encodeURI(objParam.param));
		}
		if(gfn_isNull(objParam.param1)==false){ 
			alertAjax.addParam("MESSAGE_PARAM1", encodeURI(objParam.param1));
		}
		if(gfn_isNull(objParam.param2)==false){ 
			alertAjax.addParam("MESSAGE_PARAM2", encodeURI(objParam.param2));
		}
		if(gfn_isNull(objParam.param3)==false){ 
			alertAjax.addParam("MESSAGE_PARAM3", encodeURI(objParam.param3));
		}
	}
	alertAjax.tran();
}

/********************************************
@함수명  	gfn_alertCallback
@설명   	gfn_alert의 callback 함수 
*********************************************/
function gfn_alertCallback(data){
	gfn_alertPrint(data.MESSAGE);
}

/********************************************
@함수명  	gfn_alertPrint
@설명   	공통 alert 출력 함수
@인자   	string strMessage : 메시지
@작성일  	2014. 7. 25.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 25.	              최초작성
*********************************************/
function gfn_alertPrint(strMessage){	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	//dialogHtml += 	'<table border="1" cellpadding="1" cellspacing="0" summary="alert message" class="board_alert01">';
	dialogHtml += 	'<table border="1" cellpadding="1" cellspacing="0" class="board_alert01">';
	//dialogHtml += 		'<caption>alert</caption>';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:15%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	//dialogHtml += 		'<tbody>';
	dialogHtml +=		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/images/ico/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml +=		'</tr>';
	//dialogHtml += 		'</tbody>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="alertClose" class="btn_blue_b" >';
	dialogHtml += (gfv_seLang == 'KO' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인'))); 
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'KOREA VISA PORTAL',
		position:['center', 100],
		width:400,			
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#alertClose').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcAlertPost) == false){
			fv_funcAlertPost();
			fv_funcAlertPost = null;
		}
	});
}

/********************************************
@함수명  	gfn_confirm
@설명   	공통 confirm 함수
@인자   	string strMessageId : 메시지 아이디
			object objParam : {param = '{0}', param1 = '{1}', param2 = '{2}', param1 = '{3}'} 의 가변 메시지 설정
			function funcTrue : true시 호출될 function 
			function funcFalse : false시 호출될 function 
@작성일  	2014. 6. 26.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 26.	              최초작성
*********************************************/
var fv_funcConfirmPostTrue = null;	// confirm true시 호출될 함수를 담는 전역변수
var fv_funcConfirmPostFalse = null;	// confirm false시 호출될 함수를 담는 전역변수
function gfn_confirm(strMessageId, objParam, funcTrue, funcFalse){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcTrue) == false){
		fv_funcConfirmPostTrue = funcTrue;
	}else{
		fv_funcConfirmPostTrue = null;
	}
	
	if(gfn_isNull(funcFalse) == false){
		fv_funcConfirmPostFalse = funcFalse;
	}else{
		fv_funcConfirmPostFalse = null;
	}
	
	var alertAjax = new ComAjax();
	alertAjax.setUrl("/cmm/selectMessage.do");
	alertAjax.setCallBack("gfn_confirmCallback");
	alertAjax.addParam("MESSAGE_ID", encodeURI(strMessageId));
	
	if(gfn_isNull(objParam) == false){
		
		if(gfn_isNull(objParam.param)==false){
			//alert(objParam.param);
			alertAjax.addParam("MESSAGE_PARAM", encodeURI(objParam.param));
		}
		if(gfn_isNull(objParam.param1)==false){ 
			alertAjax.addParam("MESSAGE_PARAM1", encodeURI(objParam.param1));
		}
		if(gfn_isNull(objParam.param2)==false){ 
			alertAjax.addParam("MESSAGE_PARAM2", encodeURI(objParam.param2));
		}
		if(gfn_isNull(objParam.param3)==false){ 
			alertAjax.addParam("MESSAGE_PARAM3", encodeURI(objParam.param3));
		}
	}
	alertAjax.tran();
	

}
/********************************************
@함수명  	gfn_confirm3Line
@설명   	공통 confirm 함수 를 메시지 Or Param 합쳐서 총 3개까지 전송가능한
        3줄의 Text를 가진 Confirm 창을 팝업 
        Param은 2개만 가질수 있으며 가변메시지로 받을수 없다
@인자   	string objMessageId : 메시지 아이디
			object objParam : {param = '{0}', param1 = '{1}', param2 = '{2}'} 스트링만 가능
			function funcTrue : true시 호출될 function 
			function funcFalse : false시 호출될 function 
@작성일  	2014. 6. 26.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 26.	              최초작성
*********************************************/
function gfn_confirm3Line(objMessageId, objParam, funcTrue, funcFalse){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcTrue) == false){
		fv_funcConfirmPostTrue = funcTrue;
	}else{
		fv_funcConfirmPostTrue = null;
	}
	
	if(gfn_isNull(funcFalse) == false){
		fv_funcConfirmPostFalse = funcFalse;
	}else{
		fv_funcConfirmPostFalse = null;
	}
	
	var alertAjax = new ComAjax();
	alertAjax.setUrl("/cmm/selectMultiMessage.do");
	alertAjax.setCallBack("gfn_confirm3LineCallback");
	alertAjax.addParam("MESSAGE_ID", encodeURI(objMessageId));
	
	if(gfn_isNull(objParam) == false){
		
		if(gfn_isNull(objParam.param)==false){
			alertAjax.addParam("MESSAGE_PARAM", encodeURI(objParam.param));
		}
		if(gfn_isNull(objParam.param1)==false){ 
			alertAjax.addParam("MESSAGE_PARAM1", encodeURI(objParam.param1));
		}
		if(gfn_isNull(objParam.param2)==false){ 
			alertAjax.addParam("MESSAGE_PARAM2", encodeURI(objParam.param2));
		}
		if(gfn_isNull(objParam.index)==false){ 
			alertAjax.addParam("MESSAGE_INDEX", encodeURI(objParam.index));
		}
	}
	alertAjax.tran();
	

}
/********************************************
@함수명  	gfn_confirmCallback
@설명   	gfn_confirm의 callback 함수 
*********************************************/
function gfn_confirmCallback(data){
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	//dialogHtml += 	'<table border="1" cellpadding="1" cellspacing="0" summary="confirm message" class="board_alert01">';
	dialogHtml += 	'<table border="1" cellpadding="1" cellspacing="0" class="board_alert01">';
	//dialogHtml += 		'<caption>confirm</caption>';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:18%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	//dialogHtml += 		'<tbody>';
	dialogHtml += 		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/images/ico/ico_alert_02.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + data.MESSAGE + '</td>';
	dialogHtml += 		'</tr>';
	//dialogHtml += 		'</tbody>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="confirmTrue" class="btn_blue_b">';
	dialogHtml += (gfv_seLang == 'KO' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인')));
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmFalse" class="btn_green_b">';
	dialogHtml += (gfv_seLang == 'KO' ? '취소' : (gfv_seLang == 'EN' ? "Cancel" : (gfv_seLang == 'CH' ? '取消' : '취소')));
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'KOREA VISA PORTAL',
		position:['center', 100],
		width:400,			
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#confirmTrue').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostTrue) == false){
			
			// confirm true의 callback 호출
			fv_funcConfirmPostTrue();
			
			// callback 초기화		
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
	$('#confirmFalse').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostFalse) == false){
			
			// confirm false의 callback 호출
			fv_funcConfirmPostFalse();
			
			// callback 초기화
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
}

/********************************************
@함수명  	gfn_confirm3LineCallback
@설명   	gfn_confirm의 callback 함수 
*********************************************/
function gfn_confirm3LineCallback(data){
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	//dialogHtml += 	'<table border="1" cellpadding="1" cellspacing="0" summary="confirm message" class="board_alert01">';
	dialogHtml += 	'<table border="1" cellpadding="1" cellspacing="0" class="board_alert01">';
	//dialogHtml += 		'<caption>confirm</caption>';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:18%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	//dialogHtml += 		'<tbody><tr>';
	dialogHtml += 		'<tr>';
	dialogHtml += 			'<td scope="row" rowspan="3"><img src="/images/ico/ico_alert_02.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + data.MESSAGE1 + '</td>';
	dialogHtml += 		'</tr>';
	dialogHtml += 		'<tr><td>' + data.MESSAGE2 + '</td></tr>';
	dialogHtml += 		'<tr><td>' + data.MESSAGE3 + '</td></tr>';
	//dialogHtml += 		'</tbody>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="confirmTrue" class="btn_blue_b">';
	dialogHtml += (gfv_seLang == 'KO' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인')));
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmFalse" class="btn_green_b">';
	dialogHtml += (gfv_seLang == 'KO' ? '취소' : (gfv_seLang == 'EN' ? "Cancel" : (gfv_seLang == 'CH' ? '取消' : '취소')));
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'KOREA VISA PORTAL',
		position:['center', 100],
		width:600,			
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#confirmTrue').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostTrue) == false){
			
			// confirm true의 callback 호출
			fv_funcConfirmPostTrue();
			
			// callback 초기화		
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
	$('#confirmFalse').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostFalse) == false){
			
			// confirm false의 callback 호출
			fv_funcConfirmPostFalse();
			
			// callback 초기화
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
	
}

/********************************************
@설명   	동적SELECT 만드는 함수
@작성일  	2014. 07. 14.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 07. 14.	              최초작성
*********************************************/
var fv_comBoId = null;
var fv_userCallBack = null;
function gfn_setSelectCode(url,param,comBoId,userCallBack){
	
	var sCodeAjax = new ComAjax();
	
	fv_comBoId = comBoId;
	fv_userCallBack = userCallBack;
	sCodeAjax.setUrl(url);
	if(gfn_isNull(param)==false){
		var paramList = param.split("|");
		var paramArr = [];
		for(var i=0; i< paramList.length; i++){
			paramArr = paramList[i].split("=");
			sCodeAjax.addParam(paramArr[0], encodeURI(paramArr[1]));
		}
	}
	
	sCodeAjax.setCallBack("gfn_makeSelectCallBack");
	sCodeAjax.tran();
}

function gfn_makeSelectCallBack(data){
	var strBuffer;
	strBuffer = eval(fv_userCallBack+"(fv_comBoId,data);");
	$("#"+fv_comBoId).empty();
	$("#"+fv_comBoId).append(strBuffer);
}

/********************************************
@함수명  	ComCodeAjax
@설명		공통 코드 ajax 호출 모듈
@인자		없음
@반환    	없음
@작성일  	2014. 08. 08.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 08. 08.	              최초작성
*********************************************/
function ComCodeAjax(){
	
	this.tagID = "";
	this.target = "";
	this.codeIn = "";
	this.code = "";
	this.emptyName = "";
	this.isNotEmpty = "";
	this.userCallback = "";
	
	/**
	 * @설명   	
	 * 필수요소 <br>
	 * 사용) id='...' <br> 
	 * 출력) select의 id 지정 <select id="..." /> <br>
	 * */
	this.setID = function(tagID){
		this.tagID = tagID;
	};
	/**
	 * @설명   	
	 * 필수요소<br>
	 * 사용) code='...'<br>
	 * 설명) target='KVIS'의 경우 : 'VW_PHZ86_01.CODE_CD_GB='KVIS' AND VW_PHZ86_01.CODE_PARENT_ID = #code#' | target='KVIS' 아닌 경우 : 'VW_PHZ86_01.CODE_CD_GB = #code# AND VW_PHZ86_01.CODE_PARENT_ID = #target#'<br>
	 **/
	this.setTarget = function(target){
		this.target = target;
	};
	/**
	 * @설명   	
	 * 사용) codeIn='값1' 또는 target='값1^값2'<br>
     * 설명) CODE_ID IN (codeIn)<br>
	 * */
	this.setCodeIn = function(codeIn){
		this.codeIn = codeIn;
	};
	/**
	 * @설명   	
	 * 필수요소<br>
	 * 사용) code='...'<br>
	 * 설명) target='KVIS'의 경우 : 'VW_PHZ86_01.CODE_CD_GB='KVIS' AND VW_PHZ86_01.CODE_PARENT_ID = #code#' | target='KVIS' 아닌 경우 : 'VW_PHZ86_01.CODE_CD_GB = #code# AND VW_PHZ86_01.CODE_PARENT_ID = #target#'<br>
	 **/
	this.setCode = function(code){
		this.code = code;
	};
	/**
	 * @설명   	
	 * 사용) emptyName='...'<br>
	 * 설명) isNotEmpty=false일 경우 ,<option value=''>isNotEmpty<br>
 	 * 출력) <option value=''>...<br>
	 **/
	this.setEmptyName = function(emptyName){
		this.emptyName = emptyName;
	};
	/**
	 * @설명   	
	 * 사용) isNotEmpty='true' | isNotEmpty='false'<br>
	 * 출력) <option value=''>emptyName 속성값<br>
	 **/
	this.setIsNotEmpty = function(isNotEmpty){
		this.isNotEmpty = isNotEmpty;
	};
	/**
	 * @설명   	
	 * 사용자 콜백 호출명
	 **/
	this.setUserCallback = function(userCallback){
		this.userCallback = userCallback;
	};
	
	this.tran = function(){
		var comAjax = new ComAjax();
		
		comAjax.setUrl("/cmm/selectCodeList.do");
		comAjax.setCallBack("gfn_comCodeAjaxCallback");
		comAjax.addParam("SEARCH_CODE", this.code);
		comAjax.addParam("SEARCH_TARGET", this.target);
		comAjax.addParam("SEARCH_CODE_IN", this.codeIn);
		comAjax.addParam("TAG_ID", this.tagID);
		comAjax.addParam("EMPTY_NAME", this.emptyName);
		comAjax.addParam("IS_NOT_EMPTY", this.isNotEmpty);
		comAjax.addParam("USER_CALLBACK", this.userCallback);
		
		comAjax.tran();
	};
	
}

/********************************************
@함수명  	gfn_comCodeAjaxCallback
@설명		공통 코드 ajax 호출 콜백
*********************************************/
function gfn_comCodeAjaxCallback(data) {
	var strTagId = data.TAG_ID;
	var strEmptyName = gfn_isNull(data.EMPTY_NAME) == true ? "" : data.EMPTY_NAME;
	var strIsNotEmpty = data.IS_NOT_EMPTY;
	var strUserCallback = data.USER_CALLBACK;
	
	var strBuffer = ""; // 태그 저장 변수
	
	// 빈값이 들어간다면
	if(strIsNotEmpty == "true"){
		strBuffer += "<option value=''>" + strEmptyName + "</option>";
	}
	$.each(data.CODE_RESULT , function(index){
		strBuffer += "<option value='" + this.CODE + "'>" + this.CODE_NAME + "</option>";
	});
	
	$("#"+strTagId).empty();
	$("#"+strTagId).append(strBuffer);
	
	eval(strUserCallback + "(data);");	// 사용자 콜백 호출
}

/********************************************
@함수명  	gfn_getCmmMenuUrl
				- menuId 		: 오픈  URL
@설명   	 	메뉴에 등록된 메뉴 URL  공통 호출
@인자   		String menuId
@반환		String    	
@작성일  	2014. 09. 24.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 09. 24.	              최초작성
*********************************************/
function gfn_getCmmMenuUrl(menuId){
	return "forward:/openPage.do?MENU_ID=" + menuId; 
}
