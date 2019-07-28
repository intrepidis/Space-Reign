(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {};
	
	// A holacre is a standard cube unit of measure for interstella shipments.
	SR.TradeItem = function (nameIndex) {
		// The index in the trade item names array.
		this.nameIndex = nameIndex;
		// How much the solar system will pay for a holacre of the goods.
		this.importPrice = 0;
		// How much the solar system sells a holacre of the goods for.
		this.exportPrice = 0;
		// How many goods this instance represents.
		// (In holacres, as a rough estimate. Can be negative, meaning in heavy demand.)
		this.quantity = 0;
	};
}
	(this));
