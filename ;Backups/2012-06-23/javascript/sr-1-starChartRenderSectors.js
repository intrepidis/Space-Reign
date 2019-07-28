(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log;
	
	SR.starChartRenderSectors = (function () {
		var X = {}, // This will be the publically exposed object instance.
		N = {}; // Enclosed (private) members shall reside here.
		
		(function ENCLOSED_FIELDS() {
			// The sides of the viewed rectangle of sectors.
			// The start sector is inclusive, the end sector is exclusive.
			N.sides = new CMN.Bounds(0, 0, 0, 0);
			N.sectors = [];
		}
			());
		
		(function ENCLOSED_METHODS() {
			N.renderRowOfSectorModels = function (bag) {
				var x,
				y,
				j,
				arr = [],
				sectorModel,
				solsDataArray,
				solData,
				position,
				solModel;
				
				// Iterate the visible sectors.
				y = Math.floor(bag.startY);
				for (x = Math.floor(bag.startX); x < bag.xEnd; x++) {
					sectorModel = new THREE.Object3D();
					
					// Get data about the stars in the sector.
					solsDataArray = SR.starMap.sectors[x][y];
					
					// Iterate the stars.
					for (j = 0; j < solsDataArray.length; j++) {
						solData = solsDataArray[j];
						position = {
							x : solData.coord.x - x,
							y : solData.coord.y - y,
							z : solData.coord.z
						};
						// Create the model of a star and add to the sector model.
						solModel = SR.starChartModels.createSolarModel(solData.mass, position);
						sectorModel.add(solModel);
					}
					
					// Draw the sector's struts.
					sectorModel.add(SR.starChartModels.createSectorStrutsModel());
					
					// Move the whole sector into position.
					sectorModel.position.set(x, y, 0);
					
					// Add the sector to my array and the THREE scene.
					arr.push(sectorModel);
					SR.starChartVisuals.scene.add(sectorModel);
				}
				return arr;
			};
			
			// Remember: this will add to the end in order, but
			// add to the beginning in reverse order.
			N.addSectorRows = function (bag) {
				var i,
				row;
				
				bag.xEnd = bag.startX + bag.fullWidth;
				
				// Add sector rows.
				for (i = 0; i < bag.addSize; i++) {
					row = N.renderRowOfSectorModels(bag);
					if (bag.atBeginning) {
						N.sectors.unshift(row);
					} else {
						N.sectors.push(row);
					}
					bag.startY++;
				}
			};
			
			// This will always add in order, at either end.
			N.addSectorColumns = function (bag) {
				var i,
				cols;
				
				bag.xEnd = bag.startX + bag.addSize;
				
				// Add columns to each sector row.
				for (i = 0; i < N.sectors.length; i++) {
					cols = N.renderRowOfSectorModels(bag);
					if (bag.atBeginning) {
						N.sectors[i] = cols.concat(N.sectors[i]);
					} else {
						N.sectors[i] = N.sectors[i].concat(cols);
					}
					bag.startY++;
				}
			};
			
			N.addSectors = function (newSides) {
				var bag = {}; // bits and gubbins
				
				// Add sectors to the left.
				bag.addSize = N.sides.from.x - newSides.from.x;
				if (bag.addSize > 0) {
					bag.startX = newSides.from.x;
					bag.startY = newSides.from.y;
					bag.atBeginning = true;
					N.addSectorColumns(bag);
				}
				
				// Add sectors to the right.
				bag.addSize = newSides.to.x - N.sides.to.x;
				if (bag.addSize > 0) {
					bag.startX = N.sides.to.x;
					bag.startY = newSides.from.y;
					bag.atBeginning = false;
					N.addSectorColumns(bag);
				}
				
				bag.fullWidth = newSides.to.x - newSides.from.x;
				
				// Add sectors to the bottom.
				bag.addSize = N.sides.from.y - newSides.from.y;
				if (bag.addSize > 0) {
					bag.startX = newSides.from.x;
					bag.startY = newSides.from.y;
					bag.atBeginning = true;
					N.addSectorRows(bag);
				}
				
				// Add sectors to the top. (y > 0)
				bag.addSize = newSides.to.y - N.sides.to.y;
				if (bag.addSize > 0) {
					bag.startX = newSides.from.x;
					bag.startY = N.sides.to.y;
					bag.atBeginning = false;
					N.addSectorRows(bag);
				}
			};
			
			N.removeArrayOfSectors = function (arr) {
				var i;
				for (i = 0; i < arr.length; i++) {
					SR.starChartVisuals.scene.remove(arr[i]);
				}
			};
			
			N.removeSectorRows = function (index, removeHeight) {
				var i,
				rows;
				
				if (removeHeight <= 0) {
					return;
				}
				
				// Remove sector rows.
				rows = N.sectors.splice(index, removeHeight);
				for (i = 0; i < rows.length; i++) {
					N.removeArrayOfSectors(rows[i]);
				}
			};
			
			N.removeSectorColumns = function (index, removeWidth) {
				var i,
				cols;
				
				if (removeWidth <= 0) {
					return;
				}
				
				// Remove sector columns from each row.
				for (i = 0; i < N.sectors.length; i++) {
					cols = N.sectors[i].splice(index, removeWidth);
					N.removeArrayOfSectors(cols);
				}
			};
			
			N.removeSectors = function (newSides) {
				var removeSize;
				
				// Remove sectors as necessary.
				removeSize = newSides.from.y - N.sides.from.y;
				N.removeSectorRows(0, removeSize);
				
				removeSize = N.sides.to.y - newSides.to.y;
				N.removeSectorRows(-removeSize, removeSize);
				
				removeSize = newSides.from.x - N.sides.from.x;
				N.removeSectorColumns(0, removeSize);
				
				removeSize = N.sides.to.x - newSides.to.x;
				N.removeSectorColumns(-removeSize, removeSize);
			};
			
			N.determineSides = function () {
				var r;
				
				if (SR.starChartVisuals.camera.near !== 1) {
					r = CMN.spatial.sidesAtDepthWithinBounds(SR.starChartVisuals.projector, SR.starChartVisuals.camera, SR.starMap.finalSector);
					r.to.x++;
					r.to.y++;
					return r;
				}
				
				return new CMN.Bounds(N.sides.from.x, N.sides.from.y, N.sides.to.x, N.sides.to.y);
			};
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'sectors', {
				get : function () {
					return N.sectors;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			X.getSides = function () {
				return new CMN.Bounds(N.sides.from.x, N.sides.from.y, N.sides.to.x, N.sides.to.y);
			};
			
			X.process = function () {
				var newSides = N.determineSides();
				N.removeSectors(newSides);
				N.addSectors(newSides);
				N.sides = newSides;
			};
			
			X.init = function () {
				var newSides;
				
				newSides = N.determineSides();
				N.addSectors(newSides);
				N.sides = newSides;
			};
		}
			());
		
		// Return the object instance.
		return X;
	}
		());
}
	(this));
