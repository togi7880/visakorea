/********************************************
@함수명  	gfn_isNull
@설명   	입력값이 Null이거나 빈값인지 체크한다.
@인자   	String str
@반환    	true (입력값이 Null인 경우),
			false (입력값이 Null이 아닌 경우)
@작성일  	2014. 5. 01.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 01.			        최초작성
*********************************************/
function gfn_isNull(str) {		
    if (new String(str).valueOf() == "undefined") return true;    
    if (str == null) return true;
    if (str == "null") return true;
    var v_ChkStr = new String(str);
    if ("x"+str == "xNaN") return true;    
    if( v_ChkStr.valueOf() == "undefined" ) return true;
    if( v_ChkStr.valueOf() == "null" ) return true;
    if (v_ChkStr == null) return true;    
    if (v_ChkStr.toString().length == 0 ) return true;   
    return false; 
}

/********************************************
@함수명  	gfn_getTrimmedName
@설명   	공백 및 특수문자 제거, 대문자로 변환된 문자열을 반환한다.
				- 대문자로 변환
				- 특수문자 제거
				- 문자열 앞뒤 공백 제거
				- 문자열이 영문자와 숫자로 구성되어있는 경우, 2개 이상의 공백을 1개로 변환
				- 문자열이 영문자와 숫자 외의 문자도 포함되어 있는 경우, 모든 공백을 제거
@인자   	String str
@반환    	str(공백 및 특수문자 제거, 대문자로 변환된 문자열)
@작성일  	2014. 5. 13.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.			        최초작성
*********************************************/
function gfn_getTrimmedName(str){
	if(gfn_isNull(str))
		return str;
	
	str = gfn_toUpper(str); //대문자로 변환
	str = gfn_trimSpecialChar(str); //특수문자 제거
	str = str.replace(/(^\s*)|(\s*$)/gi, ""); //앞뒤 공백 제거
	str = (gfn_isEnglishAndNumber(str) == true) ? str.replace(/\s{2,}/g," ") : str.replace(/\s*/g,""); //영문과 숫자로 되어있는지 체크
	  
	return str;
}

/********************************************
@함수명  	gfn_getThumbnail
@설명   	이미지 미리보기를 한다.
@인자   	String fileId, String imageId
@입력형태 	fileId : <input type="file"/> 의 ID
			imageId : <img src=""/> 의 ID
@반환    	없음
@작성일  	2014. 7. 7.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 7.				        최초작성
*********************************************/
function gfn_getThumbnail(fileId, imageId){
	
	var file = $("#"+fileId)[0];
	
	if(gfn_isNull(file.files) == false){ // HTML5 지원 브라우저 (IE10 이상)
		var files = file.files[0];
		if(files != null)
		{
			var fileExtension = files.name.substring(files.name.lastIndexOf(".")+1).toLowerCase();
			var _extensions = ["jpg","bmp"];
			if(gfn_isExistInArray(_extensions, fileExtension) == true){
				var oFReader = new window.FileReader();
				oFReader.readAsDataURL(files);
				oFReader.onload = function (oFREvent){
					$("#"+imageId).attr("src",oFREvent.target.result);
				};
			}
			else{
				var params = {
					param : "@증명사진",
					param1 : "@jpg, bmp"
				};
				gfn_alert("JSM-1024",params);
			}
		}
		// file 오브젝트에 files 항목이 없을경우 - name 에서 null check no-image setting
		else
		{
			var parent = $("#"+imageId).parent();
			var frm = $("#formFile");
			frm.append(file);
			frm.ajaxSubmit({
				url : '/cmm/getThumbnail.do',
				data : frm.serialize(),
				async : false,
				success : function(data){
					$("#"+imageId).attr("src","images/contents/no_image.gif");
					parent.append($("#"+fileId));
				},
				error : function(){
					parent.append($("#"+fileId));
				}
			});
		}
	}
	else{ // IE9 이하
			
		var fileName = file.value;
		var fileExtension = fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();

		// fileName 및 fileExtension 이 널일경우 -> noimage 셋팅을 위한 분기처리 
		if(fileName != null && fileName != '' && fileExtension != null && fileExtension != ''){
		var _extensions = ["jpg","bmp"];
		
		if(gfn_isExistInArray(_extensions, fileExtension) == true){
				var parent = $("#"+imageId).parent();
				var frm = $("#formFile");
				frm.append(file);
				frm.ajaxSubmit({
					url : '/cmm/getThumbnail.do',
					data : frm.serialize(),
					async : false,
					success : function(data){
						$("#"+imageId).attr("src","/cmm/getThumbnail.do");
						parent.append($("#"+fileId));
					},
					error : function(){
						parent.append($("#"+fileId));
					}
				});
			}
			else{
				var params = {
					param : "@증명사진",
					param1 : "@jpg, bmp"
				};
				gfn_alert("JSM-1024",params);
			}
		}
		// image file null일 경우 no_image setting 
		else{
			var parent = $("#"+imageId).parent();
			var frm = $("#formFile");
			frm.append(file);
			frm.ajaxSubmit({
				url : '/cmm/getThumbnail.do',
				data : frm.serialize(),
				async : false,
				success : function(data){
					$("#"+imageId).attr("src","images/contents/no_image.gif");
					parent.append($("#"+fileId));
				},
				error : function(){
					parent.append($("#"+fileId));
				}
			});
		}
  }
}

/********************************************
@함수명  	gfn_openAddressPop
@설명   	주소조회팝업 호출 함수
@인자   	
@작성일  	2014. 7. 01.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 01.			        최초작성
*********************************************/

function gfn_openAddressPop(obj){
	var objParams = obj;
	var strFile = "/biz/cm/cp/CMCP01P"; //호출할 파일 경로 설정
	var strPopName="addrSearchPop"; //팝업 명 설정
	gfn_openPopUp(strFile,strPopName,objParams,"800","700"); //공통 팝업 호출
}

