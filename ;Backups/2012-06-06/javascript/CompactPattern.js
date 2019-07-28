(function (global) {
	"use strict";
	
	var nasherNS = global.nasherNS = global.nasherNS || {};
	
	// An example of the modular pattern gone bad.
	/// ACTUALLY, A RUBBISH EXAMPLE!
	nasherNS.badModule = (function () {
		var size={x:2,y:2};
		
		function resize(newSize) {
			size = newSize;
		}
		
		return {
			resize : resize,
			size : size
		};
	}
		());
	
	nasherNS.singletonExample = (function () {
		var X = {}, // This will be the publically exposed object instance.
		N = {}; // Enclosed (private) members shall reside here.
		
		(function ENCLOSED_FIELDS() {
			N.toggle = false,
			N.text = '';
		}
			());
		
		(function ENCLOSED_METHODS() {
			// An enclosed instance method.
			N.tweak = function () {
				N.toggle = !N.toggle;
				if (N.toggle) {
					X.count++;
				}
				N.text = 'tweaked';
			};
		}
			());
		
		(function EXPOSED_FIELDS() {
			X.count = 0;
			X.numbers = [1, 2, 3];
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			// A public field with property accessors applied.
			X.numberCount = 0;
			Object.defineProperty(X, 'numberCount', {
				get : function () {
					return this.numbers.length;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			// Expose an enclosed function.
			X.tweak = N.tweak;
			
			// An enclosed instance method that references exposed members.
			X.incrementNumbersByCount = function () {
				var i;
				for (i = 0; i < X.numbers.length; i++) {
					X.numbers[i] += X.count;
				}
			};
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
			this.numberCount = 0;
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
}
	(this));
