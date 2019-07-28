(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log;
	
	SR.starChartRenderVessels = (function () {
		var X = {}, // This will be the publically exposed object instance.
		N = {}; // Enclosed (private) members shall reside here.
		
		(function ENCLOSED_FIELDS() {
			N.renderedShipsModel = undefined;
		}
			());
		
		(function EXPOSED_METHODS() {
			X.process = function () {
				var i,
				vessels,
				shipModel,
				sides = SR.starChartRenderSectors.getSides();
				
				// Remove the currently rendered vessels.
				SR.starChartVisuals.scene.remove(N.renderedShipsModel);
				
				// Create a model containing the ships to be rendered.
				N.renderedShipsModel = new THREE.Object3D();
				vessels = SR.vessels.getVesselsInArea(sides);
				for (i = 0; i < vessels.length; i++) {
					shipModel = SR.starChartModels.createShipModel(vessels[i]);
					N.renderedShipsModel.add(shipModel);
				}
				
				// Add the ships model to the scene.
				SR.starChartVisuals.scene.add(N.renderedShipsModel);
			};
			
			X.init = function () {};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
