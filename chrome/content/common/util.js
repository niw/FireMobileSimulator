/* ***** BEGIN LICENSE BLOCK Version: GPL 3.0 ***** 
 * FireMobileFimulator is a Firefox add-on that simulate web browsers of 
 * japanese mobile phones.
 * Copyright (C) 2008  Takahiro Horikawa <horikawa.takahiro@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK ***** */

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

/**
 * 
 * @param {} path パス
 * @param {} func パラメータの値をデコードする関数(デフォルトではdecodeURIが使用される)
 * @return {}
 */
function getParamsFromPath(path, func){
	var params = {};
	var qindex = path.indexOf("?");
	if (qindex >= 0) {
		params = getParamsFromQuery(path.substring(qindex+1), func);
	}
	return params;
}

/**
 * 
 * @param {} q　クエリー
 * @param {} func パラメータの値をデコードする関数(デフォルトではdecodeURIが使用される)
 * @return {}
 */
function getParamsFromQuery(q, func){
	if(!func || !func instanceof Function) func = decodeURI;
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
				value = func(values[i].substring(eindex+1));
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
};
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
	if (!/[-+]?(\d+)\.(\d+)\.(\d+\.\d+)/.test(dms)) {
		return null;
	}
	var dms1 = parseInt(RegExp.$1);
	var dms2 = parseInt(RegExp.$2);
	var dms3 = parseFloat(RegExp.$3);
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
		if(i.toUpperCase() == "UID" && params[i].toUpperCase() == "NULLGWDOCOMO"){
			params[i] = pref.copyUnicharPref("msim.config.DC.uid");
		}
		r += '<input type="hidden" name="'+i+'" value="'+params[i]+'" />\n';
	}
	return r;
}