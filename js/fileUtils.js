var _fileSize = 0;
var _minFileSize = 1; //Kbyte
var _maxFileSize = 1024; //Kbyte
var _totalFileSize = 0;
var _extensions = ["jpg","bmp","JPG","BMP","gif","GIF","pdf","PDF"];
var _extensions1 = ["jpg","bmp","JPG","BMP"];
var _validExtensions = "@jpg,bmp,JPG,BMP,gif,pdf,GIF,PDF";
var _validExtensions1 = "@jpg,bmp,JPG,BMP";
var _sequence = 0;
var _isChanged = "F"; //파일의 추가, 삭제, 변경이 일어났는지를 확인하는 변수, FILE_CHANGE_FLAG라는 이름으로 전송됨.
var _photosize = 0;	 // 파일 사이즈 변경크기 변수
var _sizechange = "F"; // 파일 사이즈 변경 확인 변수

/********************************************
@함수명  	FileUpload
@설명   	첨부서류(단일 업무) 공통함수
@인자   	String formId, String divId
@반환    	없음
@작성일  	2014. 9. 17.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 17.			        최초작성
2014. 12. 22.			        수정
*********************************************/
function FileUpload(formId, divId){
	this.url = "";
	this.formId = formId;
	this.divId = divId;
	this.busiGb = "";
	this.busiKey = "";
	
	this.setUrl = function setUrl(url){
		this.url = url;
	};
	
	/********************************************
	@함수명  	setArguments
	@설명   	최초 조회 시, 해당 업무에 필요한 첨부파일 목록을 조회한다.  
	@인자   	하단 주석 참조
	@반환    	없음
	@작성일  	2014. 7. 14.
	@작성자  	
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 7. 14.			        최초작성
	*********************************************/
	/*
	@sBussGb	       	업무구분	공통	EV, CCVI, INDIV, COMPY, VISA
	@sMemAppl	       	개인, 기업	공통	INDIV, COMPY
	@sRepSojQualCd     	체류코드1	공통	
	@sSubSojQualCd     	체류코드2	공통	
	@sInviteeDiv	   	초청자구분	공통	EVCall, EVInvitee, EVF301 (CCVICall, CCVIInvitee, CCVIF301)
	@sOcptCd	      	직종	    (사발인)	
	@sEntryPurpCd	   	입국목적	(전자사증) 피초청자
	@sBusiKey			업무 키				(TB_PHZ06, TB_PZG02번에서 사용)
	@memberObj      	회원종류 구분 ( COMP_GB 파일종류 호출할 회원구분: E E9고용주,Z 일반기업,U 대학교,P 우대기업,A 유치기관,G 공공기관,M 개인회원,J 국외전담여행사,B 대행기관,K 국내전담여행사)
										MEM_FILE_CALL_GB (I: 신규 , U: 수정, UNOT: 수정이지만 특정 값을 제외) )
	*/
	this.setArguments = function setArguments(sBussGb, sMemAppl, sRepSojQualCd, sSubSojQualCd, sInviteeDiv, sOcptCd, sEntryPurpCd, sBusiKey,memberObj){
		this.busiGb = sInviteeDiv;
		this.busiKey = sBusiKey;
		
		var comAjax = new ComAjax();
		if(gfn_isNull(memberObj)==false){
			comAjax.addParam("COMP_GB", memberObj.COMP_GB);
			comAjax.addParam("MEM_FILE_CALL_GB", memberObj.MEM_FILE_CALL_GB);
		}
		comAjax.addParam("sBussGb", sBussGb);
		comAjax.addParam("sMemAppl", sMemAppl);
		comAjax.addParam("sRepSojQualCd", sRepSojQualCd);
		comAjax.addParam("sSubSojQualCd", sSubSojQualCd);
		comAjax.addParam("sInviteeDiv", sInviteeDiv);
		comAjax.addParam("sOcptCd", sOcptCd);
		comAjax.addParam("sEntryPurpCd", sEntryPurpCd);
		comAjax.addParam("BUSI_GB", sInviteeDiv);
		comAjax.addParam("BUSI_KEY", sBusiKey);
		comAjax.addParam("DIV", this.divId);
		
		comAjax.setUrl("/cmm/getFileList.do");
		comAjax.setCallBack("_setArgumentsCallback");
		comAjax.tran();
	};
	
	/********************************************
	@함수명  	setArguments
	@설명   	최초 조회 시, 해당 업무에 필요한 첨부파일 목록을 조회한다.  
	@인자   	하단 주석 참조
	@반환    	없음
	@작성일  	2014. 7. 14.
	@작성자  	
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 7. 14.			        최초작성
	*********************************************/
	/*
	@sBussGb	       	업무구분	공통	EV, CCVI, INDIV, COMPY, VISA
	@sMemAppl	       	개인, 기업	공통	INDIV, COMPY
	@sRepSojQualCd     	체류코드1	공통	
	@sSubSojQualCd     	체류코드2	공통	
	@sInviteeDiv	   	초청자구분	공통	EVCall, EVInvitee, EVF301 (CCVICall, CCVIInvitee, CCVIF301)
	@sOcptCd	      	직종	    (사발인)	
	@sEntryPurpCd	   	입국목적	(전자사증) 피초청자
	@sBusiKey			업무 키				(TB_PHZ06, TB_PZG02번에서 사용)
	@memberObj      	회원종류 구분 ( COMP_GB 파일종류 호출할 회원구분: E E9고용주,Z 일반기업,U 대학교,P 우대기업,A 유치기관,G 공공기관,M 개인회원,J 국외전담여행사,B 대행기관,K 국내전담여행사)
										MEM_FILE_CALL_GB (I: 신규 , U: 수정, UNOT: 수정이지만 특정 값을 제외) )
	*/
	this.setEmpArguments = function setEmpArguments(sBussGb, sMemAppl, sRepSojQualCd, sSubSojQualCd, sInviteeDiv, sOcptCd, sEntryPurpCd, sBusiKey,memberObj){
		this.busiGb = sInviteeDiv;
		this.busiKey = sBusiKey;
		
		var comAjax = new ComAjax();
		if(gfn_isNull(memberObj)==false){
			comAjax.addParam("COMP_GB", memberObj.COMP_GB);
			comAjax.addParam("MEM_FILE_CALL_GB", memberObj.MEM_FILE_CALL_GB);
		}
		comAjax.addParam("sBussGb", sBussGb);
		comAjax.addParam("sMemAppl", sMemAppl);
		comAjax.addParam("sRepSojQualCd", sRepSojQualCd);
		comAjax.addParam("sSubSojQualCd", sSubSojQualCd);
		comAjax.addParam("sInviteeDiv", sInviteeDiv);
		comAjax.addParam("sOcptCd", sOcptCd);
		comAjax.addParam("sEntryPurpCd", sEntryPurpCd);
		comAjax.addParam("BUSI_GB", sInviteeDiv);
		comAjax.addParam("BUSI_KEY", sBusiKey);
		comAjax.addParam("DIV", this.divId);
		
		comAjax.setUrl("/cmm/getFileList.do");
		comAjax.setCallBack("_setEmpArgumentsCallback");
		comAjax.tran();
	};
	
	/********************************************
	@함수명  	disable
	@설명   	첨부서류를 추가, 삭제, 또는 변경할 수 없도록 한다.  
	@인자   	없음
	@반환    	없음
	@작성일  	2014. 10. 8.
	@작성자  	
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 10. 8.			        최초작성
	*********************************************/
	this.disable = function disable(){
		$("#add_"+this.busiGb).css("display", "none");
		$("#delete_"+this.busiGb).css("display", "none");
		$("input:checkbox[name^='checkbox_']").prop("disabled", true);
		$(".file_input_hidden").css("display", "none");
	};
	
	/********************************************
	@함수명  	setArguments
	@설명   	첨부서류를 추가, 삭제, 또는 변경할 수 있도록 한다.  
	@인자   	하단 주석 참조
	@반환    	없음
	@작성일  	2014. 10. 8.
	@작성자  	 
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 10. 8.			        최초작성
	*********************************************/
	this.enable = function enable(){
		$("#add_"+this.busiGb).css("display", "inline-block");
		$("#delete_"+this.busiGb).css("display", "inline-block");
		$("input:checkbox[name^='checkbox_']").prop("disabled", false);
		$(".file_input_hidden").css("display", "block");
	};
	
	/********************************************
	@함수명  	submit
	@설명   	Form에 있는 모든 내용을 저장한다.  
	@인자   	String type
	@입력형태	TEMP : 임시저장 기능으로 파일의 필수 여부를 검사하지 않고 저장한다.
				REGIST : 첨부파일의 필수 여부를 검사하고 저장한다.
	@반환    	없음
	@작성일  	2014. 7. 14.
	@작성자  	
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 7. 14.			        최초작성
	*********************************************/
	this.submit = function submit(type){
		var isCorrect = true;
		if(type == "REGIST"){
			if($.find(".file_input_hidden").length != 0){ 
				$(".file_input_hidden").each(function(){
					var selectedRow = $(this).parent().parent();
					if(selectedRow.find("input[name^='MUST_YN']").val() == '0'){ //첨부파일이 필수인 경우
						if(gfn_isNull($(this).val()) == true && gfn_isNull(selectedRow.find("input[name^='ELEMENT_ID_']").val()) == true){ //file에 데이터가 없고, ELEMENT_ID가 없는 경우 
							var text = selectedRow.find(".in_block").html();
							var params = {
								param : "@"+text
							};
							gfn_alert("JSM-1023",params);
							isCorrect = false;
							return false;
						}
					}
					var obj = $(this).parent().parent().find($("select[name^='APND_DOC_NO_']"));
					var name = obj.attr("name");
					if(gfn_isNull(name) == false){
						if(gfn_isNull(obj.val()) == true){
							gfn_alert("SELECT_FILE_TYPE");
							isCorrect = false;
							return false;
						}
					}
				});
			}
		}
		if(isCorrect == true){
			if(_totalFileSize <= 15000){
				$('.saving_bar').css("display", "block");
				var frm = $("#"+this.formId);
				frm.append("<input type='hidden' name='BUSI_KEY' id='BUSI_KEY' value='"+this.busiKey+"' />");
				frm.append("<input type='hidden' name='BUSI_GB' id='BUSI_GB' value='"+this.busiGb+"' />");
				frm.append("<input type='hidden' name='FILE_CHANGE_FLAG' value='"+_isChanged+"' />");
				
				frm[0].action = this.url;
				frm[0].method = "post";
				frm[0].enctype = "multipart/form-data";
				frm[0].submit();
			}
			else{
				var params = {
					param : "@"+15
				};
				gfn_alert("EXCEED_TOTAL_LIMT", params);
				return false;
			}
			
		}
	};
}

