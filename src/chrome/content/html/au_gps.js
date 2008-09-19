function auLocationInit(params) {
	var href = location.href;
	var lat = encodeURIComponent(pref.copyUnicharPref("msim.config.AU.gps.lat"));
	var lon = encodeURIComponent(pref.copyUnicharPref("msim.config.AU.gps.lon"));

	if(href.indexOf("device:location") == 0){
		dump("location menu\n");
		var okUrl = unescape(params["url"]) + "?datum=tokyo&unit=dms&lat="+lat+"&lon="+lon;
		var ngUrl = "javascript:history.back();";
	}else if(href.indexOf("device:gpsone") == 0){
		dump("gpsone menu\n");
		var datum = params["datum"]; // 測地系
		var unit  = params["unit"]; // 緯度経度表記方法
		var alt   = pref.copyUnicharPref("msim.config.AU.gps.alt") || 50; //海抜高度
		var time  = getYYYYMMDDHHmm();
		var smaj  = pref.copyUnicharPref("msim.config.AU.gps.smaj") || 100; //長軸成分誤差
		var smin  = pref.copyUnicharPref("msim.config.AU.gps.smin") || 100; //短軸成分誤差
		var vert  = pref.copyUnicharPref("msim.config.AU.gps.vert") || 100; //高度誤差
		var majaa = pref.copyUnicharPref("msim.config.AU.gps.majaa") || 60; //長軸短軸傾き値
		var fm = 1; //測位結果の精度

		var point = new Point(lat, lon);
		if(datum == 1){
			// 東京測地系
			point.toTokyo();
		}else if(datum == 0){
			// wgs測地系
			point.toWgs();
		}
		if(unit == 0){
			// dms
			point.toDms();
		}else if(unit == 1){
			// degree
			point.toDegree();
		}

		var okUrl = unescape(params["url"]) + "?ver=1&datum="+point.datum+"&unit="+point.unit+"&lat="+point.lat+"&lon="+point.lon+"&alt="+alt+"&time="+time+"&smaj="+smaj+"&smin="+smin+"&vert="+vert+"&majaa="+majaa+"&fm="+fm;
		var ngUrl = "javascript:history.back();";
	}
	var okButton = document.getElementById("okbutton");
	var ngButton = document.getElementById("ngbutton");
	okButton.onclick = function(){location.href=okUrl};
	ngButton.onclick = function(){location.href=ngUrl};
}
