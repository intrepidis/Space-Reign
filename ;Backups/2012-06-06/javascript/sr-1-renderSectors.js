(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	initialSettings = spaceReign.initialSettings,
	starMap = spaceReign.starMap,
	models = spaceReign.models;
	
	spaceReign.renderSectors = (function () {
		var sides = { // the sides of the viewed rectangle of sectors
			from : { // the start sector (inclusive)
				x : 0,
				y : 0
			},
			to : { // the end sector (exclusive)
				x : 0,
				y : 0
			}
		},
		sectors = [],
		visuals;
		
		function renderRowOfSectorModels(bag) {
			var x,
			y,
			j,
			arr = [],
			sectorModel,
			solsDataArray,
			solModel;
			
			// Iterate the visible sectors.
			y = Math.floor(bag.startY);
			for (x = Math.floor(bag.startX); x < bag.xEnd; x++) {
				sectorModel = new THREE.Object3D();
				
				// Get data about the stars in the sector.
				solsDataArray = starMap.sectors[x][y];
				
				// Iterate the stars.
				for (j = 0; j < solsDataArray.length; j++) {
					// Create the model of a star and add to the sector model.
					solModel = models.createSolarModel(solsDataArray[j]);
					sectorModel.add(solModel);
				}
				
				// Draw the sector's struts.
				sectorModel.add(models.createSectorStrutsModel());
				
				// Move the whole sector into position.
				sectorModel.position.set(x, y, 0);
				
				// Add the sector to my array and the THREE scene.
				arr.push(sectorModel);
				visuals.scene.add(sectorModel);
			}
			return arr;
		}
		
		// Remember: this will add to the end in order, but
		// add to the beginning in reverse order.
		function addSectorRows(bag) {
			var i,
			row;
			
			bag.xEnd = bag.startX + bag.fullWidth;
			
			// Add sector rows.
			for (i = 0; i < bag.addSize; i++) {
				row = renderRowOfSectorModels(bag);
				if (bag.atBeginning) {
					sectors.unshift(row);
				} else {
					sectors.push(row);
				}
				bag.startY++;
			}
		}
		
		// This will always add in order, at either end.
		function addSectorColumns(bag) {
			var i,
			cols;
			
			bag.xEnd = bag.startX + bag.addSize;
			
			// Add columns to each sector row.
			for (i = 0; i < sectors.length; i++) {
				cols = renderRowOfSectorModels(bag);
				if (bag.atBeginning) {
					sectors[i] = cols.concat(sectors[i]);
				} else {
					sectors[i] = sectors[i].concat(cols);
				}
				bag.startY++;
			}
		}
		
		function addSectors(newSides) {
			var bag = {}; // bits and gubbins
			
			// Add sectors to the left.
			bag.addSize = sides.from.x - newSides.from.x;
			if (bag.addSize > 0) {
				bag.startX = newSides.from.x;
				bag.startY = newSides.from.y;
				bag.atBeginning = true;
				addSectorColumns(bag);
			}
			
			// Add sectors to the right.
			bag.addSize = newSides.to.x - sides.to.x;
			if (bag.addSize > 0) {
				bag.startX = sides.to.x;
				bag.startY = newSides.from.y;
				bag.atBeginning = false;
				addSectorColumns(bag);
			}
			
			bag.fullWidth = newSides.to.x - newSides.from.x;
			
			// Add sectors to the bottom.
			bag.addSize = sides.from.y - newSides.from.y;
			if (bag.addSize > 0) {
				bag.startX = newSides.from.x;
				bag.startY = newSides.from.y;
				bag.atBeginning = true;
				addSectorRows(bag);
			}
			
			// Add sectors to the top. (y > 0)
			bag.addSize = newSides.to.y - sides.to.y;
			if (bag.addSize > 0) {
				bag.startX = newSides.from.x;
				bag.startY = sides.to.y;
				bag.atBeginning = false;
				addSectorRows(bag);
			}
		}
		
		function removeArrayOfSectors(arr) {
			var i;
			for (i = 0; i < arr.length; i++) {
				visuals.scene.remove(arr[i]);
			}
		}
		
		function removeSectorRows(index, removeHeight) {
			var i,
			rows;
			
			if (removeHeight <= 0) {
				return;
			}
			
			// Remove sector rows.
			rows = sectors.splice(index, removeHeight);
			for (i = 0; i < rows.length; i++) {
				removeArrayOfSectors(rows[i]);
			}
		}
		
		function removeSectorColumns(index, removeWidth) {
			var i,
			cols;
			
			if (removeWidth <= 0) {
				return;
			}
			
			// Remove sector columns from each row.
			for (i = 0; i < sectors.length; i++) {
				cols = sectors[i].splice(index, removeWidth);
				removeArrayOfSectors(cols);
			}
		}
		
		function removeSectors(newSides) {
			var removeSize;
			
			// Remove sectors as necessary.
			removeSize = newSides.from.y - sides.from.y;
			removeSectorRows(0, removeSize);
			
			removeSize = sides.to.y - newSides.to.y;
			removeSectorRows(-removeSize, removeSize);
			
			removeSize = newSides.from.x - sides.from.x;
			removeSectorColumns(0, removeSize);
			
			removeSize = sides.to.x - newSides.to.x;
			removeSectorColumns(-removeSize, removeSize);
		}
		
		function determineSides() {
			var r;
			
			if (visuals.c.camera.near !== 1) {
				r = cmnSpatial.sidesAtDepthWithinBounds(visuals.projector, visuals.c.camera, starMap.finalSector);
				r.to.x++;
				r.to.y++;
				return r;
			}
			
			return cmnMisc.clone(sides);
		}
		
		function process() {
			var newSides = determineSides();
			removeSectors(newSides);
			addSectors(newSides);
			sides = newSides;
		}
		
		function init(spaceReign_visuals) {
			var newSides;
			visuals = spaceReign_visuals;
			
			newSides = determineSides();
			addSectors(newSides);
			sides = newSides;
		}
		
		return {
			init : init,
			process : process,
			sectors : sectors
		};
	}
		());
}
	(this));
