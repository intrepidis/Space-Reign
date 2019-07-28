(function (global) {
	"use strict";
	
	var nasherNS = global.nasherNS = global.nasherNS || {};
	
	nasherNS.singletonExample = (function () {
		var X = {}, // This will be the publically exposed object instance.
		N = {}; // Enclosed (private) members shall reside here.
		
		(function ENCLOSED_FIELDS() {
			N.toggle = false;
			N.text = '';
			N.count = 0;
			N.numbers = [1, 2, 3];
		}
			());
		
		(function ENCLOSED_METHODS() {
			// An enclosed instance method.
			N.tweak = function () {
				N.toggle = !N.toggle;
				if (N.toggle) {
					X.count++;
				}
				N.incrementNumbersByCount();
				N.text = 'tweaked';
			};
			
			// An enclosed instance method that references exposed members.
			N.incrementNumbersByCount = function () {
				var i;
				for (i = 0; i < X.numbers.length; i++) {
					X.numbers[i] += X.count;
				}
			};
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'numberCount', {
				get : function () {
					return this.numbers.length;
				}
			});
			
			Object.defineProperty(X, 'count', {
				get : function () {
					return N.count;
				}
			});
			
			Object.defineProperty(X, 'numbers', {
				get : function () {
					return N.numbers;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			// Expose an enclosed function.
			X.tweak = N.tweak;
		}
			());
		
		// Return the object instance.
		return X;
	}
		());
	
	nasherNS.TypeExample = (function () {
		var U = function () { // U is the type and here is it's constructor.
			// Pseudo-private members:
			var priv = this.priv = {};
			priv.toggle = false;
			priv.text = '';
			
			// Public members:
			this.count = 0;
			this.numbers = [1, 2, 3];
			
			// This is how a public field would have property accessors applied:
			Object.defineProperty(this, 'numberCount', {
				get : function () {
					return this.numbers.length;
				}
			});
		};
		
		// Public prototype functions:
		U.prototype = {
			incrementNumbersByCount : function () {
				var i;
				for (i = 0; i < this.numbers.length; i++) {
					this.numbers[i] += this.count;
				}
			},
			tweak : function () {
				var priv = this.priv;
				priv.toggle = !priv.toggle;
				if (priv.toggle) {
					this.count++;
				}
				priv.text = 'tweaked';
			}
		};
		
		return U;
	}
		());
	
	nasherNS.singletonTemplate = (function () {
		var X = {}, // Exposed (public) members here.
		N = {}; // Enclosed (private) members here.
		
		(function ENCLOSED_FIELDS() {
			N.myField = 0;
		}
			());
		
		(function ENCLOSED_METHODS() {
			N.myMethod = function () {
				N.myField++;
			};
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'myProperty', {
				get : function () {
					return N.myField;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			X.myMethod = N.myMethod;
		}
			());
		
		// Return the object instance.
		return X;
	}
		());
}
	(this));
