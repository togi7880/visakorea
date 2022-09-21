/********************************************
@함수명  	gfn_isNumber
@설명   	입력한 문자열이 숫자로 구성되어 있는지 체크한다.
@인자   	String str
@반환    	true (문자열이 모두 숫자로 구성되어 있는 경우),
		  	false (문자열에 숫자 외의 문자가 있는 경우)
@작성일  	2014. 5. 13.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	            최초작성
*********************************************/
function gfn_isNumber(str){
	if(gfn_isNull(str) == true)
		return str;
	
	var reg = /[^0-9]/g;
	return reg.test(str) ? false : true;
}

/********************************************
@함수명  	gfn_isNumberOnly
@설명   		입력한 문자열이 숫자로 구성되어 있는지 체크한다.
@인자   		String str
@반환    	true 숫자가 아닌경우
		  	false 숫자인 경우
@작성일  	2018. 03. 09.
@작성자  	박상용
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2018. 03. 09.   박상용      	 최초작성
*********************************************/
function gfn_isNumberOnly(VAL){
	
	var value = $("#"+VAL).val();
	var reg = /[^0-9]/g;
	
	if(gfn_isNull(value) == false && reg.test(value) == true){
		gfn_alert("INPUT_NUMBER_ONLY",{
		}, function(){					
			$("#"+VAL).focus();
		});
		$("#"+VAL).val("");
		$("#"+VAL).focus();
		return;
	}
}
		
	
	