/********************************************
@함수명  	_setArgumentsCallback
@설명   	첨부파일 목록 조회 후 콜백함수
@작성일  	2014. 9. 16.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 16.			        최초작성
*********************************************/
function _setArgumentsCallback(data){
	var option = "";
	var initListBody = "";
	var storedListBody = "";
	var hasStoredList = false;
	$.each(data, function(key, value){
		if(key == "fileList"){  //해당 업무에 해당하는 모든 파일목록
			$.each(value, function(key, value){
				option += '<option value="'+value.APND_DOC_NO+'">'+value.APND_DOC_NM+'</option>';
				
				initListBody += 
					'<tr>' +
						'<td class="point_td">';
						if(value.MUST_YN == '0'){ //첨부파일이 필수인 경우
							initListBody += '<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택" disabled="disabled"/>' + 
									'<span class="t_point mgl_10">*</span>' +
									'<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' + 
									'<span class="in_block w220">' + value.APND_DOC_NM + '</span>' + 
									'<input type="hidden" id="APND_DOC_NM_'+(_sequence)+'" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>';
						}
						else{ //첨부파일이 필수가 아닌 경우
							initListBody += '<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택" />' + 
									'<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' + 
									'<span class="in_block w230 mgl_15">' + value.APND_DOC_NM + '</span>' +
									'<input type="hidden" id="APND_DOC_NM_'+(_sequence)+'" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>';
						}
						initListBody += '</td>' +
						'<td class="file_body">' +
							'<input type="file" id="files_'+(_sequence)+'" name="files_'+(_sequence)+'" class="file_input_hidden"/>' +
							'<input type="hidden" name="MAPPING_FILE_NAME_'+(_sequence)+'"/>' +
							'<input type="hidden" name="BUSI_GB_'+(_sequence)+'" value="'+value.BUSI_GB+'" />' +
							'<input type="hidden" name="BUSI_KEY_'+(_sequence)+'" value="'+value.BUSI_KEY+'" />' +
							'<input type="hidden" name="MUST_YN_'+(_sequence)+'" value="'+value.MUST_YN+'"/>' +
							'<input type="hidden" name="FILE_SIZE_MIN_'+(_sequence)+'" value="'+value.FILE_SIZE_MIN+'"/>' +
							'<input type="hidden" name="FILE_SIZE_MAX_'+(_sequence)+'" value="'+value.FILE_SIZE_MAX+'"/>' +
						'</td>' +							
						'<td class="align_c"><span class="file_size"></span></td>' +
					'</tr>';
					_sequence++;
			});
		}
		else{ //기존에 저장된 파일목록
			if(value.length > 0){
				hasStoredList = true;
				var storeFileNm = ""; // 첨부파일 명
				var storeFileSize = "";
				$.each(value, function(key, value){
					 
					storedListBody += 
						'<tr>' + 
							'<td class="point_td">';
							if(value.MUST_YN == '0'){ //첨부파일이 필수인 경우
								storedListBody += '<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택" disabled="disabled"/>' +
								'<span class="t_point mgl_10">*</span>' +
								'<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' +
								'<input type="hidden" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>' +
								'<span class="in_block w220">'+value.APND_DOC_NM+'</span>';
							}
							else{ //첨부파일이 필수가 아닌 경우
								storedListBody += '<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택"/>' +
								'<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' +
								'<input type="hidden" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>' +
								'<span class="in_block w230 mgl_15">'+value.APND_DOC_NM+'</span>';
							}
							if( gfn_isNull(value.FILE_NM) == true){
								storeFileNm = "";
							}else{
								storeFileNm = value.FILE_NM;
							}
							if( gfn_isNull(value.FILE_SIZE) == true){
								storeFileSize = 0;
							}else{
								storeFileSize = value.FILE_SIZE;
							}
							storedListBody += '</td>' + 
							'<td class="file_body">' + 
								'<span class="span_file_name" name="span_file_name_'+(_sequence)+'">'+storeFileNm+'</span><br/>' + 
								'<input type="file" id="files_'+(_sequence)+'" name="files_'+(_sequence)+'" class="file_input_hidden"/>' +
								'<input type="hidden" name="APND_FILE_SEQ_'+(_sequence)+'" value="'+value.APND_FILE_SEQ+'"/>' +
								'<input type="hidden" name="FILE_SEQ_'+(_sequence)+'" value="'+value.FILE_SEQ+'"/>' +
								'<input type="hidden" name="ELEMENT_ID_'+(_sequence)+'" value="'+value.XVARM_ID+'"/>' +
								'<input type="hidden" name="MAPPING_FILE_NAME_'+(_sequence)+'"/>' +
								'<input type="hidden" name="BUSI_GB_'+(_sequence)+'" value="'+value.BUSI_GB+'" />' +
								'<input type="hidden" name="BUSI_KEY_'+(_sequence)+'" value="'+value.BUSI_KEY+'" />' +
								'<input type="hidden" name="MUST_YN_'+(_sequence)+'" value="'+value.MUST_YN+'"/>' +
								'<input type="hidden" name="FILE_SIZE_'+(_sequence)+'" value="'+storeFileSize+'"/>' +
								'<input type="hidden" name="FILE_SIZE_MIN_'+(_sequence)+'" value="'+value.FILE_SIZE_MIN+'"/>' +
								'<input type="hidden" name="FILE_SIZE_MAX_'+(_sequence)+'" value="'+value.FILE_SIZE_MAX+'"/>' +
							'</td>' +							
							'<td class="align_c"><span class="file_size">'+Math.round(storeFileSize / 1024)+' kb</span></td>' +
						'</tr>';
						_sequence++;
				});
			}
		}
	});
	var body = (hasStoredList == true) ? storedListBody : initListBody; 
	var returnObj = {
		"option" : option,
		"body" : body,
		"commandMap" : data.commandMap
	};
	_renderUI(returnObj);
};

