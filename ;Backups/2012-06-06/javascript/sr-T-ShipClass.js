(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector;
	
	// A type of vessel.
	spaceReign.ShipClass = function (name, speed) {
		this.name = name;
		this.speed = speed;
	};
}
	(this));
