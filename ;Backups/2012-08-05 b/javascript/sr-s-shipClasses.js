(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {};
	
	// The types of vessel class available.
	SR.shipClasses = (function () {
		var N = {}, // Enclosed (private) members are here.
		X = {}; // Exposed (public) members are here.
		
		(function ENCLOSED_FIELDS() {
			N.classes = [];
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'item', {
				get : function () {
					return N.classes;
				}
			});
			
			Object.defineProperty(X, 'length', {
				get : function () {
					return N.classes.length;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			X.init = function () {
				// Standard ships move by warping space.
				N.classes.push(new SR.ShipClass('Runt', 1 / 1000));
				N.classes.push(new SR.ShipClass('Rump', 2.5 / 1000));
				
				// This class of ship doesn't move but travels by folding space. (AKA. heighliner)
				N.classes.push(new SR.ShipClass('Void-folder', CMN.misc.maxInt32));
			};
			
			X.getIndex = function (name) {
				var i;
				for (i = 0; i < N.classes.length; i++) {
					if (N.classes[i].name === name) {
						return i;
					}
				}
				throw new Error("A ship class with the name {0} wasn't found.".format(name));
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
