(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN;
	
	// Metrics of an actual vessel.
	SR.Vessel = function (shipOwner, shipName, shipClassIndex, shipCoord, shipDest) {
		// The owner should be a Company object.
		this.owner = shipOwner;
		
		// The name of the vessel.
		this.name = shipName;
		
		// The index in the ship classes array.
		this.classIndex = shipClassIndex;
		this.coord = shipCoord;
		
		// The destination should be a Solar object.
		this.dest = shipDest;
		
		// If the ship is at it's destination.
		this.arrived = CMN.spatial.compare(shipCoord, shipDest.coord) === 0;
		
		// The contents of the hold. Each element is a trade item.
		this.hold = [];
	};
	
	SR.Vessel.prototype = {
		getNameWithShipClass : function () {
			var shipType = SR.shipClasses.item[this.classIndex].name,
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
