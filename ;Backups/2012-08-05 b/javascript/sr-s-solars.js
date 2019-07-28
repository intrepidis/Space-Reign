(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log,
	rand = CMN.rand;
	
	// Space is made up of sectors containing solar systems.
	SR.solars = (function () {
		var N = {}, // Enclosed (private) members are here.
		X = {}; // Exposed (public) members are here.
		
		(function ENCLOSED_FIELDS() {
			N.sectors = [];
			N.v1 = new CMN.Vector(1, 1, 1);
			N.v2 = new CMN.Vector(2, 2, 2);
			
			// (Sizes are relative to the sector size which has a width, height and depth of 1.)
			// sectorSize = { x: 1, y: 1, z: 1 }
			N.sectorCount = new CMN.Vector(0, 0);
			
			N.numberOfSectors = 0;
			N.averageStarsPerSector = 0.0;
			N.margin = 0.0;
			N.minStarsPerSector = 0.0;
			N.maxStarsPerSector = 0.0;
			N.rangeStarsPerSector = 0.0;
		}
			());
		
		(function ENCLOSED_METHODS() {
			// This creates a solar system with the specified coordinate.
			N.createSolar = function (coord) {
				var i,
				sol;
				
				function makeTradeItem(i) {
					var ti = new SR.TradeItem(i);
					ti.ImportPrice = rand.nextInt32();
					ti.ExportPrice = rand.nextInt32();
					ti.Quantity = rand.nextInt32();
					return ti;
				}
				
				sol = new SR.Solar(coord);
				sol.inhabited = rand.nextBool();
				for (i = 0; i < SR.tradeItems.length; i++) {
					sol.hold.push(makeTradeItem(i));
				}
				return sol;
			};
			
			// Create stars in a sector of the universe.
			N.createSectorSolars = function (sectorCoord) {
				var i,
				numSolars,
				sols;
				
				numSolars = N.minStarsPerSector + rand.nextRangedInt(N.rangeStarsPerSector);
				
				sols = [];
				for (i = 1; i <= numSolars; i++) {
					//sols.push(createSolarWithin(topLeft, bottomRight));
					// (Sizes are relative to the sector size which has a width, height and depth of 1.)
					sols.push(N.createSolar(rand.nextVectorFloat(N.v1).add(sectorCoord)));
				}
				sols.sort(function (s1, s2) {
					return CMN.spatial.compare(s1.coord, s2.coord);
				});
				return sols;
			};
		}
			());
		
		(function EXPOSED_FIELDS() {
			// The bottom-left back-most point of space is zero.
			X.firstSector = new CMN.Vector(0, 0, 0);
			
			// The top-right front-most point of space.
			X.finalSector = new CMN.Vector(
					N.sectorCount.x - 1,
					N.sectorCount.y - 1,
					1);
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			// The star map.
			Object.defineProperty(X, 'sectors', {
				get : function () {
					return N.sectors;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			// This creates a solar system at the specified coordinate, and adds it to the star chart.
			X.addSolar = function (coord) {
				var sectorX = Math.floor(coord.x),
				sectorY = Math.floor(coord.y),
				sols = N.sectors[sectorX][sectorY];
				sols.push(N.createSolar(coord));
			};
			
			// Create the star map of sectors.
			X.generateStarMap = function (numberOfSolarSystems, sectorCount) {
				var ar,
				coord = new CMN.Vector(0, 0);
				
				N.sectorCount = sectorCount;
				X.finalSector.x = sectorCount.x - 1;
				X.finalSector.y = sectorCount.y - 1;
				
				N.numberOfSectors = N.sectorCount.x * N.sectorCount.y;
				N.averageStarsPerSector = numberOfSolarSystems / N.numberOfSectors;
				N.margin = Math.max(1, N.averageStarsPerSector / 10);
				N.minStarsPerSector = Math.max(0, N.averageStarsPerSector - N.margin);
				N.maxStarsPerSector = N.averageStarsPerSector + N.margin;
				N.rangeStarsPerSector = N.maxStarsPerSector - N.minStarsPerSector + 1;
				
				// Start with an empty array of sectors.
				N.sectors = [];
				
				for (coord.x = 0; coord.x < N.sectorCount.x; coord.x++) {
					ar = [];
					for (coord.y = 0; coord.y < N.sectorCount.y; coord.y++) {
						ar[coord.y] = N.createSectorSolars(coord);
					}
					N.sectors[coord.x] = ar;
				}
			};
			
			X.getSolarsInRegion = function (bounds) {
				var foundObjects = [], // A collection of collided objects.
				firstSector,
				finalSector,
				sectorBounds = {},
				column,
				sector,
				sol,
				cx,
				cy,
				i;
				
				function pickLeast(a, b) {
					return Math.floor(Math.min(a, b));
				}
				
				function pickMost(a, b) {
					return Math.floor(Math.max(a, b));
				}
				
				sectorBounds.low = {};
				sectorBounds.high = {};
				
				sectorBounds.low.back = CMN.spatial.rationNearFarToDepth(bounds.low.far, bounds.low.near, 0);
				sectorBounds.low.front = CMN.spatial.rationNearFarToDepth(bounds.low.far, bounds.low.near, 1);
				sectorBounds.high.back = CMN.spatial.rationNearFarToDepth(bounds.high.far, bounds.high.near, 0);
				sectorBounds.high.front = CMN.spatial.rationNearFarToDepth(bounds.high.far, bounds.high.near, 1);
				
				// Find which sectors intersect with the screen region.
				firstSector = {
					x : pickLeast(sectorBounds.low.back.x, sectorBounds.low.front.x),
					y : pickLeast(sectorBounds.low.back.y, sectorBounds.low.front.y)
				};
				
				finalSector = {
					x : pickMost(sectorBounds.high.back.x, sectorBounds.high.front.x),
					y : pickMost(sectorBounds.high.back.y, sectorBounds.high.front.y)
				};
				
				// Fix sector indexes that are out of bounds.
				firstSector = {
					x : pickMost(SR.solars.firstSector.x, firstSector.x),
					y : pickMost(SR.solars.firstSector.y, firstSector.y)
				};
				
				finalSector = {
					x : pickLeast(SR.solars.finalSector.x, finalSector.x),
					y : pickLeast(SR.solars.finalSector.y, finalSector.y)
				};
				
				// Collision test all found sectors.
				for (cx = firstSector.x; cx <= finalSector.x; cx++) {
					column = N.sectors[cx];
					for (cy = firstSector.y; cy <= finalSector.y; cy++) {
						sector = column[cy];
						// Collision test all solars in the sector.
						for (i = 0; i < sector.length; i++) {
							sol = sector[i];
							if (CMN.spatial.coordIsWithinCube(bounds, sol.coord)) {
								foundObjects.push(sol);
							}
						}
					}
				}
				
				return foundObjects;
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
