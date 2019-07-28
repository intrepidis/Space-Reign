(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	rand = cmnMisc.rand,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector;
	
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
		} while (cmnMisc.containsSwearing(name));
		
		return name;
	}
	
	spaceReign.Solar = function (solarName) {
		var thisSolar = this;
		// Solar system name. If undefined then will be randomly generated. The seed comes from the "coord" value.
		(function () {
			var name = solarName;
			Object.defineProperty(thisSolar, 'name', {
				get : function () {
					return name || createName(thisSolar.coord);
				},
				set : function (n) {
					name = n;
				}
			});
		}
			());
		// 3D vector coordinates of the star. (Relative to a sector, NOT absolute space coordinates.)
		this.coord = Vector.Empty;
		// If the solar system is occupied.
		this.inhabited = false;
		// Magnitude of the sun.
		this.mass = 0.02;
		// Information about trade items.
		this.tradeItems = [];
	};
}
	(this));
