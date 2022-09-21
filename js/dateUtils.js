/********************************************
@함수명  	gfn_openCalendar
@설명   	달력을 호출한다.
@인자   	날짜가 입력될 text id
@반환    	없음
@작성일  	2014. 6. 4.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 4.				        최초작성
*********************************************/
function gfn_openCalendar(strInputId){
	if(gfn_isNull(strInputId) == false){
		$("#"+strInputId).datepicker({
			changeYear: true,
			changeMonth: true,
			dateFormat:"yymmdd",
			duration:200,
			showAnim:'show',
			showMonthAfterYear: true,
			showOtherMonths: true
		});
	}
}

/********************************************
@함수명  	gfn_openBtnCalendar
@설명   	버튼이 포함된 달력을 호출한다.
@인자   	날짜가 입력될 text id
@반환    	없음
@작성일  	2014. 6. 4.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 4.				        최초작성
*********************************************/
function gfn_openBtnCalendar(strInputId){
	if(gfn_isNull(strInputId) == false){		
		$("#"+strInputId).datepicker({
			monthNamesShort:['1','2','3','4','5','6','7','8','9','10','11','12'],
			changeYear: true,
			changeMonth: true,
			dateFormat:"yy-mm-dd",
			duration:200,
			showAnim:'show',
			showMonthAfterYear: true,
			showOn:"button",
			buttonImageOnly: true,
			buttonImage:"/images/ico/ico_calendar.gif", 
			showMonthAfterYear: true,
			showOtherMonths: true,
			yearRange:"1900:+50",
			buttonText:"날짜선택"
		});
	}
}

/********************************************
@함수명  	gfn_isLeapYear
@설명   	입력된 년도의 윤년 여부를 체크한다.
@인자   	String year
@반환    	true (입력된 년도가 윤년인 경우),
			false (입력된 년도가 윤년이 아닌 경우)
@작성일  	2014. 5. 13.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br> 
 2014. 5. 13.			        최초작성
*********************************************/
function gfn_isLeapYear(year){
	return (year % 4 == 0 && (year%100 != 0 || year % 400 == 0)) ? true : false;
}

/********************************************
@함수명  	gfn_getMaximumDate
@설명   	입력된 달의 마지막 날을 반환한다.
@인자   	String year, String month
@반환    	입력된 달의 마지막 날을 반환한다.
@작성일  	2014. 5. 13.
@작성자  
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.			        최초작성
2017. 5.  4.    				  0월에 0일만 등록 되도록 추가
*********************************************/
function gfn_getMaximumDate(year,month){
	if(gfn_isNull(year) == true || gfn_isNull(year) == true)
		return null;
	var maximumDateOfMonth = new Array(31,0,31,30,31,30,31,31,30,31,30,31);
	maximumDateOfMonth[1] = (gfn_isLeapYear(year)) ? 29 : 28;
	return maximumDateOfMonth[--month];
}

/********************************************
@함수명  	gfn_isValidDate
@설명   	입력된 날짜가 유효한 형식인지 검사한다.
@인자   	String date
@입력형태 	YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD 등 모든 날짜형식 (년도 : 4자리, 월/일 : 2자리, 특수문자 포함 가능)
@반환    	true (입력된 날짜가 유효한 형식인 경우)
			false (입력된 날짜가 잘못된 형식인 경우)
@작성일  	2014. 5. 13.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.			        최초작성
*********************************************/
function gfn_isValidDate(date){
	if(gfn_isNull(date) == true)
		return date;
	
	date = gfn_trimSpecialChar(date);
	if(date.length != 8) 
		return false;
	if(gfn_isNumber(date) == false) 
		return false;
	
	var year = date.substr(0,4);
	var month = date.substr(4,2);
	var day = date.substr(6,2);
	if(month < 1 || month > 12) 
		return false;
	if(Number(day) < 1 || Number(day) > Number(gfn_getMaximumDate(year, month)))
		return false;
	
	return true;
}

