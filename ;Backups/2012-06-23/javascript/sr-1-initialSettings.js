(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN;
	
	SR.initialSettings = (function () {
		var timeMarginFraction = 0.2;
		
		return {
			epsilon : 0.01,
			
			// Set a margin that the Governor tries to keep processing time within desired frame rate.
			timeMarginMultiplier : 1 - timeMarginFraction,
			minMarginFraction : 0.01,
			
			// Used in Governor to determine when to update workload proportions.
			numItersToWait : 5,
			
			// Average number of stars in the universe.
			numberOfSolarSystems : 10000,
			
			// Sectors define space as a checker board.
			// (Sizes are relative to the sector size which has a width, height and depth of 1.)
			//sectorSize: { x: 1, y: 1, z: 1 },
			// This is how many sectors in the star map, horizontally and vertically.
			// This is most top-right point of space.
			sectorCount : new CMN.Vector(80, 48),
			
			minZoom : 2,
			maxZoom : 14,
			defZoom : 10,
			
			cameraAngle : 60,
			cameraNear : 0.5,
			cameraFar : 80,
			
			fov : Math.PI * (1 - 1 / 2),
			zNearest : 1,
			zFurthest : 100000,
			
			framesPerSecond : 30
		};
	}
		());
}
	(this));
