(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log;
	
	SR.textures = (function () {
		var X = {}, // Exposed (public) members here.
		N = {}; // Enclosed (private) members here.
		
		(function ENCLOSED_FIELDS() {
			N.imgDir = '../Images/';
		}
			());
		
		(function EXPOSED_FIELDS() {
			X.sun = THREE.ImageUtils.loadTexture(N.imgDir + 'sun.png');
			X.pinkLove = THREE.ImageUtils.loadTexture(N.imgDir + 'pink_love.png');
			X.whiteCircle = THREE.ImageUtils.loadTexture(N.imgDir + 'white_circle.png');
			X.whiteRing = THREE.ImageUtils.loadTexture(N.imgDir + 'white_ring.png');
		}
			());
		
		(function EXPOSED_METHODS() {
			X.init = function () {
				// Load the images in parallel and begin the game ticker once loaded.
				//scene.loadImages(imageNames, ticker);
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
	
}
	(this));