/********************************************
@함수명  	_setArgumentsCallback
@설명   	첨부파일 목록 조회 후 콜백함수
@작성일  	2014. 9. 16.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 16.			        최초작성
*********************************************/
function _setEmpArgumentsCallback(data){
	
	var option = "";
	var initListBody = "";
	var storedListBody = "";
	var hasStoredList = false;
	
	$.each(data, function(key, value){
		
		if(key == "fileList"){  //해당 업무에 해당하는 모든 파일목록
			
			$.each(value, function(key, value){
				
				option += '<option value="'+value.APND_DOC_NO+'">'+value.APND_DOC_NM+'</option>';
				
				initListBody += '<tr>' 
					 		  +	'	<td class="point_td">'
				              +	'		<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' 
				              +	'		<span class="in_block w230 mgl_15">' + value.APND_DOC_NM + '</span>' 
				              +	'		<input type="hidden" id="APND_DOC_NM_'+(_sequence)+'" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>'
				  			  + '	</td>' 
							  +	'	<td class="file_body">' 
							  + '		<input type="hidden" name="MAPPING_FILE_NAME_'+(_sequence)+'"/>' 
							  +	'		<input type="hidden" name="BUSI_GB_'+(_sequence)+'" value="'+value.BUSI_GB+'" />' 
							  +	'		<input type="hidden" name="BUSI_KEY_'+(_sequence)+'" value="'+value.BUSI_KEY+'" />' 
							  +	'		<input type="hidden" name="MUST_YN_'+(_sequence)+'" value="'+value.MUST_YN+'"/>' 
							  +	'		<input type="hidden" name="FILE_SIZE_MIN_'+(_sequence)+'" value="'+value.FILE_SIZE_MIN+'"/>' 
							  +	'		<input type="hidden" name="FILE_SIZE_MAX_'+(_sequence)+'" value="'+value.FILE_SIZE_MAX+'"/>' 
							  +	'	</td>' 
							  +	'	<td class="align_c"><span class="file_size"></span></td>' 
							  + '	<td class="align_c"></td>'
							  +	'</tr>';
				
				_sequence++;
			});
		}else{ 			//기존에 저장된 파일목록
			
			if(value.length > 0){
				
				hasStoredList = true;
				var storeFileNm = ""; // 첨부파일 명
				var storeFileSize = "";
				var rownumVal = value.length;
				var cnt = 1;
				$.each(value, function(key, value){
					
					storeFileNm = (gfn_isNull(value.FILE_NM) == true) ?  "" : value.FILE_NM; 
					storeFileSize = (gfn_isNull(value.FILE_SIZE) == true) ? 0 : value.FILE_SIZE;
					
					storedListBody += '<tr>' 
						 			+ '	<td class="point_td">'
									+ '		<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' 
									+ '		<input type="hidden" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>' 
									+ '		<span class="in_block w230 mgl_15">'+value.APND_DOC_NM+'</span>'
									+ '	</td>' 
									+ '	<td class="file_body">' 
									+ '		<span class="span_file_name" name="span_file_name_'+(_sequence)+'">'+storeFileNm+'</span>' 
									+ '		<input type="hidden" name="APND_FILE_SEQ_'+(_sequence)+'" value="'+value.APND_FILE_SEQ+'"/>' 
									+ '		<input type="hidden" name="FILE_SEQ_'+(_sequence)+'" value="'+value.FILE_SEQ+'"/>' 
									+ '		<input type="hidden" name="ELEMENT_ID_'+(_sequence)+'" value="'+value.XVARM_ID+'"/>' 
									+ '		<input type="hidden" name="MAPPING_FILE_NAME_'+(_sequence)+'"/>' 
									+ '		<input type="hidden" name="BUSI_GB_'+(_sequence)+'" value="'+value.BUSI_GB+'" />' 
									+ '		<input type="hidden" name="BUSI_KEY_'+(_sequence)+'" value="'+value.BUSI_KEY+'" />' 
									+ '		<input type="hidden" name="MUST_YN_'+(_sequence)+'" value="'+value.MUST_YN+'"/>' 
									+ '		<input type="hidden" name="FILE_SIZE_'+(_sequence)+'" value="'+storeFileSize+'"/>' 
									+ '		<input type="hidden" name="FILE_SIZE_MIN_'+(_sequence)+'" value="'+value.FILE_SIZE_MIN+'"/>' 
									+ '		<input type="hidden" name="FILE_SIZE_MAX_'+(_sequence)+'" value="'+value.FILE_SIZE_MAX+'"/>' 
									+ '	</td>' 
									+ '	<td class="align_c"><span class="file_size">'+Math.round(storeFileSize / 1024)+' kb</span></td>';
					
					if(cnt == 1){
						storedListBody += '	<td class="align_c" rowspan="' + rownumVal + '"><a href="#detail" id="detailBtn_'+(_sequence)+'" name="detailBtn_'+(_sequence)+'" class="btn_attach01 bold"><span class="btn_attach01_start"></span>'+ "상세보기" +'<span class="btn_attach01_end"></span></td>';
					}
						
					storedListBody += '</tr>';
					
					cnt++;
					_sequence++;
					
				});
			}
		}
	});
	var body = (hasStoredList == true) ? storedListBody : initListBody; 
	var returnObj = {
		"option" : option,
		"body" : body,
		"commandMap" : data.commandMap
	};
	_renderEmpUI(returnObj);
};

