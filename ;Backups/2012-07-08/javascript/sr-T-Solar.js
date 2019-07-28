(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log,
	rand = CMN.rand;
	
	function createName(spaceCoords) {
		var name,
		nameLength,
		alphs = ['bcdfghjklmnpqrstvwxyz', 'aehiouy'],
		alphCount,
		minSpanOfChars = 2,
		maxSpanOfChars = 16,
		count,
		range,
		choice,
		ch,
		possibilityOfASpace = 0.3,
		countSincePrevSpace;
		
		Math.seedrandom('{0},{1},{2}'.format(spaceCoords.x, spaceCoords.y, spaceCoords.z));
		
		// For the name length, want a low chance of 2 chars, a high chance of 8 chars
		// and a medium chance of 16 chars.
		(function () {
			var min = minSpanOfChars,
			max = maxSpanOfChars,
			mid = (max - min) / 2 + min,
			minChance = 0.01,
			maxChance = 0.2,
			midChance = 0.5,
			weights = [],
			weightsSum = 0.0,
			i,
			scale = minChance,
			adder = (midChance - minChance) / (mid - min);
			for (i = min; i < mid; i++) {
				weights[i - min] = scale;
				weightsSum += scale;
				scale += adder;
			}
			
			scale = midChance;
			adder = (maxChance - midChance) / (max - mid);
			for (i = mid; i <= max; i++) {
				weights[i - min] = scale;
				weightsSum += scale;
				scale += adder;
			}
			
			nameLength = rand.nextWeightedInt(min, max, weights, weightsSum);
			log.add('Length of solar name to be randomly created', nameLength);
		}
			());
		
		alphCount = rand.nextRangedInt(alphs.length);
		countSincePrevSpace = 0;
		do {
			// Create name.
			name = '';
			for (count = 0; count < nameLength; count++) {
				range = alphs[alphCount].length;
				choice = Math.floor(Math.random() * range);
				ch = alphs[alphCount].charAt(choice);
				if (countSincePrevSpace === 0) {
					ch = ch.toUpperCase();
				}
				name += ch;
				
				// Increment and roll the alphas count.
				alphCount++;
				if (alphCount === alphs.length) {
					alphCount = 0;
				}
				
				// Possible space character.
				countSincePrevSpace++;
				if (countSincePrevSpace >= minSpanOfChars) {
					choice = Math.random();
					if (choice < possibilityOfASpace) {
						// Add a space.
						name += ' ';
						// Reduce the possibility.
						possibilityOfASpace /= 2;
						countSincePrevSpace = 0;
					}
				}
			}
			
			// Check for swears.
		} while (CMN.misc.containsSwearing(name));
		
		return name;
	}
	
	SR.Solar = function (coord) {
		var T = this;
		
		// 3D vector coordinates of the star. (Relative to a sector, NOT absolute space coordinates.)
		Object.defineProperty(T, 'coord', {
			get : function () {
				return coord;
			}
		});
		
		// Define the solar system name as a property. If undefined then it will be randomly generated, with the seed coming from the "coord" value.
		(function () {
			var solarName;
			Object.defineProperty(T, 'name', {
				get : function () {
					return solarName || createName(T.coord);
				},
				set : function (n) {
					solarName = n;
				}
			});
		}
			());
		
		// If the solar system is occupied.
		T.inhabited = false;
		
		// Magnitude of the sun.
		T.mass = 0.02;
		
		// Information about trade items.
		T.tradeItems = [];
		
		// The current owner of the solar system.
		T.owner = null;
	};
}
	(this));
