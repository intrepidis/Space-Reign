(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	initialSettings = spaceReign.initialSettings,
	starMap = spaceReign.starMap,
	models = spaceReign.models,
	renderSectors = spaceReign.renderSectors;
	
	spaceReign.visuals = (function () {
		var winSize = {
			x : 0,
			y : 0
		},
		viewportSize,
		imgDir,
		imageNames,
		sunTex,
		pinkLoveTex,
		c={camera : new THREE.PerspectiveCamera(1, 1, 1, 1)},
		viewPoint = new THREE.Vector3(0, 0, 0),
		scene = new THREE.Scene(),
		renderer = new THREE.WebGLRenderer({
				antialias : true
			}),
		projector = new THREE.Projector();
		
		renderer.sortObjects = false;
		c.camera.position.x = 0.5;
		c.camera.position.y = 0.5;
		c.camera.position.z = 1.8;
		scene.add(c.camera);
		
		imgDir = '../Images/';
		sunTex = THREE.ImageUtils.loadTexture(imgDir + 'sun.png');
		pinkLoveTex = THREE.ImageUtils.loadTexture(imgDir + 'pink_love.png');
		
		function init() {
			//var i;
			
			// Add dots down the z axis.
			/*for (i = -10; i <= 20; i += 0.1) {
			if (i < 0 || i > 1) {
			scene.add(models.createSolarModel({
			mass : 0.01,
			coord : {
			x : 0,
			y : 0,
			z : i
			}
			}));
			}
			}*/
			
			// Load the solars of each sector into the rendering engine.
			renderSectors.init(spaceReign.visuals);
		}
		
		function resize() {
			var $starChartDiv,
			viewAngle,
			aspect,
			near,
			far,
			$window = $(window),
			prevWinSize = winSize,
			cameraPos;
			
			// Get the new window size.
			winSize = {
				x : $window.width(),
				y : $window.height()
			};
			
			if (winSize.x == prevWinSize.x && winSize.y == prevWinSize.y) {
				// The size hasn't actually changed.
				return;
			}
			
			cameraPos={x:c.camera.position.x,y:c.camera.position.y,z:c.camera.position.z};
			c.camera = new THREE.PerspectiveCamera(96, winSize.x / winSize.y, 0.5, 2);
			c.camera.position.x = cameraPos.x;
			c.camera.position.y = cameraPos.y;
			c.camera.position.z = cameraPos.z;
			
			// c.camera.viewAngle = 96;
			// c.camera.aspect = winSize.x / winSize.y;
			// c.camera.near = 0.5;
			// c.camera.far = 2;
			
			renderer.setSize(winSize.x, winSize.y);
			renderer.domElement.id = 'viewport';
			
			$starChartDiv = $('#viewportDiv');
			$starChartDiv.append(renderer.domElement);
			viewportSize = {
				x : $starChartDiv.width(),
				y : $starChartDiv.height() - 6 //cmn: annoying that this is the only way I know to fix the screen to space coordinates bug.
			};
		}
		
		function render() {
			TWEEN.update();
			
			//            camera.position.x += (mouseX - camera.position.x) * 0.05;
			//            camera.position.y += (-mouseY - camera.position.y) * 0.05;
			// camera.position.x = 0.5;
			// camera.position.y = 0.5;
			
			// Always look down the z-axis (to mimic 1-point perspective).
			viewPoint.x = c.camera.position.x;
			viewPoint.y = c.camera.position.y;
			c.camera.lookAt(viewPoint);
			
			//            group.rotation.x += 0.01;
			//            group.rotation.y += 0.02;
			
			renderer.render(scene, c.camera);
		}
		
		/*function plotStars() {
		var leftStart,
		rightEnd,
		topStart,
		bottomEnd,
		leftOffset,
		topOffset,
		groupCount = 0,
		xar,
		ix,
		yar,
		iy,
		sar,
		is,
		sol,
		depthScaled,
		depthNormalized,
		particle;
		
		leftStart = Math.floor(viewpos.x);
		rightEnd = Math.ceil((viewpos.x + renderer.domElement.width) / starMap.sectorSize.x);
		topStart = Math.floor(viewpos.y / starMap.sectorSize.y);
		bottomEnd = Math.ceil((viewpos.y + renderer.domElement.height) / starMap.sectorSize.y);
		
		// Iterate horizonally across visible sector.
		xar = starMap.sectors;
		for (ix = leftStart; ix < rightEnd; ix++) {
		leftOffset = viewpos.x - (ix * starMap.sectorSize.x);
		
		// Iterate vertically across visible sector.
		yar = xar[ix];
		for (iy = topStart; iy < bottomEnd; iy++) {
		topOffset = viewpos.y - (iy * starMap.sectorSize.y);
		
		// Iterate all solars in a sector.
		sar = yar[iy];
		for (is = 0; is < sar.length; is++) {
		sol = sar[is];
		
		particle = new THREE.Particle(
		new THREE.ParticleCanvasMaterial({
		color : Math.random() * 0x808008 + 0x808080,
		solarShader : solarShader
		}));
		particle.position.x = Math.random() * 2000 - 1000;
		particle.position.y = Math.random() * 2000 - 1000;
		particle.position.z = Math.random() * 2000 - 1000;
		particle.scale.x = particle.scale.y = Math.random() * 10 + 5;
		scene.add(particle);
		
		//                        sp = scene.Sprite(imageNames[0], starsLayer);
		//                        //sp.transformOrigin(sp.w / 2, sp.h / 2);
		//                        // sp.offset(-(sp.w/2), -(sp.h/2));
		//                        sp.move(sol.coord.x - leftOffset, sol.coord.y - topOffset);
		//                        //var ax = rand.nextRangedInt(scene.w);
		//                        //var ay = rand.nextRangedInt(scene.h);
		//                        //sp.move(ax, ay);
		//                        //sp.rotate(Math.PI / 4);
		//                        depthScaled = sol.coord.z / starMap.sectorHalfSize.z;
		//                        depthNormalized = ((depthScaled - 1) * initialSettings.defZoom) + 1;
		//                        sp.scale(depthNormalized);
		//                        //sp.setOpacity(0.8);
		//                        sp.update();
		}
		groupCount++;
		}
		}
		}*/
		
		function draw() {
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
			renderSectors.process();
			render();
			//stats.update();
		}
		
		function moveCamera(screenFrom, screenTo) {
			var xDist,
			yDist,
			fromPoint,
			toPoint;
			
			fromPoint = cmnSpatial.screenPosToCoordsAtDepth(screenFrom, 1, viewportSize, projector, c.camera);
			toPoint = cmnSpatial.screenPosToCoordsAtDepth(screenTo, 1, viewportSize, projector, c.camera);
			
			xDist = fromPoint.x - toPoint.x;
			yDist = fromPoint.y - toPoint.y;
			
			c.camera.position.x += xDist;
			c.camera.position.y += yDist;
		}
		
		function getObjectsInScreenRegion(screenPos, size) {
			var foundObjects,
			firstSector,
			finalSector,
			lineBottomLeft,
			lineTopRight,
			sectorBackCoord,
			sectorFrontCoord,
			someCoordBL,
			someCoordTR,
			column,
			sector,
			sol,
			solCoord,
			cx,
			cy,
			i;
			
			function pickLeast(a, b) {
				return Math.floor(Math.min(a, b));
			}
			
			function pickMost(a, b) {
				return Math.floor(Math.max(a, b));
			}
			
			// Get the near-far coordinate pairs of the bottom-left and top-right lines of the region.
			// For each pair get the coordinates of the line going from the camera (minimum depth) at
			// the passed in screen position to the same position but at maximum depth.
			lineBottomLeft = cmnSpatial.screenPosToNearFarCoords({
					x : screenPos.x - size,
					y : screenPos.y + size
				}, viewportSize, projector, c.camera);
			
			lineTopRight = cmnSpatial.screenPosToNearFarCoords({
					x : screenPos.x + size,
					y : screenPos.y - size
				}, viewportSize, projector, c.camera);
			
			/*/
			cmn : Put a box showing the hit region.
			scene.add(function () {
				var bln = cmnSpatial.rationNearFarToDepth(lineBottomLeft.near, lineBottomLeft.far, 1),
				blf = cmnSpatial.rationNearFarToDepth(lineBottomLeft.near, lineBottomLeft.far, 0),
				trn = cmnSpatial.rationNearFarToDepth(lineTopRight.near, lineTopRight.far, 1),
				trf = cmnSpatial.rationNearFarToDepth(lineTopRight.near, lineTopRight.far, 0);
				
				return models.createBox(
					[[bln.x, bln.y, bln.z], [bln.x, trn.y, bln.z], [trn.x, trn.y, trn.z], [trn.x, bln.y, bln.z]],
					[[blf.x, blf.y, blf.z], [blf.x, trf.y, blf.z], [trf.x, trf.y, trf.z], [trf.x, blf.y, blf.z]]);
			}
				());
			//cmn*/
			
			// Find which sectors intersect with the screen region.
			lineBottomLeft.sectorBackCoord = cmnSpatial.rationNearFarToDepth(lineBottomLeft.far, lineBottomLeft.near, 0);
			lineBottomLeft.sectorFrontCoord = cmnSpatial.rationNearFarToDepth(lineBottomLeft.far, lineBottomLeft.near, 1);
			firstSector = {
				x : pickLeast(lineBottomLeft.sectorBackCoord.x, lineBottomLeft.sectorFrontCoord.x),
				y : pickLeast(lineBottomLeft.sectorBackCoord.y, lineBottomLeft.sectorFrontCoord.y)
			};
			
			lineTopRight.sectorBackCoord = cmnSpatial.rationNearFarToDepth(lineTopRight.far, lineTopRight.near, 0);
			lineTopRight.sectorFrontCoord = cmnSpatial.rationNearFarToDepth(lineTopRight.far, lineTopRight.near, 1);
			finalSector = {
				x : pickMost(lineTopRight.sectorBackCoord.x, lineTopRight.sectorFrontCoord.x),
				y : pickMost(lineTopRight.sectorBackCoord.y, lineTopRight.sectorFrontCoord.y)
			};
			
			// Fix sector indexes that are out of bounds.
			firstSector = {
				x : pickMost(starMap.firstSector.x, firstSector.x),
				y : pickMost(starMap.firstSector.y, firstSector.y)
			};
			
			finalSector = {
				x : pickLeast(starMap.finalSector.x, finalSector.x),
				y : pickLeast(starMap.finalSector.y, finalSector.y)
			};
			
			// A list of collided objects.
			foundObjects = [];
			
			// Collision test all found sectors.
			for (cx = firstSector.x; cx <= finalSector.x; cx++) {
				column = starMap.sectors[cx];
				for (cy = firstSector.y; cy <= finalSector.y; cy++) {
					sector = column[cy];
					// Collision test all solars in the sector.
					for (i = 0; i < sector.length; i++) {
						sol = sector[i];
						
						// Promote the solar coordinates from sector space to star map space.
						solCoord = {
							x : sol.coord.x + cx,
							y : sol.coord.y + cy,
							z : sol.coord.z // z isn't used here, but it is sent out of this function.
						};
						
						// Get the region's bottom-left coord at the solar's depth.
						someCoordBL = cmnSpatial.rationNearFarToDepth(lineBottomLeft.far, lineBottomLeft.near, sol.coord.z);
						// Is it within the bottom and left?
						if (solCoord.x > someCoordBL.x && solCoord.y > someCoordBL.y) {
							// Get the region's top-right coord at the solar's depth.
							someCoordTR = cmnSpatial.rationNearFarToDepth(lineTopRight.far, lineTopRight.near, sol.coord.z);
							// Is it within the top and right?
							if (solCoord.x < someCoordTR.x && solCoord.y < someCoordTR.y) {
								// The object is within the region.
								foundObjects.push({
									obj : sol,
									objCoord : solCoord,
									sectorCoord : {
										x : cx,
										y : cy
									}
								});
							}
						}
					}
				}
			}
			
			return foundObjects;
		}
		
		return {
			init : init,
			resize : resize,
			moveCamera : moveCamera,
			imageNames : imageNames,
			draw : draw,
			getObjectsInScreenRegion : getObjectsInScreenRegion,
			scene : scene,
			projector : projector,
			c : c
		};
	}
		());
	
}
	(this));
