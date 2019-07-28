(function (global) {
	"use strict";
	
	// Application wide logging.
	var cmnLog = global.cmnLog = global.cmnLog || {},
	console = global.console,
	text = '';
	
	// If the value is undefined then only the name is written to log.
	cmnLog.add = function (name, value) {
		var str;
		
		if (value === undefined) {
			str = name;
		} else {
			str = '{0}={1}'.format(name, JSON.stringify(value));
		}
		
		console.log(str);
		text = text + str + '\n';
	};
	
	cmnLog.clear = function () {
		text = '';
	};
	
	cmnLog.get = function () {
		return text;
	};
}
	(this));
