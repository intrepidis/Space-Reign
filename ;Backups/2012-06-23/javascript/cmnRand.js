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
		
		// Return the object instance.
		return I;
	}
		());
	
}
	(this));
