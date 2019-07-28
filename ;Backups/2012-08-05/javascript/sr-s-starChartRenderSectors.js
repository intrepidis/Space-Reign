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
			N.renderRowOfSectorModels = function (startX, startY, xEnd) {
				var x,
				y,
				j,
				arr = [],
				sectorModel,
				solsDataArray,
				sol,
				position;
				
				// Iterate the visible sectors.
				y = Math.floor(startY);
				for (x = Math.floor(startX); x < xEnd; x++) {
					sectorModel = new THREE.Object3D();
					
					// Get data about the stars in the sector.
					solsDataArray = SR.solars.sectors[x][y];
					
					sectorModel.name = '({0},{1}) count: {2}'.format(x, y, solsDataArray.length);
					log.renderSectors(sectorModel.name);
					
					// Iterate the stars.
					for (j = 0; j < solsDataArray.length; j++) {
						sol = solsDataArray[j];
						position = {
							x : sol.coord.x - x,
							y : sol.coord.y - y,
							z : sol.coord.z
						};
						if (position.x < 0 || position.x >= 1 || position.y < 0 || position.y >= 1) {
							throw new Error("The solar coordinate was out of bounds.");
						}
						// Create the model of a star and add to the sector model.
						sectorModel.add(SR.starChartModels.createSolarModel(sol.mass, position));
						if (sol.owner) {
							sectorModel.add(SR.starChartModels.createSolarOwnerEmblem(sol.mass, position, sol.owner.color));
						}
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
			N.addSectorRows = function (startX, startY, fullWidth, addSize, xEnd, atBeginning) {
				var i,
				row;
				
				xEnd = startX + fullWidth;
				
				// Add sector rows.
				for (i = 0; i < addSize; i++) {
					row = N.renderRowOfSectorModels(startX, startY, xEnd);
					if (atBeginning) {
						N.sectors.unshift(row);
					} else {
						N.sectors.push(row);
					}
					//N.insaneCheckRow(row);
					//N.insaneCheck();
					startY++;
				}
			};
			
			// This will always add in order, at either end.
			N.addSectorColumns = function (startX, startY, addSize, xEnd, atBeginning) {
				var i,
				cols;
				
				xEnd = startX + addSize;
				
				// Add columns to each sector row.
				for (i = 0; i < N.sectors.length; i++) {
					cols = N.renderRowOfSectorModels(startX, startY, xEnd);
					if (atBeginning) {
						N.sectors[i] = cols.concat(N.sectors[i]);
					} else {
						N.sectors[i] = N.sectors[i].concat(cols);
					}
					//N.insaneCheckRow(N.sectors[i]);
					//N.insaneCheck();
					startY++;
				}
			};
			
			N.addSectors = function (newSides) {
				var startX, startY, fullWidth, addSize, xEnd, atBeginning;
				
				startY = Math.max(N.sides.from.y, newSides.from.y);
				
				// Add sectors to the left.
				addSize = N.sides.from.x - newSides.from.x;
				if (addSize > 0) {
					startX = newSides.from.x;
					atBeginning = true;
					N.addSectorColumns(startX, startY, addSize, xEnd, atBeginning);
				}
				
				// Add sectors to the right.
				addSize = newSides.to.x - N.sides.to.x;
				if (addSize > 0) {
					startX = N.sides.to.x;
					atBeginning = false;
					N.addSectorColumns(startX, startY, addSize, xEnd, atBeginning);
				}
				
				startX = newSides.from.x;
				fullWidth = newSides.to.x - newSides.from.x;
				
				// Add sectors to the bottom.
				addSize = N.sides.from.y - newSides.from.y;
				if (addSize > 0) {
					startY = newSides.from.y;
					atBeginning = true;
					N.addSectorRows(startX, startY, fullWidth, addSize, xEnd, atBeginning);
				}
				
				// Add sectors to the top. (y > 0)
				addSize = newSides.to.y - N.sides.to.y;
				if (addSize > 0) {
					startY = N.sides.to.y;
					atBeginning = false;
					N.addSectorRows(startX, startY, fullWidth, addSize, xEnd, atBeginning);
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
				var r = CMN.spatial.sidesAtDepthWithinBounds(SR.starChartVisuals.projector, SR.starChartVisuals.camera, SR.solars.finalSector);
				r = r.roundedOut();
				return r;
			};
			
			N.insaneCheckRow = function (row) {
				var j,
				yRow = undefined,
				yCell,
				cell;
				
				for (j = 0; j < row.length; j++) {
					cell = row[j];
					yCell = cell.position.y;
					if (yRow === undefined) {
						yRow = yCell;
					} else if (yRow != yCell) {
						debugger;
						return true;
					}
				}
				return false;
			};
			
			N.insaneCheck = function () {
				var i,
				yShould,
				row;
				
				if (N.sectors.length == 0) {
					return false;
				}
				
				for (i = 0; i < N.sectors.length; i++) {
					row = N.sectors[i];
					if (N.insaneCheckRow(row)) {
						return true;
					}
				}
				
				yShould = N.sectors[0][0].position.y;
					for (i = 1; i < N.sectors.length; i++) {
						row = N.sectors[i];
						yShould++;
						if (row[0].position.y != yShould) {
							debugger;
							return true;
						}
					}
					
					return false;
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
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
