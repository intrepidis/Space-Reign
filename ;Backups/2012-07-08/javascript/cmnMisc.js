(function (global) {
	"use strict";
	
	var CMN = global.CMN = global.CMN || {};
	
	// Might as well store these values.
	Math.PI2 = Math.PI * 2;
	Math.PIh = Math.PI / 2;
	
	// Extra methods for arrays.
	Array.prototype.insert = function (index, item) {
		this.splice(index, 0, item);
	};
	
	Array.prototype.remove = function (index) {
		this.splice(index, 1);
	};
	
	// Extra methods for strings.
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
			if (m === "{{") {
				return "{";
			}
			if (m === "}}") {
				return "}";
			}
			return args[n];
		});
	};
	
	(function PAD_STRING_EXTENSIONS() {
		function padder(padFunc, str, size, chr) {
			var i,
			s = str;
			
			if (chr === undefined) {
				chr = ' ';
			}
			for (i = s.length; i < size; i++) {
				s = padFunc(s, chr);
			}
			return s;
		}
		
		String.prototype.padLeft = function (size, chr) {
			var padFunc = function (str, chr) {
				return chr + str;
			};
			return padder(padFunc, this, size, chr);
		};
		
		String.prototype.padRight = function (size, chr) {
			var padFunc = function (str, chr) {
				return str + chr;
			};
			return padder(padFunc, this, size, chr);
		};
	}
		());
	
	CMN.misc = (function () {
		var X = {}, // Exposed (public) members here.
		N = {}; // Enclosed (private) members here.
		
		(function ENCLOSED_FIELDS() {
			N.minInt32 = Math.pow(-2, 31);
			N.maxInt32 =  - (N.minInt32 + 1);
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'minInt32', {
				get : function () {
					return N.minInt32;
				}
			});
			
			Object.defineProperty(X, 'maxInt32', {
				get : function () {
					return N.maxInt32;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			X.clone = function (obj) {
				var copy,
				attr,
				i;
				
				// Handle the value types, and null or undefined.
				if (obj === null || typeof obj !== "object") {
					return obj;
				}
				
				// Handle the Date type.
				if (obj instanceof Date) {
					copy = new Date();
					copy.setTime(obj.getTime());
					return copy;
				}
				
				// Handle the Array type.
				if (obj instanceof Array) {
					copy = [];
					for (i = 0; i < obj.length; i++) {
						copy[i] = X.clone(obj[i]);
					}
					return copy;
				}
				
				// Handle an Object type.
				if (obj instanceof Object) {
					copy = {};
					for (attr in obj) {
						if (obj.hasOwnProperty(attr)) {
							copy[attr] = X.clone(obj[attr]);
						}
					}
					return copy;
				}
				
				throw new Error("Unable to clone the object. Its type isn't supported.");
			};
			
			X.escapeHtmlEntities = function (str) {
				if (jQuery !== undefined) {
					// Create an empty div to use as a container, then put the raw text in
					// and get the HTML equivalent out.
					return jQuery('<div/>').text(str).html();
				}
				
				// No jQuery, so use a simple replace.
				return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
			};
			
			X.setCookie = function (c_name, value, expiredays) {
				var exdate = new Date();
				exdate.setDate(exdate.getDate() + expiredays);
				document.cookie = c_name + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toUTCString());
			};
			
			X.getCookie = function (c_name) {
				var c_start,
				c_end;
				if (document.cookie.length > 0) {
					c_start = document.cookie.indexOf(c_name + "=");
					if (c_start !== -1) {
						c_start += c_name.length + 1;
						c_end = document.cookie.indexOf(";", c_start);
						if (c_end === -1) {
							c_end = document.cookie.length;
						}
						return unescape(document.cookie.substring(c_start, c_end));
					}
				}
				return 0;
			};
			
			// Return 'i' constrained to the specified bounds.
			X.withinBounds = function (i, min, max) {
				if (i > max) {
					return max;
				}
				
				if (i < min) {
					return min;
				}
				
				return i;
			};
			
			X.spanMilliseconds = function (startTime, endTime) {
				var startMills,
				endMills,
				retval;
				startMills = startTime.getTime();
				endMills = endTime.getTime();
				retval = endMills - startMills;
				return retval;
			};
			
			X.spanMilliStr5 = function (startTime, endTime) {
				var mills,
				retval;
				mills = X.spanMilliseconds(startTime, endTime);
				retval = mills.toString().padLeft(5);
				return retval;
			};
			
			X.containsSwearing = (function () {
				var swears = $.base64.decode('c2hpdCxmdWNrLHdhbmssY3VudCxjb2NrLHBlbmlzLHB1c3N5LHZhZ2luYSxwcmljayxhaWRzLGFyc2UsYmxvd2pvYixib2xsb2NrLGRpY2toZWFkLGR1bWJhc3MscXVlZXIsd2hvcmUsc2x1dCxuaWdnLG5lZ3Isc3Vjayx0d2F0').split(',');
				return function (word) {
					var count;
					
					for (count = 0; count < swears.length; count++) {
						if (word.indexOf(swears[count]) !== -1) {
							return true;
						}
					}
					
					return false;
				};
			}
				());
			
			X.postToUrl = function (path, params, target) {
				var form,
				key,
				hiddenField;
				
				form = document.createElement("form");
				form.setAttribute("method", "post");
				form.setAttribute("action", path);
				form.setAttribute("style", "display:none");
				if (target) {
					form.setAttribute("target", target);
				}
				
				/*jslint forin: true */
				for (key in params) {
					hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", key);
					hiddenField.setAttribute("value", params[key]);
					form.appendChild(hiddenField);
				}
				/*jslint forin: false */
				
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
			};
			
			X.getFrameDocument = function (frameId) {
				var d1,
				d2;
				d1 = document.getElementById(frameId);
				d2 = (d1.contentWindow || d1.contentDocument);
				if (d2.document) {
					d2 = d2.document;
				}
				return d2;
			};
			
			X.romanize = (function () {
				var lookup = {
					M : 1000,
					CM : 900,
					D : 500,
					CD : 400,
					C : 100,
					XC : 90,
					L : 50,
					XL : 40,
					X : 10,
					IX : 9,
					V : 5,
					IV : 4,
					I : 1
				};
				return function (num) {
					var i,
					roman = '';
					for (i in lookup) {
						while (num >= lookup[i]) {
							roman += i;
							num -= lookup[i];
						}
					}
					return roman;
				};
			}
				());
			
			X.deromanize = (function () {
				var lookup = {
					I : 1,
					V : 5,
					X : 10,
					L : 50,
					C : 100,
					D : 500,
					M : 1000
				};
				return function (roman) {
					var val,
					num = 0;
					roman = roman.toUpperCase().split('');
					while (roman.length) {
						val = lookup[roman.shift()];
						num += val * (val < lookup[roman[0]] ? -1 : 1);
					}
					return num;
				};
			}
				());
			
			X.coordsToString = function (vector, decimalPlaces) {
				if (typeof decimalPlaces !== 'number') {
					decimalPlaces = 1;
				}
				function f(name) {
					return vector[name].toFixed(decimalPlaces);
				}
				if (vector.z !== undefined) {
					return '{0},{1},{2}'.format(f('x'), f('y'), f('z'));
				} else {
					return '{0},{1}'.format(f('x'), f('y'));
				}
			};
		}
			());
		
		(function EXPOSED_INNER_CLASSES() {
			X.PageQueryClass = function (q) {
				var i;
				
				if (q.length > 1 && q[0] === "?") {
					this.q = q.substring(1, q.length);
				} else {
					this.q = null;
				}
				
				this.keyValuePairs = [];
				if (q) {
					for (i = 0; i < this.q.split("&").length; i++) {
						this.keyValuePairs[i] = this.q.split("&")[i];
					}
				}
				
				this.getKeyValuePairs = function () {
					return this.keyValuePairs;
				};
				
				this.getRawValue = function (key) {
					var j;
					for (j = 0; j < this.keyValuePairs.length; j++) {
						if (this.keyValuePairs[j].split("=")[0] === key) {
							return this.keyValuePairs[j].split("=")[1];
						}
					}
					return false;
				};
				
				this.getValue = function (key) {
					return unescape(this.getRawValue(key));
				};
				
				this.getParameters = function () {
					var a,
					j;
					a = new Array(this.getLength());
					for (j = 0; j < this.keyValuePairs.length; j++) {
						a[j] = this.keyValuePairs[j].split("=")[0];
					}
					return a;
				};
				
				this.getLength = function () {
					return this.keyValuePairs.length;
				};
			};
			
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
