(function (global) {
	"use strict";
	
	var CMN = global.CMN = global.CMN || {};
	
	CMN.rand = (function () {
		var I = {}; // I will be the returned object instance.
		
		// Get a random float less than 0 <= result < 1.
		I.nextFloat = function () {
			return Math.random();
		};

	    // Get a random integer (32-bit signed, positive only).
		I.nextInt32 = function () {
		    return Math.floor(Math.random() * CMN.misc.maxInt32);
		};

		// Get a random float in range: 0 <= result < high.
		I.nextRangedFloat = function (high) {
			return Math.random() * high;
		};
		
		// Get a random integer in range: 0 <= result < high.
		I.nextRangedInt = function (high) {
			return Math.floor(Math.random() * high);
		};

		// Get a random boolean.
		I.nextBool = function () {
			return Math.random() >= 0.5;
		};
		
		I.nextWeightedInt = function (weights, weightsSum) {
		    var randNum,
                i,
			    thisOnesWeight,
			    choiceIndex;
			
		    if (weights === undefined || weights.length === 0) {
				throw new Error("No weights given.");
			}

			if (weightsSum === undefined) {
			    weightsSum = 0;
			    for (i = 0; i < weights.length; i++) {
			        weightsSum += weights[i];
			    }
			}
			
			randNum = I.nextRangedFloat(weightsSum);
			
			for (choiceIndex = 0; choiceIndex < weights.length; choiceIndex++) {
				thisOnesWeight = weights[choiceIndex];
				if (randNum < thisOnesWeight) {
					return choiceIndex;
				}
				randNum -= thisOnesWeight;
			}
			
			// The code should never get here in normal operation.
			throw new Error("Computational error, the weights sum was less than expected.");
		};

		I.nextWeightedRangedInt = function (maximums, weights, weightsSum) {
		    var chosen = I.nextWeightedInt(weights, weightsSum),
                thisMax = maximums[chosen],
                previousMax = chosen === 0 ? 0 : maximums[chosen - 1];

		    if (chosen < 0 || chosen >= weights.length) {
		        throw new Error("The nextWeightedInt method shat on nextWeightedRangedInt.");
		    }

		    return I.nextRangedInt(thisMax - previousMax) + previousMax;
		}

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
			r = I.nextRangedInt(range) + min;
			g = I.nextRangedInt(range) + min;
			b = I.nextRangedInt(range) + min;
			
			return r << 16 | g << 8 | b;
		};
		
		// Return the exposed object instance.
		return I;
	}
		());
	
}
	(this));
