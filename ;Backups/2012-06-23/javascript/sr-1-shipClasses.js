(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {};
	
	// The types of vessel class available.
	SR.shipClasses = (function () {
		var ar = [];
		
		// Standard ships move by warping space.
		ar.push(new SR.ShipClass('Runt', 1/1000));
		ar.push(new SR.ShipClass('Rump', 2.5/1000));
		
		// This class of ship doesn't move but travels by folding space. (AKA. heighliner)
		ar.push(new SR.ShipClass('Void-folder', CMN.misc.maxInt32));
		
		return ar;
	}
		());
}
	(this));