/********************************************
@함수명  	_renderUI
@설명   	첨부파일 목록을 조회한 후 화면에 html 생성
@작성일  	2014. 7. 14.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 14.			        최초작성
*********************************************/
function _renderUI(obj){
	var strFileType ="";
	var strFileName="";
	var strFileSize="";
	var strFileAdd="";
	var strFileMinus="";
	if(gfv_seLang=='EN'){
		strFileType="Type of attachment file";
		strFileName="File name";
		strFileSize="Size of file";
		strFileAdd="Add";
		strFileMinus="Del";
	}else if(gfv_seLang=='CH'){
		strFileType="附件类型";
		strFileName="文件名";
		strFileSize="文件大小";
		strFileAdd="添加";
		strFileMinus="删除";
	}else{
		strFileType="첨부파일유형";
		strFileName="파일명";
		strFileSize="파일크기";
		strFileAdd="추가";
		strFileMinus="삭제";
	}
	
	var preScript = 
	'<table id="'+obj.commandMap.BUSI_GB+'" border="1" cellpadding="1" cellspacing="0" summary="첨부서류 목록으로 첨부파일유형, 파일명, 파일크기, 삭제로 구성되어 있습니다." class="board_file01 mgb_10">' +
		'<caption>'+strFileType+'</caption>' + 
		'<colgroup>' + 
			'<col style="width:40%"/>' +
			'<col style="width:42%"/>' +
			'<col style="width:auto"/>' +
		'</colgroup>'+
		'<thead>' +
			'<tr>' +
				'<th scope="col">' + 
					'<span>'+strFileType+'</span>' +
					'<a href="#this" id="add_'+obj.commandMap.BUSI_GB+'" class="btn_file_add01 mgl_15">+ '+strFileAdd+'</a>' +
					'<a href="#this" id="delete_'+obj.commandMap.BUSI_GB+'" class="btn_file_del01 mgl_5">- '+strFileMinus+'</a>' +
					'<input type="hidden" name="DIV_ID" value="'+obj.commandMap.BUSI_GB+'"/>' + 
				'</th>' +
				'<th scope="col"><span>'+strFileName+'</span></th>' +
				'<th scope="col"><span>'+strFileSize+'</span></th>' +
			'</tr>' +
		'</thead>' +
		'<tbody>';
	
	var postScript = 	
		'</tbody>' +
	'</table>';
	
	$("#"+obj.commandMap.DIV).html(preScript + obj.body + postScript);
	
	$("#add_"+obj.commandMap.BUSI_GB).on("click", function(e){ //추가 버튼
		e.preventDefault();
		_addFileType(obj, $(this));
	});
	$("#delete_"+obj.commandMap.BUSI_GB).on("click", function(e){ //삭제 버튼
		e.preventDefault();
		_deleteFileType($(this));
	});
	$("input[name^='files_']").off("change").on("change",function(e){  //파일 선택
		e.preventDefault();
		_addFile($(this));
	});
	$(".span_file_name").off("click").on("click", function(){ //파일이름 선택
		var selectedRow = $(this).parent();
		_downloadFile(selectedRow);
	});
	
}

/********************************************
@함수명  	_renderEmpUI
@설명   	첨부파일 목록을 조회한 후 화면에 html 생성
@작성일  	2014. 7. 14.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 14.			        최초작성
*********************************************/
function _renderEmpUI(obj){
	var strFileType = "";
	var strFileName = "";
	var strFileSize = "";
	var strFileAdd = "";
	var strFileMinus = "";
	var strFileRmk = "";
	
	if(gfv_seLang == 'EN'){
		strFileType = "Type of attachment file";
		strFileName = "File name";
		strFileSize = "Size of file";
		strFileAdd = "Add";
		strFileMinus = "Del";
		strFileRmk = "Note";
	}else if(gfv_seLang == 'CH'){
		strFileType = "附件类型";
		strFileName = "文件名";
		strFileSize = "文件大小";
		strFileAdd = "添加";
		strFileMinus = "删除";
		strFileRmk = "备注";
	}else{
		strFileType = "첨부파일유형";
		strFileName = "파일명";
		strFileSize = "파일크기";
		strFileAdd = "추가";
		strFileMinus = "삭제";
		strFileRmk = "비고";
	}
	
	var preScript = '<table id="'+obj.commandMap.BUSI_GB+'" border="1" cellpadding="1" cellspacing="0" summary="첨부서류 목록으로 첨부파일유형, 파일명, 파일크기, 비고로 구성되어 있습니다." class="board_file01 mgb_10">' 
				  +	'<caption>'+strFileType+'</caption>' 
				  + '<colgroup>' 
				  + '<col style="width:34%"/>' 
				  + '<col style="width:36%"/>' 
				  +	'<col style="width:12%"/>' 
				  +	'<col style="width:12%"/>' 
				  + '</colgroup>'
				  + '<thead>' 
				  + '<tr>' 
				  +	'<th scope="col">' 
				  +	'<span>'+strFileType+'</span>' 
				  //+	'<a href="#this" id="add_'+obj.commandMap.BUSI_GB+'" class="btn_file_add01 mgl_15">+ '+strFileAdd+'</a>' 
				  //+	'<a href="#this" id="delete_'+obj.commandMap.BUSI_GB+'" class="btn_file_del01 mgl_5">- '+strFileMinus+'</a>' 
				  +	'<input type="hidden" name="DIV_ID" value="'+obj.commandMap.BUSI_GB+'"/>' 
				  +	'</th>' 
				  +	'<th scope="col"><span>'+strFileName+'</span></th>' 
				  +	'<th scope="col"><span>'+strFileSize+'</span></th>' 
				  +	'<th scope="col"><span>'+strFileRmk+'</span></th>' 
				  + '</tr>' 
				  + '</thead>' 
				  + '<tbody>';
	
	var postScript = '</tbody>' 
				   + '</table>';
	
	$("#"+obj.commandMap.DIV).html(preScript + obj.body + postScript);
	
	$("#add_"+obj.commandMap.BUSI_GB).on("click", function(e){ //추가 버튼
		e.preventDefault();
		_addFileType(obj, $(this));
	});
	$("#delete_"+obj.commandMap.BUSI_GB).on("click", function(e){ //삭제 버튼
		e.preventDefault();
		_deleteFileType($(this));
	});
	$(".span_file_name").off("click").on("click", function(){ //파일이름 선택
		var selectedRow = $(this).parent();
		_downloadFile(selectedRow);
	});
	$("a[id^='detailBtn_']").on("click", function(e){ 	//상세보기
		var getId = $(this).attr("id").split('_');
		var getNumber = getId[1];
		var val = $("span[name='span_file_name_" + getNumber + "'");
		var selectedRow = $(val).parent();
		_showDetailFile(selectedRow);
	});
}

