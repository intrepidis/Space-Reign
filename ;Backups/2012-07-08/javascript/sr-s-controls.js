(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log;
	
	SR.controls = (function () {
		var X = {}, // This will be the publically exposed object instance.
		N = {}; // Enclosed (private) members shall reside here.
		
		/* function onDocumentMouseMove(event) {
		//mouseX = event.clientX - windowHalfX;
		//mouseY = event.clientY - windowHalfY;
		}
		
		function onDocumentTouchStart(event) {
		if (event.touches.length === 1) {
		event.preventDefault();
		
		//mouseX = event.touches[ 0 ].pageX - windowHalfX;
		//mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
		}
		
		function onDocumentTouchMove(event) {
		if (event.touches.length === 1) {
		event.preventDefault();
		
		//mouseX = event.touches[ 0 ].pageX - windowHalfX;
		//mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
		} */
		// document.addEventListener('mousemove', onDocumentMouseMove, false);
		// document.addEventListener('touchstart', onDocumentTouchStart, false);
		// document.addEventListener('touchmove', onDocumentTouchMove, false);
		
		(function ENCLOSED_FIELDS() {
			// The current mouse state.
			N.mouseNow = {
				button : false,
				pos : new THREE.Vector2(0, 0)
			};
			// When the button is pressed the position is stored here.
			N.mouseDownPosition = new THREE.Vector2(0, 0);
			N.mouseDragThreshold = 6;
			N.clickRegionSize = 6;
			N.mouseIsDragging = false;
		}
			());
		
		(function ENCLOSED_METHODS() {
			N.mouseClick = function () {
				var objs;
				
				log.mouse('CLICK');
				
				objs = SR.starChartVisuals.getObjectsInScreenRegion(N.mouseNow.pos, N.clickRegionSize);
				
				if (objs.length === 0) {
					return;
				}
				
				if (objs.length === 1) {
					SR.dialogs.showObject(objs[0]);
					return;
				}
				
				// objs.length >= 2
				SR.dialogs.showObjectsChooser(objs, function (choiceIndex) {
					SR.dialogs.showObject(objs[choiceIndex]);
				});
			};
			
			N.mouseDown = function () {
				log.mouse('DOWN');
			};
			
			N.mouseUp = function () {
				log.mouse('UP');
			};
			
			N.mouseDrag = function () {
				var from = N.mouseDownPosition,
				to = N.mouseNow.pos;
				log.mouse('DRAG');
				
				log.mouse('from=({0},{1}), to=({2},{3})'.format(from.x, from.y, to.x, to.y));
				SR.starChartVisuals.moveCamera(from, to);
				
				N.mouseDownPosition.x = N.mouseNow.pos.x;
				N.mouseDownPosition.y = N.mouseNow.pos.y;
			};
			
			N.isViewport = function (target) {
				var webgl = $('#viewport').get(0),
				retval = (target === webgl);
				log.mouse(retval ? "is viewport" : "isn't viewport");
				return retval;
			};
			
			N.bindMouseMoveDragging = function () {
				log.mouse('bind mousemove dragging');
				$(document).mousemove(function (e) {
					var dist;
					log.mouse('mousemove');
					log.mouse('x={0}, y={1}'.format(e.pageX, e.pageY));
					N.mouseNow.pos.x = e.pageX;
					N.mouseNow.pos.y = e.pageY;
					if (!N.mouseIsDragging) {
						dist = Math.abs(N.mouseDownPosition.x - N.mouseNow.pos.x);
						log.mouse('xdist={0}'.format(dist));
						if (dist > N.mouseDragThreshold) {
							N.mouseIsDragging = true;
						} else {
							dist = Math.abs(N.mouseDownPosition.y - N.mouseNow.pos.y);
							log.mouse('ydist={0}'.format(dist));
							N.mouseIsDragging = (dist > N.mouseDragThreshold);
						}
					}
					if (N.mouseIsDragging) {
						N.mouseDrag();
					}
				});
			};
			
			N.unbindMouseMoveDragging = function () {
				log.mouse('unbind mousemove');
				$(document).unbind('mousemove');
				N.mouseIsDragging = false;
			};
		}
			());
		
		(function EXPOSED_METHODS() {
			X.init = function () {
				(function initZoom() {
					var $zoomDiv = $("#zoom"),
					zoomMin = 0,
					zoomMax = 100,
					zoomDef;
					
					function setZoom(e, ui) {
						var invertedFraction = (zoomMax - ui.value) / zoomMax,
						scaled = invertedFraction * (SR.initialSettings.maxZoom - SR.initialSettings.minZoom);
						SR.starChartVisuals.camera.position.z = scaled + SR.initialSettings.minZoom;
					}
					
					zoomDef = (function () {
						var value = SR.initialSettings.defZoom - SR.initialSettings.minZoom,
						high = SR.initialSettings.maxZoom - SR.initialSettings.minZoom;
						return (value / high) * zoomMax;
					}
						());
					
					$zoomDiv.slider({
						orientation : "vertical",
						min : zoomMin,
						max : zoomMax,
						value : zoomDef,
						slide : setZoom
					});
					
					// Do a setZoom to get the zoom factor correct from the beginning.
					setZoom(null, {
						value : $zoomDiv.slider('value')
					});
				}
					());
				
				$(document).mousedown(function (e) {
					log.mouse('down');
					if (N.isViewport(e.target)) {
						if (e.which === 1) {
							log.mouse('which===1');
							N.mouseNow.button = true;
							
							log.mouse('x={0}, y={1}'.format(e.pageX, e.pageY));
							N.mouseNow.pos.x = e.pageX;
							N.mouseNow.pos.y = e.pageY;
							N.mouseDownPosition.x = e.pageX;
							N.mouseDownPosition.y = e.pageY;
							N.mouseDown();
							N.bindMouseMoveDragging();
						}
					}
				});
				
				$(document).mouseup(function (e) {
					log.mouse('up');
					// Only if the button went down in our viewport do we care when it goes up.
					if (e.which === 1 && N.mouseNow.button) {
						log.mouse('which===1');
						N.mouseNow.button = false;
						
						if (N.mouseIsDragging) {
							N.mouseUp();
						} else {
							N.mouseClick();
						}
						N.unbindMouseMoveDragging();
					}
				});
				
				$(document).mouseleave(function (e) {
					//debugger;
					log.mouse('leave');
					N.mouseNow.button = false;
					N.mouseUp();
					N.unbindMouseMoveDragging();
				});
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
