// キャリア別の端末の設定

const DOCOMO = "DC";
const AU = "AU";
const SOFTBANK = "SB";

var carrierArray = [DOCOMO, AU, SOFTBANK];

var carrierName = {
	DC : "DoCoMo",
	AU : "Au",
	SB : "SoftBank"
};

var deviceBasicAttribute = ["device", "useragent", "carrier"];

var deviceAttribute = {
	DC : [],
	AU : ["x-up-devcap-multimedia", "x-up-devcap-cc", "x-up-devcap-iscolor",
			"x-up-devcap-max-pdu", "x-up-devcap-numsoftkeys",
			"x-up-devcap-qvga", "x-up-devcap-screenchars",
			"x-up-devcap-screendepth", "x-up-devcap-screenpixels",
			"x-up-devcap-softkeysize", "x-up-devcap-titlebar"],
	SB : ["x-jphone-msname", "x-jphone-display", "x-jphone-color"]
	,
};

function setDevice(carrier, id) {

	dump("setDevice:"+carrier+",id:"+id+"\n");
	var msimButton = document.getElementById("msim-button");

	if (!carrier || !id) {
		dump("[msim]Error : the attribute which you have selected is insufficient.\n");
		return;
	}

	var pref_prefix = "msim.devicelist." + carrier + "." + id;
	pref.setUnicharPref("msim.current.carrier", pref
					.copyUnicharPref(pref_prefix + ".carrier"));
	pref.setUnicharPref("msim.current.device", pref.copyUnicharPref(pref_prefix
					+ ".device"));

	var useragent = pref.copyUnicharPref(pref_prefix + ".useragent");
	if (SOFTBANK == carrier) {
		useragent = getSoftBankUserAgent(useragent, pref
						.copyUnicharPref("msim.config.SB.serial"));
	}

	pref.setUnicharPref("general.useragent.override", useragent);
	pref.setUnicharPref("msim.current.useragent", useragent);
	pref.setUnicharPref("msim.current.id", id);

	msim.updateIcon();
};

function getSoftBankUserAgent(useragent, serial) {
	var notifySerial = pref.getBoolPref("msim.config.SB.notifyserial");
	if (true == notifySerial) {
		useragent = useragent.replace("[/Serial]", "/" + serial);
	} else {
		useragent = useragent.replace("[/Serial]", "");
	}
	dump("SB UA:" + useragent + "\n");
	return useragent;
}

dump("carrier.js is loaded.\n");
