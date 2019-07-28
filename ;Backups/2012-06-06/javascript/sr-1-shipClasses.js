(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	ShipClass = spaceReign.ShipClass;
	
	// The types of vessel class available.
	spaceReign.shipClasses = (function () {
		var ar = [];
		
		// Standard ships move by warping space.
		ar.push(new ShipClass('Runt', 1));
		ar.push(new ShipClass('Rump', 2.5));
		
		// This class of ship doesn't move but travels by folding space. (AKA. heighliner)
		ar.push(new ShipClass('Void-folder', 0));
		
		return ar;
	}
		());
}
	(this));
