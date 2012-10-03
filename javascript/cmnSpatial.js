(function (global) {
	"use strict";
	
	var CMN = global.CMN = global.CMN || {};
	
	CMN.Bounds = (function () {
		var B = function (xFrom, yFrom, xTo, yTo) {
			this.from = {
				x : xFrom,
				y : yFrom
			};
			this.to = {
				x : xTo,
				y : yTo
			};
		};
		
		Object.defineProperty(B.prototype, 'width', {
			get : function () {
				return this.to.x - this.from.x;
			}
		});
		
		Object.defineProperty(B.prototype, 'height', {
			get : function () {
				return this.to.y - this.from.y;
			}
		});
		
		B.prototype.roundedOut = function() {
			var xFrom, yFrom, xTo, yTo;
			
			if (this.from.x < this.to.x){
				xFrom = Math.floor(this.from.x);
				xTo = Math.ceil(this.to.x);
			} else {
				xFrom = Math.ceil(this.from.x);
				xTo = Math.floor(this.to.x);
			}
			
			if (this.from.y < this.to.y){
				yFrom = Math.floor(this.from.y);
				yTo = Math.ceil(this.to.y);
			} else {
				yFrom = Math.ceil(this.from.y);
				yTo = Math.floor(this.to.y);
			}
			
			return new B(xFrom, yFrom, xTo, yTo);
		};
		
		return B;
	}
		());
	
	// A vector type.
	CMN.Vector = (function () {
		var V = function (x, y, z) {
			this.x = x;
			this.y = y;
			this.z = (z === undefined || isNaN(z)) ? 0 : z;
		};
		
		V.Zero = new V(0, 0, 0);
		
		function vectorMath(first, second, mathFunc) {
			// The logic of the code guarantees that 'first' is of type V,
			// but 'second' could be of any type.
			if (!(second instanceof V)) {
				throw new Error("The argument passed to vector math is an unsupported type.");
			}
			
			//TODO: refactor like this:
			//var mf = function(n){if (second[n]){return mathFunc(first[n],second[n]);}else{return first[n];}}
			return new V(mathFunc(first.x, second.x),
				mathFunc(first.y, second.y),
				mathFunc(first.z, second.z));
		}
		
		V.prototype.add = function (other) {
			return vectorMath(this, other, function (t, o) {
				return t + o;
			});
		};
		
		V.prototype.sub = function (other) {
			return vectorMath(this, other, function (t, o) {
				return t - o;
			});
		};
		
		V.prototype.mul = function (other) {
			return vectorMath(this, other, function (t, o) {
				return t * o;
			});
		};
		
		V.prototype.div = function (other) {
			return vectorMath(this, other, function (t, o) {
				return t / o;
			});
		};
		
		Object.defineProperty(V.prototype, 'length', {
			get : function () {
				return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
			}
		});
		
		return V;
	}
		());
	
	(function VECTOR_RAND_FUNCTIONS() {
		CMN.rand = CMN.rand || {};
		
		// Make a random point within a volume. (float)
		CMN.rand.nextVectorFloat = function (area) {
			var x = CMN.rand.nextRangedFloat(area.x),
			y = CMN.rand.nextRangedFloat(area.y),
			z = CMN.rand.nextRangedFloat(area.z);
			return new CMN.Vector(x, y, z);
		};
		
		// Make a random point within a volume. (integer)
		CMN.rand.nextVectorInt = function (area) {
			var x = CMN.rand.nextRangedInt(area.x),
			y = CMN.rand.nextRangedInt(area.y),
			z = CMN.rand.nextRangedInt(area.z);
			return new CMN.Vector(x, y, z);
		};
	}
		());
	
	CMN.spatial = (function () {
		var I = {};
		
		// Compare vectors using predetermined precedence.
		I.compare = function (first, second) {
			if (first instanceof CMN.Vector && second instanceof CMN.Vector) {
				if (first.z < second.z) {
					return -1;
				}
				if (first.z > second.z) {
					return 1;
				}
			}
			if (first.y < second.y) {
				return -1;
			}
			if (first.y > second.y) {
				return 1;
			}
			if (first.x < second.x) {
				return -1;
			}
			if (first.x > second.x) {
				return 1;
			}
			return 0;
		};
		
		// Returns true if the coord is within the bounds.
		I.coordIsWithinSquare = function (bounds, coord) {
			return coord.x >= bounds.from.x
			 && coord.x < bounds.to.x
			 && coord.y >= bounds.from.y
			 && coord.y < bounds.to.y;
		};
		
		I.coordIsWithinCube = function (bounds, coord) {
			var lowCoord,
			highCoord;
			
			// Get the region's bottom-left coord at the object's depth.
			lowCoord = I.rationNearFarToDepth(bounds.low.far, bounds.low.near, coord.z);
			// Is it within the bottom and left?
			if (coord.x > lowCoord.x && coord.y > lowCoord.y) {
				// Get the region's top-right coord at the object's depth.
				highCoord = I.rationNearFarToDepth(bounds.high.far, bounds.high.near, coord.z);
				// Is it within the top and right?
				if (coord.x < highCoord.x && coord.y < highCoord.y) {
					// The object is within the region.
					return true;
				}
			}
			return false;
		};
		
		I.tweenLoop = function (overalTime, rotationOrPosition, arrayOfCoordinateSteps) {
			var //overalTime
			coord = rotationOrPosition,
			steps = arrayOfCoordinateSteps,
			firstStep = steps[0],
			numTweens = steps.length,
			time = overalTime / (steps.length - 1),
			prop,
			i,
			tween,
			firstTween,
			prevTween;
			
			if (steps.length < 2) {
				throw new Error("There should be at least 2 steps.");
			}
			
			// Put the properties of the first step directly into the coordinate object.
			/*jslint forin: true */
			for (prop in firstStep) {
				coord[prop] = firstStep[prop];
			}
			/*jslint forin: false */
			
			// Create tweens and chain them.
			tween = firstTween = new TWEEN.Tween(coord);
			tween.to(steps[1], time);
			for (i = 2; i < numTweens; i++) {
				prevTween = tween;
				
				tween = new TWEEN.Tween(coord);
				tween.to(steps[i], time);
				
				prevTween.chain(tween);
			}
			
			// Create the final tween, which instantly jumps back to the beginning.
			prevTween = tween;
			tween = new TWEEN.Tween(coord);
			tween.to(firstStep, 0);
			prevTween.chain(tween);
			tween.chain(firstTween);
			
			firstTween.start();
		};
		
		I.makeAddLineFunc = function (model, color) {
			return function addLine(points, closeLoop) {
				var i,
				p,
				material,
				geometry = new THREE.Geometry();
				for (i = 0; i < points.length; i++) {
					p = points[i];
					geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(p[0], p[1], p[2])));
				}
				if (closeLoop) {
					p = points[0];
					geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(p[0], p[1], p[2])));
				}
				geometry.computeBoundingSphere();
				material = new THREE.LineBasicMaterial({
						color : color,
						opacity : 1,
						linewidth : 3
					});
				model.add(new THREE.Line(geometry, material));
			};
		};
		
		// Unproject to the furthest and nearest points for which the viewport coordinates could refer to.
		I.screenPosToNearFarCoords = function (screenPos, winSize, projector, camera) {
			var x,
			y,
			r;
			
			// Map the viewport coordinates to the range -1 to 1.
			// With the Y origin of flipped from top to bottom.
			x = (screenPos.x / (winSize.x / 2)) - 1;
			y = ((winSize.y - screenPos.y) / (winSize.y / 2)) - 1;
			
			// Unproject to the furthest and nearest.
			r = {
				far : projector.unprojectVector(new THREE.Vector3(x, y, 1), camera),
				near : projector.unprojectVector(new THREE.Vector3(x, y, -1), camera)
			};
			return r;
		};
		
		I.screenPosToNearFarCoordsCorner = function (side, projector, camera) {
			var r;
			
			// Unproject to the furthest and nearest.
			r = {
				far : projector.unprojectVector(new THREE.Vector3(side, side, 1), camera),
				near : projector.unprojectVector(new THREE.Vector3(side, side, -1), camera)
			};
			return r;
		};
		
		I.rationNearFarToDepth = function (far, near, depthZ) {
			var factor,
			nearFarDist,
			seekDist,
			worldX,
			worldY;
			
			// Calculate the world coordinates at the specified depth.
			function calcPos(n, f) {
				var nearFarDist = f - n,
				seekDist = nearFarDist * factor;
				return seekDist + n;
			}
			
			// Calculate the ratio between far and near that the specified depth is at.
			nearFarDist = far.z - near.z;
			seekDist = depthZ - near.z;
			factor = seekDist / nearFarDist;
			
			worldX = calcPos(near.x, far.x);
			worldY = calcPos(near.y, far.y);
			
			// Return the coordinates as a Vector3.
			return new THREE.Vector3(worldX, worldY, depthZ);
		};
		
		// Unproject viewport coordinates to world coordinates, at the specified depth.
		I.screenPosToCoordsAtDepth = function (screenPos, depthZ, winSize, projector, camera) {
			// Get the furthest and nearest points for which the viewport coordinates could refer to.
			var r = CMN.spatial.screenPosToNearFarCoords(screenPos, winSize, projector, camera);
			return CMN.spatial.rationNearFarToDepth(r.far, r.near, depthZ);
		};
		
		I.sidesAtDepthWithinBounds = function (projector, camera, bounds) {
			var cornerO,
			cornerP,
			r;
			
			r = CMN.spatial.screenPosToNearFarCoordsCorner(-1, projector, camera);
			cornerO = CMN.spatial.rationNearFarToDepth(r.far, r.near, 0);
			
			r = CMN.spatial.screenPosToNearFarCoordsCorner(1, projector, camera);
			cornerP = CMN.spatial.rationNearFarToDepth(r.far, r.near, 0);
			
			return new CMN.Bounds(
				CMN.misc.withinBounds(cornerO.x, 0, bounds.x),
				CMN.misc.withinBounds(cornerO.y, 0, bounds.y),
				CMN.misc.withinBounds(cornerP.x, 0, bounds.x),
				CMN.misc.withinBounds(cornerP.y, 0, bounds.y));
		};
		
		return I;
	}
		());
}
	(this));
