(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {};
	
	// A holacre is a standard cube unit of measure for interstella shipments.
	spaceReign.TradeItem = function (itemName) {
		// Name of the goods.
		this.name = itemName;
		// How much the solar system will pay for a holacre of the goods.
		this.importPrice = 0;
		// How much the solar system sells a holacre of the goods for.
		this.exportPrice = 0;
		// How many of the goods the solar system currently has.
		// (In holacres, as a rough estimate. Can be negative, meaning in heavy demand.)
		this.quantity = 0;
	};
}
	(this));
