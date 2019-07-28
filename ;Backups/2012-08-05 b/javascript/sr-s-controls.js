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
			
			// Keep track of the "object chooser" mode.
			N.objectChooserModeCallback = undefined; // The call-back function.
			N.objectChooserModeValidTypes = undefined; // An array of type strings that are wanted.
		}
			());
		
		(function ENCLOSED_METHODS() {
			N.mouseClick = function () {
				var objs;
				
				function chooseObject(obj) {
					if (N.objectChooserModeCallback) {
						N.completeObjectChooserMode(obj);
					} else {
						SR.dialogs.showObject(obj);
					}
				}
				
				log.mouse('CLICK');
				
				if (!N.objectChooserModeCallback) {
					SR.dialogs.closeUnpinned();
				}
				
				objs = SR.starChartVisuals.getObjectsInScreenRegion(N.mouseNow.pos, N.clickRegionSize);
				
				if (N.objectChooserModeValidTypes) {
					objs = N.filterToRequestedTypes(objs, N.objectChooserModeValidTypes);
				}
				
				if (objs.length === 0) {
					return;
				}
				
				if (objs.length === 1) {
					chooseObject(objs[0]);
					return;
				}
				
				// objs.length >= 2
				SR.dialogs.showObjectsChooser(objs, function (choiceIndex) {
					chooseObject(objs[choiceIndex]);
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
			
			N.completeObjectChooserMode = function (obj) {
				var i,
				callback = N.objectChooserModeCallback;
				
				if (callback === undefined) {
					// The player must have clicked twice, so ignore this second click.
					return;
				}
				
				// We only want to do this once, so remove the call-back function.
				N.objectChooserModeCallback = undefined;
				N.objectChooserModeValidTypes = undefined;
				
				callback(obj);
			};
			
			N.filterToRequestedTypes = function (objs, requestedTypes) {
				var i,
				matches = [];
				
				for (i = 0; i < objs.length; i++) {
					if (N.isRequestedType(objs[i], requestedTypes)) {
						matches.push(objs[i]);
					}
				}
				
				return matches;
			};
			
			N.isRequestedType = function (obj, requestedTypes) {
				var i;
				
				for (i = 0; i < requestedTypes.length; i++) {
					if (CMN.misc.isInstance(obj, requestedTypes[i])) {
						// The object has matched this type.
						return true;
					}
				}
				
				// The object is not the required type.
				return false;
			};
		}
			());
		
		(function EXPOSED_METHODS() {
			X.init = function () {
				(function INIT_ZOOM_SLIDER() {
					var $zoomDiv = $("#zoom"),
					sliderMin = 0,
					sliderMax = 100,
					value = SR.fixedSettings.defZoom - SR.fixedSettings.minZoom,
					high = SR.fixedSettings.maxZoom - SR.fixedSettings.minZoom,
					sliderInitialPosition = (value / high) * sliderMax; // this maths relies of sliderMin being 0
					
					function setZoom(e, ui) {
						var invertedFraction = (sliderMax - ui.value) / sliderMax,
						scaled = invertedFraction * (SR.fixedSettings.maxZoom - SR.fixedSettings.minZoom);
						SR.starChartVisuals.camera.position.z = scaled + SR.fixedSettings.minZoom;
					}
					
					$zoomDiv.slider({
						orientation : "vertical",
						min : sliderMin,
						max : sliderMax,
						value : sliderInitialPosition,
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
			
			X.beginObjectChooserMode = function (objectTypes, callback) {
				N.objectChooserModeValidTypes = objectTypes;
				N.objectChooserModeCallback = callback;
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