/********************************************
@함수명  	_addFileType
@설명   	첨부파일유형 추가
@작성일  	2014. 7. 14.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 14.			        최초작성
*********************************************/
function _addFileType(obj, jqueryObj){
	var strFileSelect ="";
	if(gfv_seLang=='EN'){
		strFileSelect="Select";		
	}else if(gfv_seLang=='CH'){
		strFileSelect="选择";
	}else{
		strFileSelect="선택";
	}
	

	
	_isChanged = "T";
	var table = jqueryObj.parent().find("input[name=DIV_ID]").val();
	_sequence++;
	var tempMaxSize = '';
	if (obj.commandMap.SE_MEM_GB == '9') {
		tempMaxSize = '<input type="hidden" name="FILE_SIZE_MAX_'+(_sequence)+'" value="1000"/>';
	}
	$("#"+table).find("tbody").append(
		'<tr>' +
			'<td class="point_td">' +
				'<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택" />' + 
				'<select name="APND_DOC_NO_'+(_sequence)+'" title="첨부파일 유형 선택" class="w230 mgl_15">' +
					'<option value="">'+strFileSelect+'</option>' + 
					obj.option + 					
				'</select>' +
			'</td>' +
			'<td class="file_body">' +
				'<input type="file" id="files_'+(_sequence)+'" name="files_'+(_sequence)+'" class="file_input_hidden"/>' +
				'<input type="hidden" name="MAPPING_FILE_NAME_'+(_sequence)+'" />' +
				'<input type="hidden" name="BUSI_GB_'+(_sequence)+'" value="'+obj.commandMap.BUSI_GB+'"/>' +
				'<input type="hidden" name="BUSI_KEY_'+(_sequence)+'" value="'+obj.commandMap.BUSI_KEY+'"/>' +
				'<input type="hidden" name="MUST_YN_'+(_sequence)+'" value="1"/>'+
				tempMaxSize +
			'</td>' +							
			'<td class="align_c"><span class="file_size"></span></td>' +
		'</tr>'
	);
	$("#"+table).find("tbody").append(
	);
	
	$("#files_"+(_sequence)).on("change",function(e){
		_addFile($(this));
	});
	_sequence++;
}

/********************************************
@함수명  	_deleteFileType
@설명   	첨부파일유형 삭제
@작성일  	2014. 7. 21.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 21.			        최초작성
*********************************************/
function _deleteFileType(obj){
	_isChanged = "T";
	var div = obj.parent().find("input[name=DIV_ID]").val();
	var body = $("#"+div).find("tbody");
	body.find("input:checkbox[name^='checkbox_']").each(function(){
		var selectedRow = $(this).parent();
		if(selectedRow.find("input:checkbox[name^=checkbox_]").is(":checked") == true){
			selectedRow = $(this).parent().parent();
			selectedRow.remove();
		}
	});
}

/********************************************
@함수명  	_addFile
@설명   	첨부파일을 선택
@작성일  	2014. 7. 14.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 14.			        최초작성
*********************************************/
function _addFile(obj){
	_isChanged = "T";
	var fileName = obj.val();
	var fileExtension = fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();
	var selectedRow = obj.parent().parent();
	
	if(gfn_isExistInArray(_extensions, fileExtension) == true){ //파일 형식 검사
		selectedRow.find("input[name^='MAPPING_FILE_NAME_']").val(fileName.substring(fileName.lastIndexOf("\\")+1));
		_getFileSize(obj, fileName, selectedRow);		
	}
	else{
		var text = selectedRow.find("input[name^='APND_DOC_NM']").val();
		selectedRow.find(".file_input_hidden").replaceWith(selectedRow.find(".file_input_hidden").val("").clone(true)); // 파일 input 초기화
		var params = {
			param : "@"+text,
			param1 : _validExtensions
		};
		gfn_alert("JSM-1024",params);
	}
}

/********************************************
@함수명  	_getFileSize
@설명   	첨부파일의 크기 가져옴
@작성일  	2014. 7. 14.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 14.			        최초작성
*********************************************/
function _getFileSize(file, fileName, selectedRow){
	if(gfn_isNull(file[0].files) == false){ //HTML5 지원 브라우저 - IE 9이하가 아닌 경우
		fileSize = Math.round(file[0].files[0].size / 1024);
		_isValidFileSize(fileSize, fileName, selectedRow);
	}
	else{ //IE 9이하
		var frm = $("#formFile");
		frm.append(file);
		frm.ajaxSubmit({
			url : '/cmm/getFileSize.do',
			data : frm.serialize(),
			async : false,
			success : function(data){
				selectedRow.find(".file_body").append($("#formFile").find(file));
				fileSize = Math.round($.parseJSON(data).fileSize / 1024);
				_isValidFileSize(fileSize, fileName, selectedRow);
			},
			error : function(){
				selectedRow.find(".file_body").append($("#formFile").find(file));
			}
		});
	}
}

/********************************************
@함수명  	_isValidFileSize
@설명   	첨부파일의 크기 검사
@작성일  	2014. 7. 14.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 14.			        최초작성
*********************************************/
function _isValidFileSize(fileSize, fileName, selectedRow){	
	var min = selectedRow.find("input[name^='FILE_SIZE_MIN']").val();
	var max = selectedRow.find("input[name^='FILE_SIZE_MAX']").val();
	
	if(gfn_isNull(min) == true)
		min = _minFileSize;
	if(gfn_isNull(max) == true)
		max = _maxFileSize;
	if(fileSize > min && fileSize < max){ //파일 크기 검사
		selectedRow.find(".file_size").html(fileSize+" kb");
		_totalFileSize += fileSize;
	}
	else{
		gfn_alert("FILE_UPLOAD_LIMIT_OTHER",null, function(){
			selectedRow.find(".file_input_hidden").replaceWith(selectedRow.find(".file_input_hidden").val("").clone(true));		
			return;			
		});	
	}
}

/********************************************
@함수명  	_downloadFile
@설명   	첨부파일을 다운로드 한다.
@인자   	jQuery Object selectedRow
@입력형태 	선택된 행
@반환    	없음
@작성일  	2014. 8. 8.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 8. 8.				        최초작성
*********************************************/
function _downloadFile(selectedRow){
	var elementId = selectedRow.find("input[name^=ELEMENT_ID_]").val();
	var comSubmit = new ComSubmit();
	comSubmit.addParam("ELEMENT_ID", elementId);
	comSubmit.setUrl("/cmm/downloadFile.do");
	comSubmit.tran();
}

/********************************************
@함수명  	_downloadFile
@설명   	첨부파일을 다운로드 한다.
@인자   	jQuery Object selectedRow
@입력형태 	선택된 행
@반환    	없음
@작성일  	2014. 8. 8.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 8. 8.				        최초작성
*********************************************/
function _showDetailFile(selectedRow){
	var busiGb = selectedRow.find("input[name^=BUSI_GB_]").val();
	var busiKey = selectedRow.find("input[name^=BUSI_KEY_]").val();
	
	var objParams = {
		BUSI_GB : busiGb,
		BUSI_KEY : busiKey
	};
	var strFile = "/biz/ap/er/APER04P";
	var strPopName = "첨부파일 상세보기";
	gfn_openPopUp(strFile, strPopName, objParams, "1000", "860"); 
	
}

