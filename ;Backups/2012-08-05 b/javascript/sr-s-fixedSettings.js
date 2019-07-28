(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN;
	
	SR.fixedSettings = (function () {
		var timeMarginFraction = 0.2;
		
		return {
			epsilon : 0.01,
			
			// Set a margin that the Governor tries to keep processing time within desired frame rate.
			timeMarginMultiplier : 1 - timeMarginFraction,
			minMarginFraction : 0.01,
			
			// Used in Governor to determine when to update workload proportions.
			numItersToWait : 5,
			
			minZoom : 2,
			maxZoom : 14,
			defZoom : 10,
			
			cameraAngle : 60,
			cameraNear : 0.5,
			cameraFar : 80,
		};
	}
		());
}
	(this));
