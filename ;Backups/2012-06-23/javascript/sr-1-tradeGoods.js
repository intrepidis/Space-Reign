(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {};
	
	SR.tradeGoods = {
		// Define the names of the trade items.
		TradeItemNames : ["Gem-stones", "Food", "Water", "Oil", "Flish"],
		
		GetIndexByName : function (itemName) {
			return this.TradeItemNames.indexOf(itemName);
		}
	};
}
	(this));
