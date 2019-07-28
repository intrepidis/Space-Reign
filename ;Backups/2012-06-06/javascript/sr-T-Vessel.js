(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector;
	
	// Metrics of an actual vessel.
	spaceReign.Vessel = function (shipName, shipClassIndex, shipCoord, shipDest) {
		this.name = shipName;
		// The index in the ship classes array.
		this.classIndex = shipClassIndex;
		this.coord = shipCoord;
		this.dest = shipDest;
		// If the ship is at it's destination.
		this.arrived = false;
	};
	spaceReign.Vessel.prototype = {
		changeName : function (newName) {
			this.name = newName;
		}
	};
}
	(this));
