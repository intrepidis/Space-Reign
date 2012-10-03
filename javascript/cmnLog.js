(function (global) {
	"use strict";
	
	var CMN = global.CMN = global.CMN || {},
	console = global.console;
	
	// Application wide logging.
	CMN.log = (function () {
		var X = {}, // Exposed (public) members here.
		N = {}; // Enclosed (private) members here.
		
		(function ENCLOSED_FIELDS() {
			N.text = '';
		}
			());
		
		(function EXPOSED_METHODS() {
			// If the value is undefined then only the name is written to log.
			X.add = function (name, value) {
				var str;
				
				if (value === undefined) {
					str = name;
				} else {
					str = '{0}: {1}'.format(name, JSON.stringify(value));
				}
				
				console.log(str);
				N.text += str + '\n';
			};
			
			X.clear = function () {
				N.text = '';
			};
			
			X.get = function () {
				return N.text;
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
