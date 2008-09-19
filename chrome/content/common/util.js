// Opens the URL in a new tab
function openURL(url) {
	var parentWindow = null;

	// If there is a parent window
	if (window.opener) {
		// If there is a grand parent window
		parentWindow = window.opener.opener
				? window.opener.opener
				: window.opener;
	}

	// If a parent window was found
	if (parentWindow) {
		parentWindow.getBrowser().selectedTab = parentWindow.getBrowser()
				.addTab(url);
		window.close();
	}
}

// page load eventからcontent documentを返す
function getPageLoadEventContentDocument(event) {
	try {
		var eventTarget = event.target;
		var originalTarget = event.originalTarget;

		if (eventTarget
				&& originalTarget
				&& (originalTarget.nodeName == "#document" || eventTarget == getBrowser())) {
			var contentDocument = eventTarget.contentDocument;

			if (!contentDocument && originalTarget.defaultView
					&& originalTarget.defaultView.parent) {
				contentDocument = originalTarget.defaultView.parent.document;
			}

			if (contentDocument
					&& contentDocument.documentURI == originalTarget.documentURI) {
				return contentDocument;
			}
		}
	} catch (exception) {
		dump("[msim]Error can't get content document:" + exception + "\n");
	}

	return null;
}

function getParamsFromPath(path){
	var params = {};
	var qindex = path.indexOf("?");
	if (qindex >= 0) {
		params = getParamsFromQuery(path.substring(qindex+1));
	}
	return params;
}

function getParamsFromQuery(q){
	//dump("##getParamsFromQuery start\n");
	var params = {};
	var values = q.split("&");
	for (var i=0; i<values.length; i++) {
		//dump("###"+i+"\n");
		var eindex = values[i].indexOf("=");
		if (eindex >= 0) {
			//dump("decode:"+values[i].substring(eindex+1)+"\n");
			var value;
			try {
				value = decodeURI(values[i].substring(eindex+1));
			} catch (exception) {
				dump("[msim]Warning:decodeURI:"+values[i].substring(eindex+1)+"\n");
				value = values[i].substring(eindex+1);
			}
			params["" + values[i].substring(0,eindex)] = "" + value;
		}
	}
	return params;
}

/**
 * 位置情報オブジェクト
 * @param {} lat
 * @param {} lon
 */
function Point(lat,lon){
	this.lat=lat;
	this.lon=lon;
}
Point.prototype = {
	lat : null,
	lon : null,
	datum : "0",
	unit : "0",
	DATUM_WGS : "0",
	DATUM_TOKYO : "1",
	UNIT_DMS : "0",
	UNIT_DEGREE : "1",
	toDms : function (){
		if (this.unit == this.UNIT_DEGREE) {
			this.lat = degree2dms(this.lat);
			this.lon = degree2dms(this.lon);
			this.unit = this.UNIT_DMS;
		}
	},
	toDegree : function(){
		if (this.unit == this.UNIT_DMS) {
			this.lat = dms2degree(this.lat);
			this.lon = dms2degree(this.lon);
			this.unit = this.UNIT_DEGREE;
		}
	},
	toWgs : function(){
		dump("Point.toWgs() Error:Not implemented.Do nothing.\n");
	},
	//wgs84測地系で与えられたdegreeを、tokyo測地系に変換する
	toTokyo : function(){
		if (this.datum == this.DATUM_WGS) {
			this.toDegree();
			//cf.http://homepage3.nifty.com/Nowral/02_DATUM/02_DATUM.html#HowTo
			this.lat = this.lat + 0.00010696*this.lat - 0.000017467*this.lon - 0.0046020;
			this.lon = this.lon + 0.000046047*this.lat + 0.000083049*this.lon - 0.010041;
			this.datum = this.DATUM_TOKYO;
		}
	}
};

/**
 * dms(時分秒)をdegree(度)に変換する
 * @param {} dms
 * @return {}
 */
function dms2degree(dms){
	dms.match(/[+-]?(\d+)\.(\d+)\.(\d+\.\d+)/);
	dms1 = parseInt(RegExp.$1);
	dms2 = parseInt(RegExp.$2);
	dms3 = parseFloat(RegExp.$3);
	var degree = dms1+dms2/60+dms3/3600;
	return degree;
}

/**
 * degree(度)をdms(時分秒)に変換する
 * @param {} degree
 * @return {}
 */
function degree2dms(degree){
	var n = 1000;
	var u = Math.floor(degree*3600*n + 0.5);
	var s = parseInt(u/n) % 60;
	var m = parseInt(u/60/n) % 60;
	var d = parseInt(u/3600/n);
	var u = u % n;
	return d+"."+m.toString().padding("0",2)+"."+s.toString().padding("0",2)+"."+u;
}

/**
 * 指定された文字列で指定された長さになるまで埋めます
 * @param {} str 対象となる文字列
 * @param {} pad 埋める文字列
 * @param {} len 埋める長さ
 */
String.prototype.padding = function(pad, len){
	var newString = this.valueOf();
	while (newString.length<len) {
		newString = pad+newString;
	}
	return new String(newString);
}

function getYYYYMMDDHHmm(){
	var now = new Date();
	var y = (now.getFullYear()).toString();
	var m = (now.getMonth()+1).toString().padding("0",2);
	var d = now.getDate().toString().padding("0",2);
	var h = now.getHours().toString().padding("0",2);
	var min = now.getMinutes().toString().padding("0",2);
	return y+m+d+h+min;
}

function getHiddenTag(params){
	var r = "";
	for (var i in params) {
		r += '<input type="hidden" name="'+i+'" value="'+params[i]+'" />\n';
	}
	return r;
}
