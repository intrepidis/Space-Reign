(function (global) {
	"use strict";
	
	var CMN = global.CMN = global.CMN || {};
	
	CMN.rand = (function () {
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
			return Math.floor(Math.random() * CMN.misc.maxInt32);
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
		
		I.nextColor = function (min, max) {
			var range,
			r,
			g,
			b;
			
			min = min || 0;
			max = max || 255;
			
			if (min < 0 || max > 255) {
				throw new Error("Both 'min' and 'max' should be between 0 and 255 (inclusive).");
			}
			
			if (min >= max) {
				throw new Error("The 'min' argument should be less than the 'max' argument.");
			}
			
			range = max - min;
			r = CMN.rand.nextRangedInt(range) + min;
			g = CMN.rand.nextRangedInt(range) + min;
			b = CMN.rand.nextRangedInt(range) + min;
			
			return r << 16 | g << 8 | b;
		};
		
		// Return the exposed object instance.
		return I;
	}
		());
	
}
	(this));
