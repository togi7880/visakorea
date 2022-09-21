/* 전역번수 설정 */
var gfv_target = ""; //gfn_isValidParams 함수에서 사용
var gfv_targets = []; //gfn_isValidInParams 함수에서 사용 
var gfv_isValid = true; //validation 함수에서 공통으로 사용


/********************************************
@함수명  	gfn_isValidEmail
@설명   	E-mail 주소 형식의 유효성을 체크한다.
@인자   	String str
@반환    	false (E-mail 주소 형식이 유효한 경우),
		  	true (E-mail 주소 형식이 유효하지 경우)
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
2014.11. 17.          	      정규표현식 변경
*********************************************/
function gfn_isValidEmail(str){
	if(gfn_isNull(str))
		return str;
	//^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$
	var reg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*[@][0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*[.][a-zA-Z]{2,3}$/i;
	return reg.test(str) ? true : false;
}

/********************************************
@함수명  	gfn_isValidParams
@설명   	입력값에 대해서 null 체크, 메시지 출력, 포커스를 준다.
@인자   	String params
@입력형태 	id=CODE_ID | id=CODE_ID^CODE_ID | id=CODE_ID^@메시지 
			( ^ 구분자로 CODE_ID는 최대 4개까지 가능 -> gfn_alert의 objParam의 param0 ~ param3에 해당)
			( 메시지에 @를 붙이게 되면 그것은 메시지를 그대로 출력하는것을 뜻함)
@반환    	true (모든 입력값이 null이 아닌 경우),
		  	false (입력값 중 하나라도 null인 경우)
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
2014. 7. 24.	      		  DB 메시지 key(CODE_ID)를 받도록 수정
*********************************************/
function gfn_isValidParams(params){
	gfv_target = "";
	gfv_isValid = true;
	params = gfn_trim(params);
	var param = params.split('|');
	for(var i=0; i<param.length; i++){
		var input = param[i].toString().split('=');
		gfv_target = $("#"+input[0]); 
		if(input[1].toString().indexOf('^') > -1){ //param이 있는 메시지 출력
			var messages = input[1].toString().split('^');
			if(gfn_isNull(gfv_target.val()) == true){
				var objParams = {};
				var key = "param";
				for(var j=1; j<messages.length; j++){
					if(j != 1){
						key = key + (j-1); 
					}
					objParams[key] = messages[j];	
				}
				gfv_isValid = false;
				gfn_alert(messages[0],objParams,function(){
					$("#"+input[0]).focus();
					return false;
				});  
			}
			if(gfv_isValid == false){
				return false; 
			}
		}
		else{ //단일 메시지 출력 -> param이 없는 경우
			var message = input[1].toString();
			if(gfn_isNull(gfv_target) == false && gfn_isNull(gfv_target.val()) == true){
				gfv_isValid = false;
				gfn_alert(message, null, function(){
					gfv_target.focus();
					return false;
				});
			}
			if(gfv_isValid == false){
				return false; 
			}
		}
	}
	
	return gfv_isValid;
}

/********************************************
@함수명  	gfn_isValidInParams
@설명   	필수 입력값 중 하나라도 값이 있는지 확인한다.
@인자   	String params
@입력형태 	id=CODE_ID | id=CODE_ID | id=CODE_ID
@반환    	true (입력값 중 하나라도 null이 아닌 경우),
		  	false (모든 입력값이 null인 경우)
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
2014. 7. 25.	      		  DB 메시지 key(CODE_ID)를 받도록 수정
*********************************************/
function gfn_isValidInParams(params){
	gfv_isValid = true;
	gfv_targets = [];
	var isValid = false;
	var message = "";
	
	params = gfn_trim(params);
	var param = params.split('|');
	for(var i=0; i<param.length; i++){
		var input = param[i].toString().split('=');
		gfv_targets[i] = $("#"+input[0]);
		
		// 해당 CODE_ID에 해당하는 값을 가져오기 위해 CODE_ID,CODE_ID,CODE_ID 형태로 변경 (MessageServiceImpl에서 In 조건에 들어갈 수 있도록 변경함)
		// 여기서 'CODE_ID','CODE_ID' 형태로 만들게되면, HTMLTagFilter에 의해 ' 등의 문자가 깨짐
		message += input[1]+",";
	}
	message = message.substring(0,message.length-1);
	
	for(var i=0; i<gfv_targets.length; i++){
		if((gfn_isNull(gfv_targets[i]) == false && gfn_isNull(gfv_targets[i].val())) == false){
			isValid = true;
			break;
		}
	}
	if(isValid == false){
		var comAjax = new ComAjax();
		comAjax.addParam("CODE_ID", message);
		comAjax.setUrl('/cmm/selectCodeNameList.do');
		comAjax.setCallBack("gfv_isValidInParamsCallback");
		comAjax.tran();
	}
	return gfv_isValid;
}

/********************************************
@함수명  	gfv_isValidInParamsCallback
@설명   	gfn_isValidInParams 콜백 함수
@인자   	json data
@반환    	없음
@작성일  	2014. 7. 25.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 25.		              최초작성
*********************************************/
function gfv_isValidInParamsCallback(data){
	var message = "@";
	$.each(data, function(key,value){
		$.each(value, function(key,value){
			message += value.CODE_NAME+", ";
		});
	});
	message = message.substring(0,message.length-2);
	var objParams = {
		param : message	
	};
	gfn_alert("PORTAL_ALERT05", objParams, function(){
		gfv_targets[0].focus();
	});
	gfv_isValid = false;
}

/********************************************
@함수명  	gfn_isValidLength
@설명   	입력값이 지정된 길이를 초과하는지 체크하고 메시지 출력, 포커스를 준다. (byte단위, 한글은 2byte로 처리)
@인자   	String params
@입력형태 	id=길이=CODE_ID | id=길이=CODE_ID | id=길이=CODE_ID
@반환    	true (모든 입력값이 지정된 길이 이내인 경우),
		  	false (입력값 중 하나라도 지정된 길이를 초과하는 경우)
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
2014. 7. 25.	      		  DB 메시지 key(CODE_ID)를 받도록 수정
2014. 7. 25.	      		  함수명 변경 (gfn_isLenghOver -> gfn_isValidLength)
*********************************************/
/* nVarchar 형태의 데이터 크기 검토 필요 */
function gfn_isValidLength(params){
	gfv_isValid = true;
	gfv_target = "";
	params = gfn_trim(params);
	
	var param = params.split('|');
	for(var i=0; i<param.length; i++){
		var input = param[i].toString().split('=');
		if(input.length == 3){
			gfv_target = $("#"+input[0]);
			var length = input[1];
			var message = input[2];
			var value = gfv_target.val();
			if(gfn_isNull(gfv_target) == false && gfn_isNull(value) == false){
				var size = 0;
				for(var j=0; j<value.length; j++){
					if((gfn_isEnglishAndNumber(value.charAt(j)) == true) || gfn_isSpecialChar(value.charAt(j)) == true){
						size += 1;
					}
					else{
						size += 2;
					}
				}
				if(size > length){
					gfv_isValid = false;
					var objParam = {
						param : message,
						param1 : "@"+length
					};
					gfn_alert("PORTAL_ALERT06", objParam, function(){
						gfv_target.focus();
					});
					return false;
				}
			}
		}
	}
	return gfv_isValid;
}
/********************************************
@함수명  	gfn_isValidStringLength
@설명   	입력값이 지정된 길이를 초과하는지 체크하고 메시지 출력, 포커스를 준다. (글자수로 처리)
@인자   	String params
@입력형태 	id=길이=CODE_ID | id=길이=CODE_ID | id=길이=CODE_ID
@반환    	true (모든 입력값이 지정된 길이 이내인 경우),
		  	false (입력값 중 하나라도 지정된 길이를 초과하는 경우)
@작성일  	2014. 11. 04.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014.11. 04.	              최초작성
*********************************************/
function gfn_isValidStringLength(params){
	gfv_isValid = true;
	gfv_target = "";
	params = gfn_trim(params);
	
	var param = params.split('|');
	for(var i=0; i<param.length; i++){
		var input = param[i].toString().split('=');
		if(input.length == 3){
			gfv_target = $("#"+input[0]);
			var length = input[1];
			var message = input[2];
			var value = gfv_target.val();
			if(gfn_isNull(gfv_target) == false && gfn_isNull(value) == false){
				var size = value.length;
				
				if(size > length){
					gfv_isValid = false;
					var objParam = {
						param : message,
						param1 : "@"+length
					};
					gfn_alert("PORTAL_ALERT06", objParam, function(){
						gfv_target.focus();
					});
					return false;
				}
			}
		}
	}
	return gfv_isValid;
}
/********************************************
@함수명  	gfn_isValidMinMaxLength
@설명   	입력값이 지정된 길이를 초과하는지 체크하고 메시지 출력, 포커스를 준다. (byte단위, 한글은 2byte로 처리)
@인자   	String params
@입력형태 	id=최소=최대=CODE_ID | id=최소=최대=CODE_ID | id=최소=최대=CODE_ID
@반환    	true (모든 입력값이 지정된 길이 이내인 경우),
		  	false (입력값 중 하나라도 지정된 길이를 초과하는 경우)
@작성일  	2014.08.27.
@작성자  	      
@변경일		변경자        변경내역 
<br>--------------------------------------------<br>
2014.08.27.	              최초작성
 *********************************************/
/* nVarchar 형태의 데이터 크기 검토 필요 */
function gfn_isValidMinMaxLength(params){
	gfv_isValid = true;
	gfv_target = "";
	params = gfn_trim(params);
	
	var param = params.split('|');
	for(var i=0; i<param.length; i++){
		var input = param[i].toString().split('=');
		if(input.length == 4){
			gfv_target = $("#"+input[0]);
			var min = input[1];
			var max = input[2];
			var message = input[3];
			var value = gfv_target.val();
			if(gfn_isNull(gfv_target) == false && gfn_isNull(value) == false){
				var size = 0;
				for(var j=0; j<value.length; j++){
					if(gfn_isKorean(value.charAt(j)) == true)
						size += 2;
					else
						size += 1;
				}
				if(size > max ||size < min ){
					gfv_isValid = false;
					var messages = message.toString().split('^');
					var objParams = {
							param : messages[1],
							param1 : "@"+min,
							param2 : "@"+max
					};
					gfn_alert(messages[0], objParams, function(){
						gfv_target.focus();
					});
					return false;
				}
			}
		}
	}
	return gfv_isValid;
}

/********************************************
@함수명  	gfn_isValidPasswd
@설명   	입력된 비밀번호의 유효성을 검사
@인자   	String params
@입력형태 	params = 입력값
@반환    	true (입력값이 유효성에 맞을 경우),
		  	false (입력이 유효성에 해당하지 않을 경우)
@작성일  	2014.09.22.
@작성자  	      
@변경일		변경자        변경내역 
<br>--------------------------------------------<br>
2014.09.22.	              최초작성
 *********************************************/
function gfn_isValidPasswd(params){
    if(!params.match(/(^[a-zA-Z0-9]+[!,@,#,$,%,^,&,*,?,_,~]+$)|(^[!,@,#,$,%,^,&,*,?,_,~]+[a-zA-Z0-9]+$)|(^[a-zA-Z0-9]+[!,@,#,$,%,^,&,*,?,_,~]+[a-zA-Z0-9]+$)|(^[!,@,#,$,%,^,&,*,?,_,~]+[a-zA-Z0-9]+[!,@,#,$,%,^,&,*,?,_,~]+$)/)){
        return false;
    }else{
    	if(params.length > 9 || 20 < params.length ){
    		return true;
    	}else{
    		return false;
    	}
    }
}

/********************************************
@함수명  	gfn_isValidID
@설명   	입력된 ID의 유효성을 검사
@인자   	String params
@입력형태 	params = 입력값
@반환    	true (입력값이 유효성에 맞을 경우),
		  	false (입력이 유효성에 해당하지 않을 경우)
@작성일  	2014.09.22.
@작성자  	      
@변경일		변경자        변경내역 
<br>--------------------------------------------<br>
2014.09.22.	              최초작성
 *********************************************/
function gfn_isValidID(params){
	if(!params.match(/([a-z]+[0-9]+)/)){
		return false;
	}else{
		if(params.length > 3 || 20 < params.length ){
			return true;
		}else{
			return false;
		}
	}
}

/********************************************
@함수명  	gfn_isValidHpg
@설명   	홈페이지 주소 형식의 유효성을 체크한다.
@인자   	String str
@반환    	false (홈페이지 주소 형식이 유효한 경우),
		  	true (홈페이지 주소 형식이 유효하지 경우)
@작성일  	2014.10.09.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014.10. 09.	              최초작성
*********************************************/
function gfn_isValidHpg(str){
	if(gfn_isNull(str))
		return str;
	var reg = /^[0-9a-zA-Z]*[.]+[a-zA-Z]+/i;
	return reg.test(str) ? true : false;
}
