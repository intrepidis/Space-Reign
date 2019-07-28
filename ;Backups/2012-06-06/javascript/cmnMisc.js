(function (global) {
	"use strict";
	
	var cmnMisc = global.cmnMisc = global.cmnMisc || {},
	swears;
	
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
	
	cmnMisc.clone = function (obj) {
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
				copy[i] = cmnMisc.clone(obj[i]);
			}
			return copy;
		}
		
		// Handle an Object type.
		if (obj instanceof Object) {
			copy = {};
			for (attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = cmnMisc.clone(obj[attr]);
				}
			}
			return copy;
		}
		
		throw new Error("Unable to clone the object. Its type isn't supported.");
	};
	
	cmnMisc.escapeHtmlEntities = function (str) {
		if (jQuery !== undefined) {
			// Create an empty div to use as a container, then put the raw text in
			// and get the HTML equivalent out.
			return jQuery('<div/>').text(str).html();
		}
		
		// No jQuery, so use a simple replace.
		return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
	};
	
	cmnMisc.setCookie = function (c_name, value, expiredays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toUTCString());
	};
	
	cmnMisc.getCookie = function (c_name) {
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
	cmnMisc.withinBounds = function (i, min, max) {
		if (i > max) {
			return max;
		}
		
		if (i < min) {
			return min;
		}
		
		return i;
	};
	
	cmnMisc.spanMilliseconds = function (startTime, endTime) {
		var startMills,
		endMills,
		retval;
		startMills = startTime.getTime();
		endMills = endTime.getTime();
		retval = endMills - startMills;
		return retval;
	};
	
	cmnMisc.spanMilliStr5 = function (startTime, endTime) {
		var mills,
		retval;
		mills = cmnMisc.spanMilliseconds(startTime, endTime);
		retval = mills.toString().padLeft(5);
		return retval;
	};
	
	swears = $.base64.decode('c2hpdCxmdWNrLHdhbmssY3VudCxjb2NrLHBlbmlzLHB1c3N5LHZhZ2luYSxwcmljayxhaWRzLGFyc2UsYmxvd2pvYixib2xsb2NrLGRpY2toZWFkLGR1bWJhc3MscXVlZXIsd2hvcmUsc2x1dCxuaWdnLG5lZ3Isc3Vjayx0d2F0').split(',');
	cmnMisc.containsSwearing = function (word) {
		var count;
		
		for (count = 0; count < swears.length; count++) {
			if (word.indexOf(swears[count]) !== -1) {
				return true;
			}
		}
		
		return false;
	};
	
	/* cmnMisc.postToUrl = function (path, params, target) {
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
	
	/ *jslint forin: true * /
	for (key in params) {
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", key);
	hiddenField.setAttribute("value", params[key]);
	form.appendChild(hiddenField);
	}
	/ *jslint forin: false * /
	
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
	};*/
	
	/* cmnMisc.getFrameDocument = function (frameId) {
	var d1,
	d2;
	d1 = document.getElementById(frameId);
	d2 = (d1.contentWindow || d1.contentDocument);
	if (d2.document) {
	d2 = d2.document;
	}
	return d2;
	};*/
	
	/* cmnMisc.PageQueryClass = function (q) {
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
	};*/
	
	cmnMisc.minInt32 = Math.pow(-2, 31);
	cmnMisc.maxInt32 =  - (cmnMisc.minInt32 + 1);
	
	cmnMisc.rand = (function () {
		var I = {}; // I will be the returned object instance.
		
		// Get a random float less than 0 <= result < 1.
		I.nextFloat = function () {
			return Math.random();
		};
		
		// Get a random float in range: 0 <= result < high.
		I.nextRangedFloat = function (high) {
			return Math.random() * high;
		};
		
		// Get a random integer in range: 0 <= result < high.
		I.nextRangedInt = function (high) {
			return Math.floor(Math.random() * high);
		};
		
		// Get a random integer (32-bit signed, positive only).
		I.nextInt32 = function () {
			return Math.floor(Math.random() * cmnMisc.maxInt32);
		};
		
		// Get a random boolean.
		I.nextBool = function () {
			return Math.random() >= 0.5;
		};
		
		I.nextWeightedInt = function (low, high, weights, weightsSum) {
			var randNum,
			thisOnesWeight,
			choiceIndex;
			if (high <= low) {
				throw new Error("The high parameter should be greater than the low parameter.");
			}
			if (weights.length !== high + 1 - low) {
				throw new Error("Not the correct number of weights for the range of numbers.");
			}
			randNum = I.nextRangedFloat(weightsSum);
			for (choiceIndex = 0; choiceIndex < weights.length; choiceIndex++) {
				thisOnesWeight = weights[choiceIndex];
				if (randNum < thisOnesWeight) {
					return choiceIndex + low;
				}
				randNum -= thisOnesWeight;
			}
			// The code should never get here in normal operation.
			throw new Error("Computational error, the weights sum was less than expected.");
		};
		
		// Return the object instance.
		return I;
	}
		());
	
}
	(this));
