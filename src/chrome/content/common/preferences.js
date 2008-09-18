var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
jsLoader.loadSubScript("chrome://global/content/nsUserSettings.js");

var pref = {
	__proto__ : nsPreferences,
	
	get mPrefService2()
	{
		return Components.classes["@mozilla.org/preferences-service;1"].
			getService(Components.interfaces.nsIPrefService).getBranch("");
	},
	
	deletePref : function(preference)
	{
		if(this.mPrefService2.prefHasUserValue(preference))
		{
			this.mPrefService2.clearUserPref(preference);
		}
	}
}