/********************************************
@함수명  	gfn_openNatPop
@설명   	국가조회팝업 호출 함수
@인자   	
@작성일  	2014. 7. 01.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 01.			        최초작성
*********************************************/
function gfn_openNatPop(obj){
	var objParams = obj;
	var strFile = "/biz/cm/cp/CMCP03P"; //호출할 파일 경로 설정
	var strPopName="natSearchPop"; //팝업 명 설정
	gfn_openPopUp(strFile,strPopName,objParams,"650","700"); //공통 팝업 호출
}

/********************************************
@함수명  	gfn_openJobPop
@설명   	종목(업종) 조회팝업 호출 함수
@인자   	
@작성일  	2014. 7. 01.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 01.			        최초작성
*********************************************/
function gfn_openJobPop(obj){
	var objParams = obj;
	var strFile = "/biz/cm/cp/CMCP02P"; //호출할 파일 경로 설정
	var strPopName="jobSearchPop"; //팝업 명 설정
	gfn_openPopUp(strFile,strPopName,objParams,"600","700"); //공통 팝업 호출
}

/********************************************
@함수명  	gfn_openOfficePop
@설명   	공관조회 팝업
@인자   	
@작성일  	2014.08.25.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014.08.25.				        최초작성
 *********************************************/
function gfn_openOfficePop(obj){
	var objParams = obj;
	var strFile = "/biz/cm/cp/CMCP04P"; //호출할 파일 경로 설정
	var strPopName="officeSearchPop"; //팝업 명 설정
	gfn_openPopUp(strFile,strPopName,objParams,"600","630"); //공통 팝업 호출
}

/********************************************
@함수명  	gfn_stayQualificationPop
@설명   	체류자격 팝업
@인자   	
@작성일  	2014.08.25.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014.08.25.				        최초작성
 *********************************************/
function gfn_stayQualificationPop(obj){
	var objParams = obj;
	var strFile = "/biz/cm/cp/CMCP05P"; //호출할 파일 경로 설정
	var strPopName="staySearchPop"; //팝업 명 설정
	gfn_openPopUp(strFile,strPopName,objParams,"600","630"); //공통 팝업 호출
}

/********************************************
@함수명  	gfn_getMrpBaseYear
@설명   	여권 판독시 생년월일 년도 기준 리턴
@인자   	String : YYYY 의 뒷 2자리
@작성일  	2014. 7. 24.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 24.			        최초작성

 * 1. 대상 : 접수, 심사
 *
 * 2. 처리로직 : 변수값은 업무의 접수 또는 심사 화면에서 입력합니다. 
 *  1) 여권판독시 생년월일 ( '130513' ) 의 앞의 2자리 년도 기준('13')으로 현서버 년도 뒷 2자리와 
 *   같거나 작으면 앞2자리에 '20'을 붙여 '2013'으로 리턴
 *  
 *  2) 여권판독시 생년월일 ( 790513 ) 의 앞의 2자리 년도 기준('79')으로 현서버 년도 뒷 2자리보다
 *   크면 앞2자리에 '19'을 붙여 '1979'으로 리턴
 *   
 * 3. 기준 : 현 법무부 여권 판독시 사용되는 기준임
 ***********************************************/
function gfn_getMrpBaseYear(val){
	
	var strVal = val.substring(0,2);
	
	var strDate = gfv_currentDate; // 서버 yyyymmdd
	var strDateYY = strDate.substring(2,4);
	
	var strReturnYYYY = '';
	
	if(strVal <= strDateYY){
		strReturnYYYY = '20' + strVal;   
	}
	else {
		strReturnYYYY = '19' + strVal;
	}
	
	return strReturnYYYY;
}

/********************************************
@함수명  	isValidExtenstion
@설명   	첨부파일의 확장자가 올바른지 검사한다.
@인자   	Object obj, Array extensions
@반환    	true or false
@작성일  	2014. 9. 17.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 17.			        최초작성
*********************************************/
function gfn_isValidExtenstion(obj, extensions){
	var fileName = obj.val();
	if(fileName.lastIndexOf(".") < 0){
		gfn_alert("INVALID_FILE_EXTENSION_NOPARAM", null, function(){
			return false;
		});
	}
	var extension = fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();
	return gfn_isExistInArray(extensions, extension);
}

/********************************************
@함수명  	gfn_getBrowserType
@설명   	브라우저의 버전 정보를 확인한다.
@인자   	없음
@반환    	브라우저 버전 정보
@작성일  	2014. 9. 18.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 18.			        최초작성
*********************************************/
function gfn_getBrowserType(){
	var agent = navigator.userAgent;
     
    //IE 8 ~ 11
    var trident = agent.match(/Trident\/(\d.\d)/i);
    if( trident != null ){
        if( trident[1] == "7.0" ) return rv = "ie" + 11;
        if( trident[1] == "6.0" ) return rv = "ie" + 10;
        if( trident[1] == "5.0" ) return rv = "ie" + 9;
        if( trident[1] == "4.0" ) return rv = "ie" + 8;
    }
    if( navigator.appName == 'Microsoft Internet Explorer' ) return rv = "ie" + 7;
     
    var agt = agent.toLowerCase();
    if (agt.indexOf("chrome") != -1) return 'chrome';
    if (agt.indexOf("opera") != -1) return 'opera'; 
    if (agt.indexOf("firefox") != -1) return 'firefox'; 
    if (agt.indexOf("safari") != -1) return 'safari'; 
    if (agt.indexOf("netscape") != -1) return 'netscape'; 
    if (agt.indexOf("mozilla/5.0") != -1) return 'mozilla';
}
