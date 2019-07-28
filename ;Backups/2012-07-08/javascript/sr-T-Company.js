(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN;
	
	// The details of a Company (Kingdom / Empire / State / Organisation).
	SR.Company = function (companyName, emblemColor) {
		if (typeof companyName !== 'string') {
			throw new Error("The company must be a valid string.")
		}
		this.name = companyName;
		this.color = emblemColor || 0xFFFFFF;
	};
}
	(this));
