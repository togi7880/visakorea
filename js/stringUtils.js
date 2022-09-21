/********************************************
@함수명  	gfn_trim
@설명   	문자열 내의 공백을 제거한다.
@인자   	String str
@반환    	공백이 제거된 문자열
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_trim(str){
	if(gfn_isNull(str))
		return str;
	str = str.replace(/\s*/g, "");
	return str;
}

/********************************************
@함수명  	gfn_trimSpecialChar
@설명   	문자열 내의 특수문자를 제거한다.
@인자   	String str
@반환    	특수문자가 제거된 문자열
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_trimSpecialChar(str){
	if(gfn_isNull(str))
		return str;
	str = str.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,""); 
	return str;
}

/********************************************
@함수명  	gfn_isEnglish
@설명   	입력한 문자열이 영문(공백 포함_옵션에 따라)으로 구성되어 있는지 체크한다.
@인자   	String str, Boolean isIncludeSpace(공백포함여부)
@입력형태 	문자열, true or false
@반환    	true (문자열이 모두 영문으로 구성되어 있는 경우),
		  	false (문자열에 영문 외의 문자가 있는 경우)
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_isEnglish(str, isIncludeSpace) {
	if(gfn_isNull(str))
		return str;
	
	var reg = (isIncludeSpace == true) ? /[^a-zA-Z\s]/g : /[^a-zA-Z]/g;  
	
	return reg.test(str) ? false : true;
}
	
/********************************************
@함수명  	gfn_isKorean
@설명   	입력한 문자열이 한글(공백 포함_옵션에 따라)로 구성되어 있는지 체크한다.
@인자   	String str, Boolean isIncludeSpace(공백포함여부)
@입력형태 	문자열, true or false
@반환    	true (문자열이 모두 한글로 구성되어 있는 경우),
		  	false (문자열에 한글 외의 문자가 있는 경우)
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_isKorean(str, isIncludeSpace) {
	if(gfn_isNull(str))
		return str;
	var reg = (isIncludeSpace == true) ? /[^ㄱ-힣\s]/g : /[^ㄱ-힣]/g;  
	
	return reg.test(str) ? false : true;
}

/********************************************
@함수명  	gfn_isEnglishAndNumber
@설명   	입력한 문자열이 영문과 숫자(공백 포함)로 구성되어 있는지 체크한다.
@인자   	String str
@반환    	true (문자열이 영문과 숫자만으로 구성되어 있는 경우),
		  	false (문자열에 영문과 숫자 외의 문자가 있는 경우)
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_isEnglishAndNumber(str){
	if(gfn_isNull(str)) 
		return str;
	var reg = /[^a-zA-Z\s0-9]/g;
	return reg.test(str) ? false : true;
}

/********************************************
@함수명  	gfn_isSpecialChar
@설명   	입력한 문자열이 특수문자로 구성되어 있는지 체크한다.
@인자   	String str
@반환    	true (문자열이 특수문자만으로 구성되어 있는 경우),
		  	false (문자열에 특수문자 외의 문자가 있는 경우)
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_isSpecialChar(str){
	if(gfn_isNull(str))
		return str;
	var reg = /[^\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/;
	return reg.test(str) ? false : true;
}

/********************************************
@함수명  	gfn_toUpper
@설명   	대문자로 변환한다.
@인자   	String str
@반환    	대문자로 변환된 문자열
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_toUpper(str){
	if(gfn_isNull(str))
		return str;
	str = str.toUpperCase();
	return str;
}

/********************************************
@함수명  	gfn_toLpper
@설명   	소문자로 변환한다.
@인자   	String str
@반환    	소문자로 변환된 문자열
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_toLower(str){
	if(gfn_isNull(str))
		return str;
	str = str.toLowerCase();
	return str;
}


/********************************************
@함수명  	gfn_isExistInArray
@설명   	배열에 해당 값이 존재하는지 검사한다.
@인자   	Array arrVal, String varVal
@반환    	true : 값이 존재하는 경우
			false : 값이 존재하지 않는 경우
@작성일  	2014. 6. 18.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 18.		              최초작성
*********************************************/
function gfn_isExistInArray(arrVal, varVal) {
	for(var i=0; i<arrVal.length; i++) {
		if(arrVal[i] == varVal){
			return true;
		}
	}
	return false;
}

/********************************************
@함수명  	gfn_isEnglishSmallAndNumber
@설명   	입력한 문자열이 영문(소문자)과 숫자(공백 포함)로 구성되어 있는지 체크한다.
@인자   	String str
@반환    	true (문자열이 영문과 숫자만으로 구성되어 있는 경우),
		  	false (문자열에 영문과 숫자 외의 문자가 있는 경우)
@작성일  	2014.09.02.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014.09.02.		              최초작성
*********************************************/
function gfn_isEnglishSmallAndNumber(str){
	if(gfn_isNull(str)) 
		return str;
	var reg = /[^a-z\s0-9]/g;
	return reg.test(str) ? false : true;
}

/********************************************
@함수명  	gfn_isEnglishAndNumberAndSpae
@설명   	입력한 문자열이 영문(소문자)과 숫자(공백 포함)와 특수문자로(!@#$%^*+=-) 구성되어 있는지 체크한다.
@인자   	String str
@반환    	true (문자열이 영문과 숫자만으로 구성되어 있는 경우),
		  	false (문자열에 영문과 숫자 외의 문자가 있는 경우)
@작성일  	2014.09.02.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014.09.02.		              최초작성
 *********************************************/
function gfn_isEnglishAndNumberAndSpae(str){
	if(gfn_isNull(str)) 
		return str;
	var reg =  /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,20}$/;
	return reg.test(str) ? true : false;
}