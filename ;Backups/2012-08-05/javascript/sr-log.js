(function (global) {
	"use strict";
	
	var CMN = global.CMN = global.CMN || {};
	
	CMN.log = CMN.log || {};
	
	CMN.log.mouse = function (msg) {
		//CMN.log.add('MOUSE', msg);
	};
	
	CMN.log.renderSectors = function (msg) {
		CMN.log.add('REND-SECT', msg);
	};
}
	(this));
