(function (global) {
	"use strict";
	
	var cmnMisc = global.cmnMisc = global.cmnMisc || {},
	cmnSpatial = global.cmnSpatial = global.cmnSpatial || {},
	Bounds,
	Vector;
	
	Bounds = cmnSpatial.Bounds = function (l, r, t, b) {
		this.left = l;
		this.right = r;
		this.top = t;
		this.bottom = b;
	};
	Bounds.prototype.width = function () {
		return this.right - this.left;
	};
	Bounds.prototype.height = function () {
		return this.bottom - this.top;
	};
	
	// A vector type.
	Vector = cmnSpatial.Vector = (function () {
			var V = function (x, y, z) {
				this.x = x;
				this.y = y;
				this.z = (z === undefined || isNaN(z)) ? 0 : z;
			};
			
			function vectorMath(first, second, mathFunc) {
				if (second instanceof V) {
					return new V(mathFunc(first.x, second.x),
						mathFunc(first.y, second.y),
						mathFunc(first.z, second.z));
				}
				
				throw new Error("The argument passed to vector math is an unsupported type.");
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
			
			V.prototype.length = function () {
				return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
			};
			
			return V;
		}
			());
	
	// Make a random point within a volume. (integer)
	cmnMisc.rand.nextVectorFloat = function (area) {
		var x,
		y,
		z;
		x = this.nextRangedFloat(area.x);
		y = this.nextRangedFloat(area.y);
		z = this.nextRangedFloat(area.z);
		return new Vector(x, y, z);
	};
	
	// Make a random point within a volume. (integer)
	cmnMisc.rand.nextVectorInt = function (area) {
		var x,
		y,
		z;
		x = this.nextRangedInt(area.x);
		y = this.nextRangedInt(area.y);
		z = this.nextRangedInt(area.z);
		return new Vector(x, y, z);
	};
	
	// Compare vectors using predetermined precedence.
	cmnSpatial.compare = function (first, second) {
		if (first instanceof Vector && second instanceof Vector) {
			if (first.Z < second.Z) {
				return -1;
			}
			if (first.Z > second.Z) {
				return 1;
			}
		}
		if (first.Y < second.Y) {
			return -1;
		}
		if (first.Y > second.Y) {
			return 1;
		}
		if (first.X < second.X) {
			return -1;
		}
		if (first.X > second.X) {
			return 1;
		}
		return 0;
	};
	
	// Returns true if the coord is within the topRight to bottomLeft bounds.
	cmnSpatial.coordIsWithin = function (topLeft, bottomRight, coord) {
		return coord.X >= topLeft.X
		 && coord.Y >= topLeft.Y
		 && coord.X < bottomRight.X
		 && coord.Y < bottomRight.Y;
	};
	
	cmnSpatial.tweenLoop = function (overalTime, rotationOrPosition, arrayOfCoordinateSteps) {
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
	
	cmnSpatial.makeAddLineFunc = function (model, colour) {
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
					color : colour,
					opacity : 1,
					linewidth : 3
				});
			model.add(new THREE.Line(geometry, material));
		};
	};
	
	// Unproject to the furthest and nearest points for which the viewport coordinates could refer to.
	cmnSpatial.screenPosToNearFarCoords = function (screenPos, winSize, projector, camera) {
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
	
	cmnSpatial.screenPosToNearFarCoordsCorner = function (side, projector, camera) {
		var r;
		
		// Unproject to the furthest and nearest.
		r = {
			far : projector.unprojectVector(new THREE.Vector3(side, side, 1), camera),
			near : projector.unprojectVector(new THREE.Vector3(side, side, -1), camera)
		};
		return r;
	};
	
	cmnSpatial.rationNearFarToDepth = function (far, near, depthZ) {
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
	cmnSpatial.screenPosToCoordsAtDepth = function (screenPos, depthZ, winSize, projector, camera) {
		// Get the furthest and nearest points for which the viewport coordinates could refer to.
		var r = cmnSpatial.screenPosToNearFarCoords(screenPos, winSize, projector, camera);
		return cmnSpatial.rationNearFarToDepth(r.far, r.near, depthZ);
	};
	
	cmnSpatial.sidesAtDepthWithinBounds = function (projector, camera, bounds) {
		var cornerO,
		cornerP,
		r;
		
		r = cmnSpatial.screenPosToNearFarCoordsCorner(-1, projector, camera);
		cornerO = cmnSpatial.rationNearFarToDepth(r.far, r.near, 0);
		
		r = cmnSpatial.screenPosToNearFarCoordsCorner(1, projector, camera);
		cornerP = cmnSpatial.rationNearFarToDepth(r.far, r.near, 0);
		
		return {
			from : {
				x : cmnMisc.withinBounds(Math.floor(cornerO.x), 0, bounds.x),
				y : cmnMisc.withinBounds(Math.floor(cornerO.y), 0, bounds.y)
			},
			to : {
				x : cmnMisc.withinBounds(Math.floor(cornerP.x), 0, bounds.x),
				y : cmnMisc.withinBounds(Math.floor(cornerP.y), 0, bounds.y)
			}
		};
	};
}
	(this));
