(function (global) {
	"use strict";
	
	var log = global.cmnLog = global.cmnLog || {};
	
	log.mouse = function (msg) {
		log.add('MOUSE', msg);
	};
}
	(this));