/********************************************
@함수명  	gfn_isValidDate1
@설명   	입력된 날짜가 유효한 형식인지 검사한다. + 00월 00일 가능 한 함수
@인자   	String date
@입력형태 	YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD 등 모든 날짜형식 (년도 : 4자리, 월/일 : 2자리, 특수문자 포함 가능)
@반환    	true (입력된 날짜가 유효한 형식인 경우)
			false (입력된 날짜가 잘못된 형식인 경우)
@작성일  	2017. 05. 04.
@작성자   
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2017. 05. 04.			        최초작성
*********************************************/
function gfn_isValidDate1(date){
	if(gfn_isNull(date) == true)
		return date;
	
	date = gfn_trimSpecialChar(date);
	if(date.length != 8) 
		return false;
	if(gfn_isNumber(date) == false) 
		return false;
	
	var year = date.substr(0,4);
	var month = date.substr(4,2);
	var day = date.substr(6,2);
	
	if(month < 0 || month > 12) 
		return false;
	if(month > 0 && (Number(day) < 1 || Number(day) > Number(gfn_getMaximumDate(year, month)))){
		return false;
	}else if(Number(month) == 0 && Number(day) != 0){
		return false;
	}
		
	
	return true;
}

/********************************************
@함수명  	gfn_isValidFromToDate
@설명   	입력된 값이 유효한 날짜형식인지 체크하고, 시작날짜가 종료날짜보다 빠른지 검사한다.
@인자   	String from, String to
@입력형태 	YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD 등 모든 날짜형식 (년도 : 4자리, 월/일 : 2자리, 특수문자 포함 가능)  
@반환    	true (시작날짜가 종료날짜보다 빠른 경우),
			false (유효하지 않은 날짜 형식이거나 시작날짜가 종료날짜보다 느린 경우)
@작성일  	2014. 5. 13.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.			        최초작성
*********************************************/
function gfn_isValidFromToDate(from, to){
	if(gfn_isValidDate(from) == false)
		return false;
	if(gfn_isValidDate(to) == false)
		return false;
	
	return (from <= to) ? true : false;
}

/********************************************
@함수명  	gfn_addDate
@설명   	기준 날짜에서 일 단위로 가감한다.
@인자   	String currentDate, String addDate
@입력형태 	currentDate : YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD 등 모든 날짜형식 (년도 : 4자리, 월/일 : 2자리, 특수문자 포함 가능),
@  			addDate : 숫자(양수, 음수 모두 사용 가능)
@반환    	가감되어 변경된 날짜
@작성일  	2014. 5. 13.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.			        최초작성
*********************************************/
function gfn_addDate(currentDate, addDate){
	if(gfn_isNull(currentDate) == true)
		return currentDate;
	currentDate = gfn_trimSpecialChar(currentDate);
	if(gfn_isValidDate(currentDate) == false)
		return currentDate;
	if(gfn_isNumber(Math.abs(addDate)) == false)
		return currentDate;
	
	var year = String(currentDate).substr(0,4);
	var month = String(currentDate).substr(4,2);
	var date = String(currentDate).substr(6,2);
	var current = new Date(year, month-1, date);
	var newDate = current.getTime() + (1000*60*60*24*addDate);
	current.setTime(newDate);
	
	year = current.getFullYear();
	
	var currentMonth = current.getMonth() + 1;	
	month = (String(currentMonth).length == 1) ? "0"+currentMonth : currentMonth;
	
	date = (String(current.getDate()).length == 1) ? "0"+current.getDate() : current.getDate();
	return year+"-"+month+"-"+date;
}

