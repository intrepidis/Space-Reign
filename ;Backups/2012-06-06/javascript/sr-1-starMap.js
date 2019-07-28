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
	tradeGoods = spaceReign.tradeGoods,
	Solar = spaceReign.Solar;
	
	// Space is made up of sectors containing solar systems.
	spaceReign.starMap = (function () {
		var sectors,
		margin,
		numberOfSectors,
		minStarsPerSector,
		maxStarsPerSector,
		averageStarsPerSector,
		rangeStarsPerSector,
		ix,
		iy,
		ar,
		v1 = new Vector(1, 1, 1),
		v2 = new Vector(2, 2, 2);
		
		// (Sizes are relative to the sector size which has a width, height and depth of 1.)
		//sectorSize = new Vector(1, 1, 1);
		
		numberOfSectors = initialSettings.sectorCount.x * initialSettings.sectorCount.y;
		averageStarsPerSector = initialSettings.numberOfSolarSystems / numberOfSectors;
		margin = Math.max(1, averageStarsPerSector / 10);
		minStarsPerSector = Math.max(0, averageStarsPerSector - margin);
		maxStarsPerSector = averageStarsPerSector + margin;
		rangeStarsPerSector = maxStarsPerSector - minStarsPerSector + 1;
		
		// This creates a solar system within the specified area.
		function createSolar(area /*Vector*/
		) {
			var i,
			sol;
			
			function makeTradeItem() {
				var ti = new TradeItem();
				ti.ImportPrice = rand.nextInt32();
				ti.ExportPrice = rand.nextInt32();
				ti.Quantity = rand.nextInt32();
				return ti;
			}
			
			sol = new Solar();
			sol.coord = area;
			sol.inhabited = rand.nextBool();
			for (i = 0; i < tradeGoods.TradeItemNames.length; i++) {
				sol.tradeItems.push(makeTradeItem());
			}
			return sol;
		}
		
		// Create stars in a sector of the universe.
		function createSectorSolars() {
			var i,
			numSolars,
			sols;
			
			numSolars = minStarsPerSector + rand.nextRangedInt(rangeStarsPerSector);
			
			sols = [];
			for (i = 1; i <= numSolars; i++) {
				//sols.push(createSolarWithin(topLeft, bottomRight));
				// (Sizes are relative to the sector size which has a width, height and depth of 1.)
				sols.push(createSolar(rand.nextVectorFloat(v1)));
			}
			sols.sort(function (s1, s2) {
				return cmnSpatial.compare(s1.coord, s2.coord);
			});
			return sols;
		}
		
		// Create the star map of sectors.
		sectors = [];
		for (ix = 0; ix < initialSettings.sectorCount.x; ix++) {
			ar = [];
			for (iy = 0; iy < initialSettings.sectorCount.y; iy++) {
				ar[iy] = createSectorSolars(ix, iy);
			}
			sectors[ix] = ar;
		}
		
		return {
			// The bottom-left back-most point of space is zero.
			firstSector : new Vector(0, 0, 0),
			
			// The top-right front-most point of space.
			finalSector : new Vector(
				initialSettings.sectorCount.x - 1,
				initialSettings.sectorCount.y - 1,
				1),
			
			// The star map.
			sectors : sectors
		};
	}
		());
}
	(this));
