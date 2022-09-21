
/*document.write("<script type='text/javascript' charset='utf-8' src='../common/js/jquery.js'></script>");
document.write("<script type='text/javascript' charset='utf-8' src='../common/js/jquery.cookie.js'></script>");
document.write("<script type='text/javascript' charset='utf-8' src='../common/js/jquery.treeview.js'></script>");
document.write("<script type='text/javascript' charset='utf-8' src='../common/js/jquery.easing.1.3.js'></script>");
document.write("<script type='text/javascript' charset='utf-8' src='../common/js/iepngfix_tilebg.js'></script>");
document.write("<script type='text/javascript' charset='utf-8' src='../common/js/contact.js'></script>");*/
/*<!--document.write("<script type='text/javascript' charset='utf-8' src='../js/jquery.contact.js'></script>");*/



function getOSInfoStr()
{
    var ua = navigator.userAgent;
    if(ua.indexOf("NT 6.0") != -1) return "Windows Vista/Server 2008";
    else if(ua.indexOf("Android") != -1) return "Android";
    else if(ua.indexOf("iPad") != -1) return "IOS";
    else if(ua.indexOf("iPhone") != -1) return "IOS";
    else if(ua.indexOf("NT 5.2") != -1) return "Windows Server 2003";
    else if(ua.indexOf("NT 5.1") != -1) return "Windows XP";
    else if(ua.indexOf("NT 5.0") != -1) return "Windows 2000";
    else if(ua.indexOf("NT") != -1) return "Windows NT";
    else if(ua.indexOf("9x 4.90") != -1) return "Windows Me";
    else if(ua.indexOf("98") != -1) return "Windows 98";
    else if(ua.indexOf("95") != -1) return "Windows 95";
    else if(ua.indexOf("Win16") != -1) return "Windows 3.x";
    else if(ua.indexOf("Windows") != -1) return "Windows";
    else if(ua.indexOf("Linux") != -1) return "Linux";
    else if(ua.indexOf("Macintosh") != -1) return "Macintosh";
    else return "";
}