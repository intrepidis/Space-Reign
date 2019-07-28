(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	Solar = spaceReign.Solar,
	Vessel = spaceReign.Vessel,
	visuals = spaceReign.visuals,
	starMap = spaceReign.starMap,
	dialogs = spaceReign.dialogs;
	
	spaceReign.controls = (function () {
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
		
		function initMouseInput() {
			// The current mouse state.
			var mouseNow = {
				button : false,
				pos : new THREE.Vector2(0, 0)
			},
			// When the button is pressed the position is stored here.
			mouseDownPosition = new THREE.Vector2(0, 0),
			mouseDragThreshold = 6,
			clickRegionSize = 6,
			mouseIsDragging = false;
			
			function mouseClick() {
				var objs;
				
				log.mouse('CLICK');
				
				objs = visuals.getObjectsInScreenRegion(mouseNow.pos, clickRegionSize);
				
				if (objs.length === 0) {
					return;
				}
				
				if (objs.length === 1) {
					dialogs.showObject(objs[0]);
					return;
				}
				
				// objs.length >= 2
				dialogs.showObjectsChooser(objs, function (choiseIndex) {
					dialogs.showObject(objs[choiseIndex]);
				});
			}
			
			function mouseDown() {
				log.mouse('DOWN');
			}
			
			function mouseUp() {
				log.mouse('UP');
			}
			
			function mouseDrag() {
				var from = mouseDownPosition,
				to = mouseNow.pos;
				log.mouse('DRAG');
				
				log.mouse('from=({0},{1}), to=({2},{3})'.format(from.x, from.y, to.x, to.y));
				visuals.moveCamera(from, to);
				
				mouseDownPosition.x = mouseNow.pos.x;
				mouseDownPosition.y = mouseNow.pos.y;
			}
			
			function isViewport(target) {
				var webgl = $('#viewport').get(0),
				retval = (target === webgl);
				log.mouse(retval ? "is viewport" : "isn't viewport");
				return retval;
			}
			
			function bindMouseMoveDragging() {
				log.mouse('bind mousemove dragging');
				$(document).mousemove(function (e) {
					var dist;
					log.mouse('mousemove');
					log.mouse('x={0}, y={1}'.format(e.pageX, e.pageY));
					mouseNow.pos.x = e.pageX;
					mouseNow.pos.y = e.pageY;
					if (!mouseIsDragging) {
						dist = Math.abs(mouseDownPosition.x - mouseNow.pos.x);
						log.mouse('xdist={0}'.format(dist));
						if (dist > mouseDragThreshold) {
							mouseIsDragging = true;
						} else {
							dist = Math.abs(mouseDownPosition.y - mouseNow.pos.y);
							log.mouse('ydist={0}'.format(dist));
							mouseIsDragging = (dist > mouseDragThreshold);
						}
					}
					if (mouseIsDragging) {
						mouseDrag();
					}
				});
			}
			
			function unbindMouseMoveDragging() {
				log.mouse('unbind mousemove');
				$(document).unbind('mousemove');
				mouseIsDragging = false;
			}
			
			$(document).mousedown(function (e) {
				log.mouse('down');
				if (isViewport(e.target)) {
					if (e.which === 1) {
						log.mouse('which===1');
						mouseNow.button = true;
						
						log.mouse('x={0}, y={1}'.format(e.pageX, e.pageY));
						mouseNow.pos.x = e.pageX;
						mouseNow.pos.y = e.pageY;
						mouseDownPosition.x = e.pageX;
						mouseDownPosition.y = e.pageY;
						mouseDown();
						bindMouseMoveDragging();
					}
				}
			});
			
			$(document).mouseup(function (e) {
				log.mouse('up');
				// Only if the button went down in our viewport do we care when it goes up.
				if (e.which === 1 && mouseNow.button) {
					log.mouse('which===1');
					mouseNow.button = false;
					
					if (mouseIsDragging) {
						mouseUp();
					} else {
						mouseClick();
					}
					unbindMouseMoveDragging();
				}
			});
			
			$(document).mouseleave(function (e) {
				//debugger;
				log.mouse('leave');
				mouseNow.button = false;
				mouseUp();
				unbindMouseMoveDragging();
			});
		}
		
		return {
			init : function () {
				// document.addEventListener('mousemove', onDocumentMouseMove, false);
				// document.addEventListener('touchstart', onDocumentTouchStart, false);
				// document.addEventListener('touchmove', onDocumentTouchMove, false);
				
				initMouseInput();
			}
		};
	}
		());
}
	(this));
