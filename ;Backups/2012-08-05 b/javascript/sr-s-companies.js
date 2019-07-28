(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log;
	
	SR.companies = (function () {
		var N = {}, // Enclosed (private) members are here.
		X = {}; // Exposed (public) members are here.
		
		(function EXPOSED_FIELDS() {
			// This is how far through the company list "iterateTask" has traversed.
			X.taskStateIndex = 0;
			
			// Here is the portion that "iterateTask" is allowed process in one calling.
			X.taskPortion = CMN.misc.maxInt32;
			
			// This is a single player game, so this is the player's company.
			X.playerCompany = new SR.Company('Player Company', 0xFF00FF);
			
			// The array of all computer controlled companies in the game.
			X.computerCompanies = [];
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			// This is how many jobs "iterateTask" needs to do. (The number of computer controlled companies.)
			X.taskCount = 0;
			Object.defineProperty(X, 'taskCount', {
				get : function () {
					return X.computerCompanies.length;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			X.init = function () {};
			
			// This manages the coordination of vessels.
			X.iterateTask = function () {};
		}
			());
		
		return X;
	}
		());
}
	(this));
