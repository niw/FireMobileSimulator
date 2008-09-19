/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is MobileSimulator.
 *
 * The Initial Developer of the Original Code is
 * Takahiro Horikawa.
 * Portions created by the Initial Developer are Copyright (C) 2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const kSCHEME = "device";
const kPROTOCOL_NAME = "KDDI device protocol";
const kPROTOCOL_CONTRACTID = "@mozilla.org/network/protocol;1?name=" + kSCHEME;
const kPROTOCOL_CID = Components.ID("79e63cb7-ba95-40c5-902d-edb918b4679c");

function Protocol(){
}

Protocol.prototype = {
	QueryInterface: function(iid){
		if (!iid.equals(Ci.nsIProtocolHandler) &&
				!iid.equals(Ci.nsISupports))
			throw Cr.NS_ERROR_NO_INTERFACE;
		return this;
	},

	scheme: kSCHEME,
	defaultPort: -1,
	protocolFlags: Ci.nsIProtocolHandler.URI_NORELATIVE | Ci.nsIProtocolHandler.URI_NOAUTH,

	allowPort: function(port, scheme){
		return false;
	},

	newURI: function(spec, charset, baseURI){
		var uri = Cc["@mozilla.org/network/simple-uri;1"].createInstance(Ci.nsIURI);
		dump("spce:"+spec+"\n");
		uri.spec = spec;
		return uri;
	},

	newChannel: function(aURI){
		var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
		if(aURI.asciiSpec.indexOf("device:location")==0 || aURI.asciiSpec.indexOf("device:gpsone") == 0){
			return ios.newChannel("chrome://msim/content/html/au_gps.html", null, null);
		}else{
			return ios.newChannel("chrome://msim/content/html/error.html", null, null);
		}
	}
};

var ProtocolFactory = {
	createInstance: function (outer, iid){
		if (outer != null)
			throw Cr.NS_ERROR_NO_AGGREGATION;

		if (!iid.equals(Ci.nsIProtocolHandler) &&
				!iid.equals(Ci.nsISupports))
			throw Cr.NS_ERROR_NO_INTERFACE;

		return new Protocol();
	}
};

var myModule = {
	registerSelf: function (compMgr, fileSpec, location, type){
		compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
		compMgr.registerFactoryLocation(
			kPROTOCOL_CID,
			kPROTOCOL_NAME,
			kPROTOCOL_CONTRACTID,
			fileSpec,
			location,
			type
		);
	},

	getClassObject: function (compMgr, cid, iid){
		if (!cid.equals(kPROTOCOL_CID))
			throw Cr.NS_ERROR_NO_INTERFACE;

		if (!iid.equals(Ci.nsIFactory))
			throw Cr.NS_ERROR_NOT_IMPLEMENTED;

		return ProtocolFactory;
	},

	canUnload: function (compMgr){
		return true;
	}
};

function NSGetModule(compMgr, fileSpec){
	return myModule;
}
