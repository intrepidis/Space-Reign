(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log,
	rand = CMN.rand;
	
	SR.vessels = (function () {
		var X = {}, // This will be the publically exposed object instance.
		N = {}; // Enclosed (private) members shall reside here.
		
		(function ENCLOSED_METHODS() {
			N.chooseStarInSector = function (x, y) {
				var sector = SR.starMap.sectors[x][y];
				if (sector.length === 0) {
					// For when the sector doesn't have any stars.
					return null;
				}
				return sector[rand.nextRangedInt(sector.length)];
			};
			
			N.makeShip = (function () {
				var shipCount = 0;
				return function (dest) {
					var classIndex = rand.nextRangedInt(SR.shipClasses.length),
					// (Sizes are relative to the sector size which has a width, height and depth of 1.)
					x = dest.coord.x + rand.nextRangedFloat(4) - 2,
					y = dest.coord.y + rand.nextRangedFloat(4) - 2,
					z = rand.nextRangedFloat(1),
					coord = new CMN.Vector(x, y, z);
					// Ship name should be the player's company name (i.e. Nashtronic) plus a roman numeral number. (i.e. The Nashtronic IV.)
					return new SR.Vessel('Some ship ' + CMN.misc.romanize(++shipCount), classIndex, coord, dest);
				};
			}
				());
			
			// Create an array of ships to have in the game.
			N.createAllShips = function () {
				var ar = [],
				x,
				y,
				sol,
				ship;
				
				for (x = SR.starMap.firstSector.x; x <= SR.starMap.finalSector.x; x++) {
					for (y = SR.starMap.firstSector.y; y <= SR.starMap.finalSector.y; y++) {
						sol = N.chooseStarInSector(x, y);
						if (sol) {
							ship = N.makeShip(sol);
							ar.push(ship);
						}
					}
				}
				
				return ar;
			};
		}
			());
		
		(function EXPOSED_FIELDS() {
			// This is how far through the ship list "iterateTask" has traversed.
			X.taskStateIndex = 0;
			
			// Here is the portion that "iterateTask" is allowed process in one calling.
			X.taskPortion = CMN.misc.maxInt32;
			
			// The array of all ships in the game.
			X.allShips = [];
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			// This is how many jobs "iterateTask" needs to do. (The number of ships currently in transit.)
			X.taskCount = 0;
			Object.defineProperty(X, 'taskCount', {
				get : function () {
					return X.allShips.length;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			X.init = function () {
				X.allShips = N.createAllShips();
			};
			
			// This manages the coordination of vessels.
			X.iterateTask = function () {
				var i,
				s,
				startIndex,
				tuple,
				endIndex,
				extraEndIndex,
				dilation = 1;
				
				if (X.taskPortion < X.taskCount) {
					dilation = X.taskCount / X.taskPortion;
				}
				
				// A function to move a coordinate closer to a destination.
				// Returns the tuple (newCoordinate : DepthPoint, isAtDestination : bool)
				function moveStep(hereCoord, thereCoord, moveDistance) {
					var distCoord,
					fullDistance,
					ratio,
					ratioVector,
					result;
					
					distCoord = thereCoord.sub(hereCoord);
					fullDistance = distCoord.length;
					if (moveDistance > fullDistance) {
						// The move distance will over-shoot the target, so just return the destination.
						return {
							coord : thereCoord,
							arrived : true
						};
					}
					ratio = moveDistance / fullDistance;
					ratioVector = new CMN.Vector(ratio, ratio, ratio);
					result = hereCoord.add(distCoord.mul(ratioVector));
					return {
						coord : result,
						arrived : false
					};
				}
				
				// A function to move a ship closer to it's destination.
				function moveShip(ship) {
					if (!ship.arrived) {
						var v = moveStep(ship.coord, ship.dest.coord, (SR.shipClasses[ship.classIndex].speed * dilation));
						ship.coord = v.coord;
						ship.arrived = v.arrived;
					}
				}
				
				// Move the allowed portion of ships *that are currently in transit*.
				startIndex = X.taskStateIndex;
				(function () {
					var e,
					count;
					
					count = X.allShips.length;
					e = -1 + startIndex + (X.taskPortion > count ? count : X.taskPortion);
					
					if (e < count) {
						endIndex = e;
						extraEndIndex = -1;
					} else {
						endIndex = count - 1;
						extraEndIndex = e - count;
					}
				}
					());
				
				// Here I should be splitting the list into left, middle and right segments
				// and then joining them back after, perhaps.
				
				// Do the right portion.
				for (i = startIndex; i <= endIndex; i++) {
					moveShip(X.allShips[i]);
				}
				
				// Do the left portion.
				if (extraEndIndex >= 0) {
					for (i = 0; i <= extraEndIndex; i++) {
						moveShip(X.allShips[i]);
					}
					X.taskStateIndex = extraEndIndex + 1;
				} else {
					s = endIndex + 1;
					X.taskStateIndex = (s === X.allShips.length) ? 0 : s;
				}
			};
			
			X.getVesselsInArea = function (area) {
				var i,
				ship,
				ar = [];
				
				for (i = 0; i < X.allShips.length; i++) {
					ship = X.allShips[i];
					if (CMN.spatial.coordIsWithinSquare(area, ship.coord)) {
						ar.push(ship);
					}
				}
				
				return ar;
			};
			
			X.getVesselsInRegion = function (bounds) {
				var foundObjects = [], // A collection of collided objects.
				ship,
				i;
				
				// Collision test all vessels.
				for (i = 0; i < X.allShips.length; i++) {
					ship = X.allShips[i];
					if (CMN.spatial.coordIsWithinCube(bounds, ship.coord)) {
						foundObjects.push(ship);
					}
				}
				
				return foundObjects;
			};
		}
			());
		
		return X;
	}
		());
}
	(this));
