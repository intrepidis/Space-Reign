(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {};
	
	SR.tradeItems = (function () {
		var N = {}, // Enclosed (private) members are here.
		X = {}; // Exposed (public) members are here.
		
		(function EXPOSED_FIELDS() {
			// Define the names of the trade items.
			X.item = ["Gem-stones", "Food", "Water", "Oil", "Flish"];
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'length', {
				get : function () {
					return X.item.length;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			X.getIndexByName = function (itemName) {
				return X.item.indexOf(itemName);
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