/********************************************
@함수명  	FileMultiUpload
@설명   	첨부서류(다중 업무) 공통함수
@인자   	String formId, String divId_1, String divId_2
@반환    	없음
@작성일  	2014. 9. 24.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 24.			        최초작성
*********************************************/
function FileMultiUpload(formId, divId_1, divId_2){
	this.url = "";
	this.formId = formId;
	this.divId_1 = divId_1;
	this.divId_2 = divId_2;
	
	this.setUrl = function setUrl(url){
		this.url = url;
	};
	
	/********************************************
	@함수명  	setArguments
	@설명   	최초 조회 시, 해당 업무에 필요한 첨부파일 목록을 조회한다.  
	@인자   	하단 주석 참조
	@반환    	없음
	@작성일  	2014. 9. 24.
	@작성자  	
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 9. 24.			        최초작성
	*********************************************/
	/*
	@sBussGb	       	업무구분	공통	EV, CCVI, INDIV, COMPY, VISA
	@sMemAppl	       	개인, 기업	공통	INDIV, COMPY
	@sRepSojQualCd     	체류코드1	공통	
	@sSubSojQualCd     	체류코드2	공통	
	@sOcptCd	      	직종	    (사발인)	
	@sEntryPurpCd	   	입국목적	(전자사증) 피초청자
	@sInviteeDiv_1	   	첫번째 초청자구분	공통	EVCall, EVInvitee, EVF301 (CCVICall, CCVIInvitee, CCVIF301)
	@sBusiKey_1			첫번째 업무 키				(TB_PHZ06, TB_PZG02번에서 사용)
	@sInviteeDiv_2	   	두번째 초청자구분	공통	EVCall, EVInvitee, EVF301 (CCVICall, CCVIInvitee, CCVIF301)
	@sBusiKey_2			두번째 업무 키				(TB_PHZ06, TB_PZG02번에서 사용)
	*/
	this.setArguments = function setArguments(sBussGb, sMemAppl, sRepSojQualCd, sSubSojQualCd, sOcptCd, sEntryPurpCd, sInviteeDiv_1, sBusiKey_1, sInviteeDiv_2, sBusiKey_2){
		
		var comAjax = new ComAjax();
		comAjax.addParam("sBussGb", sBussGb);
		comAjax.addParam("sMemAppl", sMemAppl);
		comAjax.addParam("sRepSojQualCd", sRepSojQualCd);
		comAjax.addParam("sSubSojQualCd", sSubSojQualCd);
		comAjax.addParam("sInviteeDiv_1", sInviteeDiv_1);
		comAjax.addParam("sInviteeDiv_2", sInviteeDiv_2);
		comAjax.addParam("sOcptCd", sOcptCd);
		comAjax.addParam("sEntryPurpCd", sEntryPurpCd);
		comAjax.addParam("BUSI_KEY_1", sBusiKey_1);
		comAjax.addParam("BUSI_KEY_2", sBusiKey_2);
		comAjax.addParam("DIV_1", this.divId_1);
		comAjax.addParam("DIV_2", this.divId_2);
		
		comAjax.setUrl("/cmm/getFileMultiList.do");
		comAjax.setCallBack("_setMultiArgumentsCallback");
		comAjax.tran();
	};
	
	/********************************************
	@함수명  	disable
	@설명   	첨부서류를 추가, 삭제, 또는 변경할 수 없도록 한다.
	@인자   	없음
	@반환    	없음
	@작성일  	2014. 10. 14.
	@작성자  	
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 10. 14.			        최초작성
	*********************************************/
	this.disable = function disable(){
		$("#add_"+this.divId_1).css("display", "none");
		$("#add_"+this.divId_2).css("display", "none");
		$("#delete_"+this.divId_1).css("display", "none");
		$("#delete_"+this.divId_2).css("display", "none");
		$("input:checkbox[name^='checkbox_']").prop("disabled", true);
		$(".file_input_hidden").css("display", "none");
	};
	
	/********************************************
	@함수명  	enable
	@설명   	첨부서류를 추가, 삭제, 또는 변경할 수 있도록 한다.  
	@인자   	하단 주석 참조
	@반환    	없음
	@작성일  	2014. 10. 14.
	@작성자  	
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 10. 14.			        최초작성
	*********************************************/
	this.enable = function enable(){
		$("#add_"+this.divId_1).css("display", "inline-block");
		$("#add_"+this.divId_2).css("display", "inline-block");
		$("#delete_"+this.divId_1).css("display", "inline-block");
		$("#delete_"+this.divId_2).css("display", "inline-block");
		$("input:checkbox[name^='checkbox_']").prop("disabled", false);
		$(".file_input_hidden").css("display", "block");
	};
	
	/********************************************
	@함수명  	submit
	@설명   	Form에 있는 모든 내용을 저장한다.  
	@인자   	String type
	@입력형태	TEMP : 임시저장 기능으로 파일의 필수 여부를 검사하지 않고 저장한다.
				REGIST : 첨부파일의 필수 여부를 검사하고 저장한다.
	@반환    	없음
	@작성일  	2014. 9. 24.
	@작성자  	
	@변경일			변경자        변경내역 
	<br>--------------------------------------------<br>
	2014. 9. 24.			        최초작성
	*********************************************/
	this.submit = function submit(type){
		var isCorrect = true;
		if(type == "REGIST"){
			if($.find(".file_input_hidden").length != 0){ 
				$(".file_input_hidden").each(function(){
					var selectedRow = $(this).parent().parent();
					if(selectedRow.find("input[name^='MUST_YN']").val() == '0'){ //첨부파일이 필수인 경우
						if(gfn_isNull($(this).val()) == true && gfn_isNull(selectedRow.find("input[name^='ELEMENT_ID_']").val()) == true){ //file에 데이터가 없고, ELEMENT_ID가 없는 경우
							//console.log("필수 항목이 없음");
							var text = selectedRow.find(".in_block").html();
							var params = {
								param : "@"+text
							};
							gfn_alert("JSM-1023",params);
							isCorrect = false;
							return false;
						}
					}
				});
			}
		}
		if(isCorrect == true){
			$('.saving_bar').css("display", "block");
			$("#"+this.formId).append("<input type='hidden' name='FILE_CHANGE_FLAG' value='"+ _isChanged +"'/>");
			
			var frm = $("#"+this.formId)[0];
			frm.action = this.url;
			frm.method = "post";
			frm.enctype = "multipart/form-data";
			frm.submit();
		}
	};
}

