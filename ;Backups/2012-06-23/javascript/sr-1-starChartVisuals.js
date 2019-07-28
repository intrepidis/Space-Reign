(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log;
	
	SR.starChartVisuals = (function () {
		var X = {}, // Exposed (public) members here.
		N = {}; // Enclosed (private) members here.
		
		(function ENCLOSED_FIELDS() {
			N.winSize = {
				x : 0,
				y : 0
			};
			N.viewportSize = undefined;
			
			N.scene = new THREE.Scene();
			N.projector = new THREE.Projector();
			N.camera = new THREE.PerspectiveCamera(1, 1, 1, 1);
			N.viewPoint = new THREE.Vector3(0, 0, 0);
			N.renderer = new THREE.WebGLRenderer({
					antialias : true
				});
			
			N.imgDir = '../Images/';
			N.imageNames = undefined;
			N.sunTex = THREE.ImageUtils.loadTexture(N.imgDir + 'sun.png');
			N.pinkLoveTex = THREE.ImageUtils.loadTexture(N.imgDir + 'pink_love.png');
		}
			());
		
		(function ENCLOSED_METHODS() {
			N.render = function () {
				TWEEN.update();
				
				//            camera.position.x += (mouseX - camera.position.x) * 0.05;
				//            camera.position.y += (-mouseY - camera.position.y) * 0.05;
				// camera.position.x = 0.5;
				// camera.position.y = 0.5;
				
				// Always look down the z-axis (to mimic 1-point perspective).
				N.viewPoint.x = N.camera.position.x;
				N.viewPoint.y = N.camera.position.y;
				N.camera.lookAt(N.viewPoint);
				
				//            group.rotation.x += 0.01;
				//            group.rotation.y += 0.02;
				
				N.renderer.render(N.scene, N.camera);
			};
		}
			());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'imageNames', {
				get : function () {
					return N.imageNames;
				}
			});
			
			Object.defineProperty(X, 'scene', {
				get : function () {
					return N.scene;
				}
			});
			
			Object.defineProperty(X, 'projector', {
				get : function () {
					return N.projector;
				}
			});
			
			Object.defineProperty(X, 'camera', {
				get : function () {
					return N.camera;
				}
			});
		}
			());
		
		(function EXPOSED_METHODS() {
			X.init = function () {
				//var i;
				// Add dots down the z axis.
				//for (i = -10; i <= 20; i += 0.1) {if (i < 0 || i > 1) {scene.add(SR.starChartModels.createSolarModel({mass : 0.01,coord : {x : 0,y : 0,z : i}}));}}
				
				N.renderer.sortObjects = false;
				
				N.camera.position.x = 1.9;
				N.camera.position.y = 1.7;
				N.camera.position.z = 0; // This value can be zero here, because it is set in the controls init method.
				N.scene.add(N.camera);
				
				// Load the solars of each sector into the rendering engine.
				SR.starChartRenderSectors.init();
				SR.starChartRenderVessels.init();
			};
			
			X.resize = function () {
				var $starChartDiv,
				$window = $(window),
				prevWinSize = N.winSize,
				cameraPos;
				
				// Get the new window size.
				N.winSize = {
					x : $window.width(),
					y : $window.height()
				};
				
				if (N.winSize.x === prevWinSize.x && N.winSize.y === prevWinSize.y) {
					// The size hasn't actually changed.
					return;
				}
				
				cameraPos = {
					x : N.camera.position.x,
					y : N.camera.position.y,
					z : N.camera.position.z
				};
				N.scene.remove(N.camera);
				N.camera = new THREE.PerspectiveCamera(SR.initialSettings.cameraAngle, N.winSize.x / N.winSize.y, SR.initialSettings.cameraNear, SR.initialSettings.cameraFar);
				N.camera.position.x = cameraPos.x;
				N.camera.position.y = cameraPos.y;
				N.camera.position.z = cameraPos.z;
				N.scene.add(N.camera);
				
				// N.camera.viewAngle = 96;
				// N.camera.aspect = N.winSize.x / N.winSize.y;
				// N.camera.near = 0.5;
				// N.camera.far = 2;
				
				N.renderer.setSize(N.winSize.x, N.winSize.y);
				N.renderer.domElement.id = 'viewport';
				
				$starChartDiv = $('#viewportDiv');
				$starChartDiv.append(N.renderer.domElement);
				N.viewportSize = {
					x : $starChartDiv.width(),
					y : $starChartDiv.height() - 6 //cmn: annoying that this is the only way I know to fix the screen to space coordinates bug.
				};
			};
			
			X.draw = function () {
				// var sp = scene.Sprite('sun.png');
				// sp.size(55, 30);
				// sp.update();
				// sp.offset(50, 50);
				// sp.move(100, 100);
				// sp.rotate(3.14 / 4);
				// sp.scale(2);
				// sp.setOpacity(0.8);
				// sp.update();
				
				//plotStars();
				SR.starChartRenderSectors.process();
				SR.starChartRenderVessels.process();
				N.render();
				//stats.update();
			};
			
			X.moveCamera = function (screenFrom, screenTo) {
				var xDist,
				yDist,
				fromPoint,
				toPoint;
				
				fromPoint = CMN.spatial.screenPosToCoordsAtDepth(screenFrom, 1, N.viewportSize, N.projector, N.camera);
				toPoint = CMN.spatial.screenPosToCoordsAtDepth(screenTo, 1, N.viewportSize, N.projector, N.camera);
				
				xDist = fromPoint.x - toPoint.x;
				yDist = fromPoint.y - toPoint.y;
				
				N.camera.position.x += xDist;
				N.camera.position.y += yDist;
			};
			
			X.getObjectsInScreenRegion = function (screenPos, size) {
				var foundObjects,
				lineBottomLeft,
				lineTopRight,
				bounds = {};
				
				// Get the near-far coordinate pairs of the bottom-left and top-right lines of the region.
				// For each pair get the coordinates of the line going from the camera (minimum depth) at
				// the passed in screen position to the same position but at maximum depth.
				// (This works because the star chart is always viewed in one-point perspective.)
				bounds.low = CMN.spatial.screenPosToNearFarCoords({
						x : screenPos.x - size,
						y : screenPos.y + size
					}, N.viewportSize, N.projector, N.camera);
				
				bounds.high = CMN.spatial.screenPosToNearFarCoords({
						x : screenPos.x + size,
						y : screenPos.y - size
					}, N.viewportSize, N.projector, N.camera);
				
				/*
				// Put a box showing the hit region.
				scene.add(function () {
				var bln = CMN.spatial.rationNearFarToDepth(lineBottomLeft.near, lineBottomLeft.far, 1),
				blf = CMN.spatial.rationNearFarToDepth(lineBottomLeft.near, lineBottomLeft.far, 0),
				trn = CMN.spatial.rationNearFarToDepth(lineTopRight.near, lineTopRight.far, 1),
				trf = CMN.spatial.rationNearFarToDepth(lineTopRight.near, lineTopRight.far, 0);
				
				return SR.starChartModels.createBox(
				[[bln.x, bln.y, bln.z], [bln.x, trn.y, bln.z], [trn.x, trn.y, trn.z], [trn.x, bln.y, bln.z]],
				[[blf.x, blf.y, blf.z], [blf.x, trf.y, blf.z], [trf.x, trf.y, trf.z], [trf.x, blf.y, blf.z]]);
				}
				());
				*/
				
				foundObjects =
					SR.starMap.getSolarsInRegion(bounds)
					.concat(SR.vessels.getVesselsInRegion(bounds));
				
				return foundObjects;
			};
		}
			());
		
		// Return the object instance.
		return X;
	}
		());
	
}
	(this));
