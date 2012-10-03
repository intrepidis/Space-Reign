(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
    	CMN = global.CMN;

	// Metrics of an actual vessel.
	SR.Vessel = function (shipOwner, shipName, shipClassIndex, shipCoord, shipDest) {
	    var T = this;

	    // The owner should be a Company object.
		T.owner = shipOwner;
		
		// The name of the vessel.
		T.name = shipName;
		
		// The index in the ship classes array.
		T.classIndex = shipClassIndex;
		T.coord = shipCoord;
		
		// The destination should be a Solar object.
		T.dest = shipDest;
		
		// If the ship is at it's destination.
		T.arrived = CMN.spatial.compare(shipCoord, shipDest.coord) === 0;
		
	    // An array of trade items in the vessel's hold.
		T.hold = SR.tradeItems.makeTradeItems();
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
