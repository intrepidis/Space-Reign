(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log;
	
	SR.gameLoader = (function () {
		var X = {}, // Exposed (public) members here.
		N = {}; // Enclosed (private) members here.
		
		(function ENCLOSED_FIELDS() {
			// something
		}
			());
		
		(function ENCLOSED_METHODS() {
			// something
		}
			());
		
		(function EXPOSED_METHODS() {
			X.loadGame = function () {
				var bag = {}; // bits and gubbins
				
				// The seed the random generator.
				bag.starMapRandSeed = 'wencid';
				Math.seedrandom(bag.starMapRandSeed);
				
				// Average number of stars in the universe.
				bag.numberOfSolarSystems = 10000;
				
				// Sectors define space as a checker board.
				// (Sizes are relative to the sector size which has a width, height and depth of 1.)
				// sectorSize = { x: 1, y: 1, z: 1 }
				// This is how many sectors in the star map, horizontally and vertically.
				// This is most top-right point of space.
				bag.sectorCount = new CMN.Vector(80, 48);
				// Where the player's start solar is.
				bag.startSector = new CMN.Vector(bag.sectorCount.x / 2, 2);
				bag.solarCoord = CMN.rand.nextVectorFloat(new CMN.Vector(1, 1, 1)).add(bag.startSector);
				
				SR.solars.generateStarMap(bag.numberOfSolarSystems, bag.sectorCount);
				
				SR.companies.init();
				SR.shipClasses.init();
				SR.vessels.init();
				SR.textures.init();
				SR.starChartVisuals.init(bag.solarCoord);
				SR.controls.init();
				
				// Grab a sol and turn it into the player's start solar (but they don't own it).
				if (SR.solars.sectors[bag.startSector.x][bag.startSector.y].length === 0) {
					// No sol exists in this sector, so let's add it.
					SR.solars.addSolar(bag.solarCoord);
				}
				bag.sol = SR.solars.sectors[bag.startSector.x][bag.startSector.y][0];
				bag.sol.name = 'Lahe Lopa';
				
				// Create the player's first vessel.
				bag.classIndex = SR.shipClasses.getIndex('Runt');
				bag.ship = SR.vessels.addShip(bag.classIndex, SR.companies.playerCompany, bag.sol);
				
				// Do a final check that no solar systems have the same name.
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
	
}
	(this));