/********************************************
@함수명  	_setMultiArgumentsCallback
@설명   	첨부파일 목록 조회 후 콜백함수
@작성일  	2014. 9. 24.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 24.			        최초작성
*********************************************/
function _setMultiArgumentsCallback(data){
	
	var div = "";
	var option = "";
	var initListBody = "";
	var storedListBody = "";
	var BUSI_GB = "";
	var BUSI_KEY ="";
	var hasStoredList = false;
	
	$.each(data, function(key, value){
		div = value.DIV;
		BUSI_GB = value.BUSI_GB;
		BUSI_KEY = value.BUSI_KEY;
		$.each(value, function(key, value){
			if(key == "fileList"){
				
				$.each(value, function(key, value){
					option += '<option value="'+value.APND_DOC_NO+'">'+value.APND_DOC_NM+'</option>';
					initListBody += 
						'<tr>' +
							'<td class="point_td">';
							if(value.MUST_YN == '0'){ //첨부파일이 필수인 경우
								initListBody +=
									'<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택" disabled="disabled"/>' + 
									'<span class="t_point mgl_10">*</span>' +
									'<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' + 
									'<span class="in_block w220">' + value.APND_DOC_NM + '</span>' + 
									'<input type="hidden" id="APND_DOC_NM_'+(_sequence)+'" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>';
							}
							else{ //첨부파일이 필수가 아닌 경우
								initListBody += 
									'<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택" />' + 
									'<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' + 
									'<span class="in_block w230 mgl_15">' + value.APND_DOC_NM + '</span>' + 
									'<input type="hidden" id="APND_DOC_NM_'+(_sequence)+'" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>';
							}
							initListBody += 
							'</td>' +
							'<td class="file_body">' +
								'<input type="file" id="files_'+(_sequence)+'" name="files_'+(_sequence)+'" class="file_input_hidden"/>' +
								'<input type="hidden" name="MAPPING_FILE_NAME_'+(_sequence)+'"/>' +
								'<input type="hidden" name="BUSI_GB_'+(_sequence)+'" value="'+BUSI_GB+'" />' +
								'<input type="hidden" name="BUSI_KEY_'+(_sequence)+'" value="'+BUSI_KEY+'" />' +
								'<input type="hidden" name="MUST_YN_'+(_sequence)+'" value="'+value.MUST_YN+'"/>' +
								'<input type="hidden" name="FILE_SIZE_MIN_'+(_sequence)+'" value="'+value.FILE_SIZE_MIN+'"/>' +
								'<input type="hidden" name="FILE_SIZE_MAX_'+(_sequence)+'" value="'+value.FILE_SIZE_MAX+'"/>' +
							'</td>' +							
							'<td class="align_c"><span class="file_size"></span></td>' +
						'</tr>';
						_sequence++;	
				});
			}
			else if(key == "storedFileList"){
				 
				if(value.length > 0){
					hasStoredList = true;
					$.each(value, function(key, value){
						storedListBody += 
							'<tr>' + 
								'<td class="point_td">';
								if(value.MUST_YN == '0'){ //첨부파일이 필수인 경우
									storedListBody += '<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택" disabled="disabled"/>' +
									'<span class="t_point mgl_10">*</span>' +
									'<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' +
									'<input type="hidden" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>' +
									'<span class="in_block w220">' + value.APND_DOC_NM + '</span>'; 
								}
								else{ //첨부파일이 필수가 아닌 경우
									storedListBody += '<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택"/>' +
									'<input type="hidden" name="APND_DOC_NO_'+(_sequence)+'" value="'+value.APND_DOC_NO+'"/>' +
									'<input type="hidden" name="APND_DOC_NM_'+(_sequence)+'" value="'+value.APND_DOC_NM+'"/>' +
									'<span class="in_block w220 mgl_15">' + value.APND_DOC_NM + '</span>';
								}
								storedListBody += '</td>' + 
								'<td class="file_body">' + 
									'<span class="span_file_name" name="span_file_name_'+(_sequence)+'">';
									if(gfn_isNull(value.FILE_NM) == false)
										storedListBody += value.FILE_NM;
									storedListBody += '</span><br/>' + 
									'<input type="file" id="files_'+(_sequence)+'" name="files_'+(_sequence)+'" class="file_input_hidden"/>' +
									'<input type="hidden" name="APND_FILE_SEQ_'+(_sequence)+'" value="'+value.APND_FILE_SEQ+'"/>' +
									'<input type="hidden" name="FILE_SEQ_'+(_sequence)+'" value="'+value.FILE_SEQ+'"/>' +
									'<input type="hidden" name="ELEMENT_ID_'+(_sequence)+'" value="'+value.XVARM_ID+'"/>' +
									'<input type="hidden" name="MAPPING_FILE_NAME_'+(_sequence)+'"/>' +
									'<input type="hidden" name="BUSI_GB_'+(_sequence)+'" value="'+value.BUSI_GB+'" />' +
									'<input type="hidden" name="BUSI_KEY_'+(_sequence)+'" value="'+value.BUSI_KEY+'" />' +
									'<input type="hidden" name="MUST_YN_'+(_sequence)+'" value="'+value.MUST_YN+'"/>' +
									'<input type="hidden" name="FILE_SIZE_'+(_sequence)+'" value="'+value.FILE_SIZE+'"/>' +
									'<input type="hidden" name="FILE_SIZE_MIN_'+(_sequence)+'" value="'+value.FILE_SIZE_MIN+'"/>' +
									'<input type="hidden" name="FILE_SIZE_MAX_'+(_sequence)+'" value="'+value.FILE_SIZE_MAX+'"/>' +
								'</td>' +							
								'<td class="align_c"><span class="file_size">'+Math.round(value.FILE_SIZE / 1024)+' kb</span></td>' +
							'</tr>';
							_sequence++;
					});
				}
			}
		});
		var body = (hasStoredList == true) ? storedListBody : initListBody;
		var returnObj = {	
			"option" : option,
			"body" : body,
			"div" : div,
			"BUSI_GB" : BUSI_GB,
			"BUSI_KEY" : BUSI_KEY
		};
		_renderMultiUI(returnObj);
		
		option = "";
		initListBody = "";
		storedListBody = "";
		hasStoredList = false;
	});
};


/********************************************
@함수명  	_renderMultiUI
@설명   	함수 설명 작성
@인자   	인자값 설명
@입력형태 	인자값에 대한 자세한 설명
@반환    	반환값 설명
@작성일  	2014. 9. 24.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 24.			        최초작성
*********************************************/
function _renderMultiUI(obj){
	var strFileType ="";
	var strFileName="";
	var strFileSize="";
	var strFileAdd="";
	var strFileMinus="";
	if(gfv_seLang=='EN'){
		strFileType="Type of attachment file";
		strFileName="File name";
		strFileSize="Size of file";
		strFileAdd="Add";
		strFileMinus="Del";
	}else if(gfv_seLang=='CH'){
		strFileType="附件类型";
		strFileName="文件名";
		strFileSize="文件大小";
		strFileAdd="添加";
		strFileMinus="删除";
	}else{
		strFileType="첨부파일유형";
		strFileName="파일명";
		strFileSize="파일크기";
		strFileAdd="추가";
		strFileMinus="삭제";
	}
	
	var preScript = 
		'<table id="table_'+obj.div+'" border="1" cellpadding="1" cellspacing="0" summary="첨부서류 목록으로 첨부파일유형, 파일명, 파일크기, 삭제로 구성되어 있습니다." class="board_file01 mgb_10">' +
			'<caption>'+strFileType+'</caption>' + 
			'<colgroup>' + 
				'<col style="width:40%"/>' +
				'<col style="width:42%"/>' +
				'<col style="width:auto"/>' +
			'</colgroup>'+
			'<thead>' +
				'<tr>' +
					'<th scope="col">' + 
						'<span>'+strFileType+'</span>' +
						'<a href="#this" id="add_'+obj.div+'" class="btn_file_add01 mgl_15">+ '+strFileAdd+'</a>' +
						'<a href="#this" id="delete_'+obj.div+'" class="btn_file_del01 mgl_5">- '+strFileMinus+'</a>' +
						'<input type="hidden" name="DIV_ID" value="'+obj.div+'"/>' + 
					'</th>' +
					'<th scope="col"><span>'+strFileName+'</span></th>' +
					'<th scope="col"><span>'+strFileSize+'</span></th>' +
				'</tr>' +
			'</thead>' +
			'<tbody>';
		
		var postScript = 	
			'</tbody>' +
		'</table>';
		
		$("#"+obj.div).html(preScript + obj.body + postScript);
		
		$("#add_"+obj.div).on("click", function(e){ //추가 버튼
			console.log("testsetest");
			console.log(obj);
			console.log(obj.div);
			e.preventDefault();
			_addMultiFileType(obj, $(this));
		});
		$("#delete_"+obj.div).on("click", function(e){ //삭제 버튼
			e.preventDefault();
			_deleteFileType($(this));
		});
		$("input[name^='files_']").off("change").on("change",function(e){  //파일 선택
			e.preventDefault();
			if($(this).val()!=''){
				_addFile($(this));
			}
		});
		$(".span_file_name").off("click").on("click", function(){ //파일이름 선택
			var selectedRow = $(this).parent();
			_downloadFile(selectedRow);
		});
}

