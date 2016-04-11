var Browser = {

	isSafari: function() {
		var chrome = /chrome/i.test(navigator.userAgent);
		var safari = /safari/i.test(navigator.userAgent);
		return safari && ! chrome ? true : false;
	},

	isIE: function( version ) {
		var ua = navigator.userAgent;
		// var ua = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)'; // for tests

		if ( ! /MSIE (\d+)\.\d+/.test(ua) )
			return false;

		if ( ! version )
			return true;

		var ieversion = new Number(RegExp.$1);
		
		return version == ieversion;
	},

	isMac: function() {
		return (navigator.appVersion.indexOf("Mac")!=-1) ? true : false;
	},

	isMobile: function() {
		return ( 'ontouchstart' in document.documentElement ? true : false );
	}
}

/*
*
* IE Warning
* 
* Show warning window for IE 6-8 for old and not supported browser
* 
*/

if ( Browser.isIE(6) || Browser.isIE(7) || Browser.isIE(8)) {
	var 
	iePopup  = '<div style="position:fixed; z-index:2147483646; top:50px; right:50px; width:300px; padding:20px; background:rgb(253, 160, 160); font-family:sans-serif; line-height:26px;">';
	iePopup += '<h1 style="font-size:20px; font-weight:bold; text-decoration:underline">Your browser is old!</h1>';
	iePopup += 'This version of Internet Explorer is old and not supported.<br>';
	iePopup += '</div>';
	
	document.write(iePopup);
}

