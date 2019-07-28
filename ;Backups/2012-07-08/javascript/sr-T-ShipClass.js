(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN;
	
	// A type of vessel.
	SR.ShipClass = function (name, speed) {
		this.name = name;
		this.speed = speed;
	};
}
	(this));
