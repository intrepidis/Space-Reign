(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log,
	rand = CMN.rand;
	
	function createSolarName(spaceCoords) {
		Math.seedrandom('{0},{1},{2}'.format(spaceCoords.x, spaceCoords.y, spaceCoords.z));
		return CMN.misc.createName();
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
					return solarName || createSolarName(T.coord);
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
		
		// Info about which trade items are held at this solar system.
		T.hold = [];
		
		// The current owner of the solar system.
		T.owner = null;
	};
}
	(this));
