(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN;
	
	// Metrics of an actual vessel.
	SR.Vessel = function (shipName, shipClassIndex, shipCoord, shipDest) {
		this.name = shipName;
		// The index in the ship classes array.
		this.classIndex = shipClassIndex;
		this.coord = shipCoord;
		this.dest = shipDest;
		// If the ship is at it's destination.
		this.arrived = false;
	};
	SR.Vessel.prototype = {
		changeName : function (newName) {
			this.name = newName;
		},
		getNameWithShipClass : function () {
			var shipType = SR.shipClasses[this.classIndex].name,
			shipTypeText = 'ship type';
			if (this.name) {
				return '{2} ({0}: {1})'.format(shipTypeText, shipType, this.name);
			} else {
				return '{0}: {1}'.format(shipTypeText, shipType);
			}
		}
	};
}
	(this));
