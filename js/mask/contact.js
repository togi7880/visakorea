var sizefunc = undefined;
$(document).ready(function(){ 

	$("#contactArea").css('height', '50px');

	$("a.contact").toggle( 
				function () { 
 					$("#contactArea").animate({height: "0px"}, {queue:false, duration: 1000, easing: 'swing'}),
					$("#Navigation").animate({top: "0px"}, {queue:false, duration: 1000, easing: 'swing'}),
					$(".contact").addClass("contact_open");
					try{ setTimeout(sizefunc,500); }catch(e){}
					
                }, 
                function () { 
					$("#contactArea").animate({height: "50px"}, {queue:false, duration: 1000, easing: 'swing'}),
					$("#Navigation").animate({top: "65px"}, {queue:false, duration: 1000, easing: 'swing'}),
					$(".contact").removeClass("contact_open");
					
					try{ setTimeout(sizefunc,500); }catch(e){}
				} 
		); 
		
		
	$("#menu_id").css('width', '168px');

	$("a.closeDepth").toggle( 
				function () { 
 					//$("#menu_id").animate({width: "0px"}, {queue:false, duration: 1000, easing: 'swing'});
 					//$(parent.document).find("#content").animate({marginLeft: "52px"}, {queue:false, duration: 1000, easing: 'swing'}),
					$(parent.document).find("#content").css({marginLeft: "52px"}),
					$(".closeDepth").addClass("closeDepth_open");
				}, 
                function () { 
					//$("#menu_id").animate({width: "168px"}, {queue:false, duration: 1000, easing: 'swing'})  
					//$(parent.document).find("#content").animate({marginLeft: "240px"}, {queue:false, duration: 1000, easing: 'swing'}),
					$(parent.document).find("#content").css({marginLeft: "240px"}),
					$(".closeDepth").removeClass("closeDepth_open");
				} 
		); 
        
}); 


