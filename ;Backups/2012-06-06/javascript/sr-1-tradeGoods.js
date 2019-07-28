(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {};
	
	spaceReign.tradeGoods = {
		// Define the names of the trade items.
		TradeItemNames : ["Gem-stones", "Food", "Water", "Oil", "Flish"],
		
		GetIndexByName : function (itemName) {
			return this.TradeItemNames.indexOf(itemName);
		}
	};
}
	(this));
