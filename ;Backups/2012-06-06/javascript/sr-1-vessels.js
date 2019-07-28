(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	rand = cmnMisc.rand,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	initialSettings = spaceReign.initialSettings,
	TradeItem = spaceReign.TradeItem,
	Solar = spaceReign.Solar,
	ShipClass = spaceReign.ShipClass,
	Vessel = spaceReign.Vessel,
	tradeGoods = spaceReign.tradeGoods,
	shipClasses = spaceReign.shipClasses,
	starMap = spaceReign.starMap;
	
	spaceReign.vessels = (function () {
		var X = {}, // This will be the publically exposed object instance.
		N = {}; // Enclosed (private) members shall reside here.
		
		(function ENCLOSED_METHODS() {
			N.chooseSystem = function () {
				var centre = initialSettings.sectorCount.div(new Vector(2, 2)),
				sector = starMap.sectors[centre.x][centre.y];
				if (sector.length === 0) {
					// A fix for when a sector doesn't have any stars.
					return new Solar();
				}
				return sector[rand.nextRangedInt(sector.length)];
			};
			
			N.makeShip = function () {
				var classIndex = rand.nextRangedInt(shipClasses.length),
				// (Sizes are relative to the sector size which has a width, height and depth of 1.)
				// vx = rand.nextRangedFloat(1),
				// vy = rand.nextRangedFloat(1),
				coord = new Vector(0, 0, 0),
				dest = N.chooseSystem();
				return new Vessel(undefined, classIndex, coord, dest);
			};
			
			// Create an array of ships to have in the game.
			N.createAllShips = function () {
				var i,
				ar = [];
				for (i = 0; i < initialSettings.initialNumberOfShips; i++) {
					ar.push(N.makeShip());
				}
				return ar;
			};
		}
			());
		
		(function EXPOSED_FIELDS() {
			// This is how far through the ship list "iterateTask" has traversed.
			X.taskStateIndex = 0;
			
			// Here is the portion that "iterateTask" is allowed process in one calling.
			X.taskPortion = cmnMisc.maxInt32;
			
			// The array of all ships in the game.
			X.allShips = N.createAllShips();
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
			// This manages the coordination of vessels.
			X.iterateTask = function () {
				var i,
				s,
				startIndex,
				tuple,
				endIndex,
				extraEndIndex,
				dilation = X.taskCount / X.taskPortion;
				
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
					ratioVector = new Vector(ratio, ratio);
					result = hereCoord.add(distCoord).mul(ratioVector);
					return {
						coord : result,
						arrived : false
					};
				}
				
				// A function to move a ship closer to it's destination.
				function moveShip(ship) {
					if (!ship.arrived) {
						var v = moveStep(ship.coord, ship.dest.coord, (shipClasses[ship.classIndex].speed * dilation));
						ship.coord = v.coord;
						ship.arrived = v.arrived;
					}
				}
				
				// Move the allowed portion of ships *that are currently in transit*.
				startIndex = X.taskStateIndex;
				tuple = (function () {
					var e,
					count;
					
					count = X.allShips.length;
					e = -1 + startIndex + (X.taskPortion > count ? count : X.taskPortion);
					
					if (e < count) {
						return [e, -1];
					}
					
					return [count - 1, e - count];
				}
					());
				endIndex = tuple[0];
				extraEndIndex = tuple[1];
				
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
		}
			());
		
		return X;
	}
		());
}
	(this));