/********************************************
@함수명  	gfn_addMonth
@설명   	기준 날짜에서 월 단위로 가감한다.
@인자   	String currentDate, String addMonth
@입력형태 	currentDate : YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD 등 모든 날짜형식 (년도 : 4자리, 월/일 : 2자리, 특수문자 포함 가능),
@  			addMonth : 숫자(양수, 음수 모두 사용 가능)
@반환    	가감되어 변경된 날짜
@작성일  	2014. 7. 3.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 3.				        최초작성
*********************************************/
function gfn_addMonth(currentDate, addMonth){
	currentDate = gfn_trimSpecialChar(currentDate);
	
	if(gfn_isValidDate(currentDate) == false)
		return null;
	if(gfn_isNumber(Math.abs(addMonth)) == false)
		return null;
	
	var year = parseInt(currentDate.substr(0,4), 10);
	var month = parseInt(currentDate.substr(4,2), 10);
	var date = parseInt(currentDate.substr(6,2), 10);
	
	if(addMonth >= 0){
		year += ((month + addMonth) > 12) ? parseInt((month + addMonth) / 12) : 0;
		month = ((month + addMonth) > 12) ? (month+addMonth) % 12 : month+addMonth;
		date = (gfn_getMaximumDate(year, month) < date) ? gfn_getMaximumDate(year, month) : date;
	}
	else{
		if(Math.abs(addMonth) % 12 >= month){
			year -= parseInt((Math.abs(addMonth) / 12)) + 1;
		}
		if(month + addMonth > 0){
			month = month + addMonth;
		}
		else{
			month = 12 - parseInt(Math.abs(month + addMonth) % 12) > 0 ? 12 - parseInt(Math.abs(month + addMonth) % 12) : 12; 
		}
		date = (gfn_getMaximumDate(year, month) < date) ? gfn_getMaximumDate(year, month) : date;
	}
	month = (month.toString().length == 1) ? "0"+month : month;
	date = (date.toString().length == 1) ? "0"+date : date;
	
	return year+"-"+month+"-"+date;
}

/********************************************
@함수명  	gfn_addYear
@설명   	기준 날짜에서 년 단위로 가감한다.
@인자   	String currentDate, String addYear
@입력형태 	currentDate : YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD 등 모든 날짜형식 (년도 : 4자리, 월/일 : 2자리, 특수문자 포함 가능),
@  			addYear : 숫자(양수, 음수 모두 사용 가능)
@반환    	가감되어 변경된 날짜
@작성일  	2014. 7. 3.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 3.				        최초작성
*********************************************/
function gfn_addYear(currentDate, addYear){
	currentDate = gfn_trimSpecialChar(currentDate);
	if(gfn_isValidDate(currentDate) == false)
		return null;
	if(gfn_isNumber(Math.abs(addYear)) == false)
		return null;
	
	var year = currentDate.substr(0,4);
	var month = currentDate.substr(4,2);
	var date = currentDate.substr(6,2);
	
	if((parseInt(year)+parseInt(addYear)) < 0)
		return null;

	return (parseInt(year)+parseInt(addYear))+"-"+month+"-"+date; 
	//return (year+addYear)+"-"+month+"-"+date; 
}

/********************************************
@함수명  	gfn_setDateVal
@설명   	달력 input 값 설정
@인자   	String strElementId : input id명 
			String strDateValue : 설정 값 ex)99991231
@작성일  	2014. 7. 2.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 2.				        최초작성
 *********************************************/
function gfn_setDateVal(strInputId, strDateValue){
	if(gfn_isNull(strInputId) == true || gfn_isNull(strDateValue) == true)
		return null;
	ib("#" + strInputId).getMaskedit().SetValue(strDateValue);
}

/********************************************
@함수명  	gfn_getDateVal
@설명   	달력 input 값 호출(- 제외)
@인자   	String strInputId : input id명 
@작성일  	2014. 7. 2.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 2.				        최초작성
 *********************************************/
function gfn_getDateVal(strInputId){
	var val = $("#"+strInputId).val();
	if(gfn_isNull(val) == true)
		return "";
	return gfn_trimSpecialChar($("#"+strInputId).val());
	
	/*return ib("#" + strInputId).getMaskedit().GetValue();*/
}

/********************************************
@함수명  	gfn_getDateText
@설명   	달력 input 값 호출
@인자   	String strInputId : input id명 
@작성일  	2014. 11. 05.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 11. 05.			        최초작성
 *********************************************/
function gfn_getDateText(strInputId){
	var val = $("#"+strInputId).val();
	if(gfn_isNull(val) == true)
		return "";
	
	return ib("#" + strInputId).getMaskedit().GetText();
}