/********************************************
@함수명  	_addMultiFileType
@설명   	첨부파일유형 추가
@작성일  	2014. 9. 25.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 25.			        최초작성
*********************************************/
function _addMultiFileType(obj, jqueryObj){
	var strFileSelect ="";
	if(gfv_seLang=='EN'){
		strFileSelect="Select";		
	}else if(gfv_seLang=='CH'){
		strFileSelect="选择";
	}else{
		strFileSelect="선택";
	}
	
	_isChanged = "T";
	var table = jqueryObj.parent().find("input[name=DIV_ID]").val();
	_sequence++;
	$("#table_"+table).find("tbody").append(
		'<tr>' +
			'<td class="point_td">' +
				'<input type="checkbox" name="checkbox_'+(_sequence)+'" title="삭제 항목 선택" />' + 
				'<select name="APND_DOC_NO_'+(_sequence)+'" title="첨부파일 유형 선택" class="w230 mgl_15">' +
					'<option value="">'+strFileSelect+'</option>' + 
					obj.option + 					
				'</select>' +
			'</td>' +
			'<td class="file_body">' +
				'<input type="file" id="files_'+(_sequence)+'" name="files_'+(_sequence)+'" class="file_input_hidden"/>' +
				'<input type="hidden" name="MAPPING_FILE_NAME_'+(_sequence)+'" />' +
				'<input type="hidden" name="BUSI_GB_'+(_sequence)+'" value="'+obj.BUSI_GB+'"/>' +
				'<input type="hidden" name="BUSI_KEY_'+(_sequence)+'" value="'+obj.BUSI_KEY+'"/>' +
				'<input type="hidden" name="MUST_YN_'+(_sequence)+'" value="1"/>' +
			'</td>' +							
			'<td class="align_c"><span class="file_size"></span></td>' +
		'</tr>'
	);
	
	$("#files_"+(_sequence)).on("change",function(e){
		_addFile($(this));
	});
	_sequence++;
}

/********************************************
@함수명  	gfn_addIdFictureFileC
@설명   	사진파일 사이즈 제한가능한 변수(size) 추가
@작성일  	2014. 12. 23.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 12. 23.			        최초작성
*/

function gfn_addIdFictureFileC(fileId, thumbnailId , size){
	_photosize = size ;
	_sizechange = "T";
	gfn_addIdFictureFile(fileId, thumbnailId);
}

function gfn_addIdFictureFile(fileId, thumbnailId){
	var obj = $("#"+fileId);	
	var fileName = obj.val();
	var fileExtension = fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();
	
	if(gfn_isExistInArray(_extensions1, fileExtension) == true){ //파일 형식 검사
		_getFileIdFictureSize(obj, fileName, thumbnailId);
	}
	else{
		obj.replaceWith(obj.val("").clone(true)); // 파일 input 초기화
		var params = {
			param : "PHOTO_INFO",
			param1 : _validExtensions1
		};
		gfn_alert("JSM-1024",params);
		obj.replaceWith(obj.val("").clone(true)); // 파일 input 초기화
		$("#"+thumbnailId).attr("src", "images/contents/no_image.gif");
		
		// 2014 12 23 ajax 처리형태의 구조로 인한 gfn_addIdFictureFile() 처리 후  Thumbnail 함수 호출하도록 추가 by suwon 
		fn_getThumbnail();
	}
}

function _getFileIdFictureSize(obj, fileName, thumbnailId){
	if(gfn_isNull(obj[0].files) == false){ //HTML5 지원 브라우저 - IE 9이하가 아닌 경우
		fileSize = Math.round(obj[0].files[0].size / 1024);
		_isValidIdFictureFileSize(obj, fileSize, fileName, thumbnailId);
	}
	else{ //IE 9이하
		var frm = $("#formFile");
		var rFileSize;
		frm.append(obj);
		frm.ajaxSubmit({
			url : '/cmm/getFileSize.do',
			data : frm.serialize(),
			async : false,
			success : function(data){
					// 기존 source 주석처리
					//fileSize = Math.round($.parseJSON(data).fileSize / 1024);
					//_isValidIdFictureFileSize(obj, fileSize, fileName, thumbnailId);
				
					// IE 8버전의 parseJSON 함수의 버그로 인해 string 형으로 받아 해당 filesize 확인
					// data value - "{"fileSize":121211}"
					var tdataSize = data.split(':');
					var tFileSize = tdataSize[1];
					
					rFileSize = tFileSize.substring(0 , tFileSize.length - 1);
					fileSize = Math.round(rFileSize / 1024);
					_isValidIdFictureFileSize(obj, fileSize, fileName, thumbnailId);
			},
			error : function(){
				obj.replaceWith(obj.val("").clone(true)); // 파일 input 초기화
				$("#"+thumbnailId).attr("src", "images/contents/no_image.gif");
			}
		});
	}
}

function _isValidIdFictureFileSize(obj, fileSize, fileName, thumbnailId){
	var min = 0;
	// 기존 Source 주석처리 
	// var max = 1024;
	var max = 1024;
	
	if(_sizechange == "T")
	{
		max = _photosize;
	}
	
	if(fileSize > min && fileSize < max){ //파일 크기 검사		
		gfn_getThumbnail(obj.attr('id'), thumbnailId);
	}
	else if(_sizechange == "T"){
 		if(gfv_seLang == "CH"){
 			gfn_alertPrint("附加文件最多允许 " +  _photosize  + "kilobytes");
 		}
 		else if(gfv_seLang == "EN"){
 			gfn_alertPrint("The maximum size for attached file is " +  _photosize  + "KB.");
 		}
 		else if(gfv_seLang == "KO"){
 			//gfn_alert("FILE_UPLOAD_LIMIT_OTHER");
 			gfn_alertPrint("첨부 파일의 용량은 최대 " +  _photosize  + "KB입니다.");
 		}
 		obj.replaceWith(obj.val("").clone(true)); // 파일 input 초기화
		$('#'+thumbnailId).attr('src', 'images/contents/no_image.gif');
		
		// 2014 12 23 ajax 처리형태의 구조로 인한 gfn_addIdFictureFile() 처리 후  Thumbnail 함수 호출하도록 추가 by suwon
		fn_getThumbnail();
	}
	else{
		gfn_alert("FILE_UPLOAD_LIMIT_OTHER");
 		obj.replaceWith(obj.val("").clone(true)); // 파일 input 초기화
		$("#"+thumbnailId).attr("src", "images/contents/no_image.gif");
		
		// 2014 12 23 ajax 처리형태의 구조로 인한 gfn_addIdFictureFile() 처리 후  Thumbnail 함수 호출하도록 추가 by suwon
		fn_getThumbnail();
	}
	
	
	// 전역변수 초기화 처리
	if(_sizechange == "T")
	{
		_photosize = 0;
		_sizechange = "F";
	}
}
