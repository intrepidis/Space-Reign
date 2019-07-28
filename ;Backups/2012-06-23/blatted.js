(function (global) {
	"use strict";
	
	// Application wide logging.
	var cmnLog = global.cmnLog = global.cmnLog || {},
	console = global.console,
	text = '';
	
	// If the value is undefined then only the name is written to log.
	cmnLog.add = function (name, value) {
		var str;
		
		if (value === undefined) {
			str = name;
		} else {
			str = '{0}={1}'.format(name, JSON.stringify(value));
		}
		
		console.log(str);
		text = text + str + '\n';
	}
	
	cmnLog.clear = function () {
		text = '';
	}
	
	cmnLog.get = function () {
		return text;
	}
}
	(this));
(function (global) {
	"use strict";
	
	var cmnMisc = global.cmnMisc = global.cmnMisc || {};
	
	// Might as well store these values.
	Math.PI2 = Math.PI * 2;
	Math.PIh = Math.PI / 2;
	
	// Extra methods for arrays.
	Array.prototype.insert = function (index, item) {
		this.splice(index, 0, item);
	};
	
	Array.prototype.remove = function (index) {
		this.splice(index, 1);
	};
	
	// Extra methods for strings.
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
			if (m === "{{") {
				return "{";
			}
			if (m === "}}") {
				return "}";
			}
			return args[n];
		});
	};
	
	function padder(padFunc, str, size, chr) {
		var i,
		s = str;
		
		if (chr === undefined) {
			chr = ' ';
		}
		for (i = s.length; i < size; i++) {
			s = padFunc(s, chr);
		}
		return s;
	}
	
	String.prototype.padLeft = function (size, chr) {
		var padFunc = function (str, chr) {
			return chr + str;
		};
		return padder(padFunc, this, size, chr);
	};
	
	String.prototype.padRight = function (size, chr) {
		var padFunc = function (str, chr) {
			return str + chr;
		};
		return padder(padFunc, this, size, chr);
	};
	
	cmnMisc.clone = function (obj) {
		var copy,
		attr,
		i;
		
		// Handle the value types, and null or undefined.
		if (obj === null || typeof obj !== "object") {
			return obj;
		}
		
		// Handle the Date type.
		if (obj instanceof Date) {
			copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}
		
		// Handle the Array type.
		if (obj instanceof Array) {
			copy = [];
			for (i = 0; i < obj.length; i++) {
				copy[i] = clone(obj[i]);
			}
			return copy;
		}
		
		// Handle an Object type.
		if (obj instanceof Object) {
			copy = {};
			for (attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = cmnMisc.clone(obj[attr]);
				}
			}
			return copy;
		}
		
		throw new Error("Unable to clone the object. Its type isn't supported.");
	};
	
	cmnMisc.setCookie = function (c_name, value, expiredays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toUTCString());
	};
	
	cmnMisc.getCookie = function (c_name) {
		var c_start,
		c_end;
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start !== -1) {
				c_start += c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end === -1) {
					c_end = document.cookie.length;
				}
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return 0;
	};
	
	// Return 'i' constrained to the specified bounds.
	cmnMisc.withinBounds = function (i, min, max) {
		if (i > max) {
			return max;
		} else if (i < min) {
			return min;
		} else {
			return i;
		}
	};
	
	cmnMisc.spanMilliseconds = function (startTime, endTime) {
		var startMills,
		endMills,
		retval;
		startMills = startTime.getTime();
		endMills = endTime.getTime();
		retval = endMills - startMills;
		return retval;
	};
	
	cmnMisc.spanMilliStr5 = function (startTime, endTime) {
		var mills,
		retval;
		mills = cmnMisc.spanMilliseconds(startTime, endTime);
		retval = mills.toString().padLeft(5);
		return retval;
	};
	
	/* cmnMisc.postToUrl = function (path, params, target) {
	var form,
	key,
	hiddenField;
	
	form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", path);
	form.setAttribute("style", "display:none");
	if (target) {
	form.setAttribute("target", target);
	}
	
	/ *jslint forin: true * /
	for (key in params) {
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", key);
	hiddenField.setAttribute("value", params[key]);
	form.appendChild(hiddenField);
	}
	/ *jslint forin: false * /
	
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
	};*/
	
	/* cmnMisc.getFrameDocument = function (frameId) {
	var d1,
	d2;
	d1 = document.getElementById(frameId);
	d2 = (d1.contentWindow || d1.contentDocument);
	if (d2.document) {
	d2 = d2.document;
	}
	return d2;
	};*/
	
	/* cmnMisc.PageQueryClass = function (q) {
	var i;
	
	if (q.length > 1 && q[0] === "?") {
	this.q = q.substring(1, q.length);
	} else {
	this.q = null;
	}
	
	this.keyValuePairs = [];
	if (q) {
	for (i = 0; i < this.q.split("&").length; i++) {
	this.keyValuePairs[i] = this.q.split("&")[i];
	}
	}
	
	this.getKeyValuePairs = function () {
	return this.keyValuePairs;
	};
	
	this.getRawValue = function (key) {
	var j;
	for (j = 0; j < this.keyValuePairs.length; j++) {
	if (this.keyValuePairs[j].split("=")[0] === key) {
	return this.keyValuePairs[j].split("=")[1];
	}
	}
	return false;
	};
	
	this.getValue = function (key) {
	return unescape(this.getRawValue(key));
	};
	
	this.getParameters = function () {
	var a,
	j;
	a = new Array(this.getLength());
	for (j = 0; j < this.keyValuePairs.length; j++) {
	a[j] = this.keyValuePairs[j].split("=")[0];
	}
	return a;
	};
	
	this.getLength = function () {
	return this.keyValuePairs.length;
	};
	};*/
	
	cmnMisc.minInt32 = Math.pow(-2, 31);
	cmnMisc.maxInt32 = 0 - (cmnMisc.minInt32 + 1);
	
	cmnMisc.rand = (function () {
		// Get a random float less than 1, positive.
		function nextFloat() {
			return Math.random();
		}
		
		// Get a random float in range: 0 <= result < high.
		function nextRangedFloat(high) {
			return Math.random() * high;
		}
		
		// Get a random integer in range: 0 <= result < high.
		function nextRangedInt(high) {
			return Math.floor(Math.random() * high);
		}
		
		// Get a random integer (32-bit signed, positive only).
		function nextInt32() {
			return Math.floor(Math.random() * cmnMisc.maxInt32);
		}
		
		// Get a random boolean.
		function nextBool() {
			return Math.random() >= 0.5;
		}
		
		return {
			nextFloat : nextFloat,
			nextRangedFloat : nextRangedFloat,
			nextRangedInt : nextRangedInt,
			nextInt32 : nextInt32,
			nextBool : nextBool
		};
	}
		());
	
}
	(this));
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
			
			function vectorMath(mathFunc, first, second) {
				if (second instanceof V) {
					return new V(mathFunc(first.x, second.x),
						mathFunc(first.y, second.y),
						mathFunc(first.z, second.z));
				}
				
				throw new Error("The argument passed to vector math is an unsupported type.");
			}
			
			V.prototype.add = function (other) {
				var mathFunc = function (t, o) {
					return t + o;
				};
				return vectorMath(mathFunc, this, other);
			};
			
			V.prototype.sub = function (other) {
				var mathFunc = function (t, o) {
					return t - o;
				};
				return vectorMath(mathFunc, this, other);
			};
			
			V.prototype.mul = function (other) {
				var mathFunc = function (t, o) {
					return t * o;
				};
				return vectorMath(mathFunc, this, other);
			};
			
			V.prototype.div = function (other) {
				var mathFunc = function (t, o) {
					return t / o;
				};
				return vectorMath(mathFunc, this, other);
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
		
		return r;
	};
}
	(this));
(function (global) {
	"use strict";
	
	var log = global.cmnLog = global.cmnLog || {};
	
	log.mouse = function (msg) {
		log.add('MOUSE', msg);
	}
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector;
	
	// Metrics of an actual vessel.
	spaceReign.Vessel = function (shipName, shipClassIndex, shipCoord, shipDest) {
		this.name = shipName;
		// The index in the ship classes array.
		this.classIndex = shipClassIndex;
		this.coord = shipCoord;
		this.dest = shipDest;
		// If the ship is at it's destination.
		this.arrived = false;
	};
	spaceReign.Vessel.prototype = {
		changeName : function (newName) {
			this.name = newName;
		}
	};
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector;
	
	// A type of vessel.
	spaceReign.ShipClass = function (name, speed) {
		this.name = name;
		this.speed = speed;
	};
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {};
	
	// A holacre is a standard cube unit of measure for interstella shipments.
	spaceReign.TradeItem = function (itemName) {
		// Name of the goods.
		this.name = itemName;
		// How much the solar system will pay for a holacre of the goods.
		this.importPrice = 0;
		// How much the solar system sells a holacre of the goods for.
		this.exportPrice = 0;
		// How many of the goods the solar system currently has.
		// (In holacres, as a rough estimate. Can be negative, meaning in heavy demand.)
		this.quantity = 0;
	};
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector;
	
	spaceReign.Solar = function (solarName) {
		// Solar system name. If undefined then will be randomly generated. The seed comes from the "coord" value.
		this.name = solarName;
		// 3D vector coordinates of the star. (Relative to a sector, NOT absolute space coordinates.)
		this.coord = Vector.Empty;
		// If the solar system is occupied.
		this.inhabited = false;
		// Size of the solar system.
		this.radius = 0.02;
		// Information about trade items.
		this.tradeItems = [];
	};
	
	spaceReign.Solar.createName = function(spaceCoords) {
		var randomSeed = spaceCoords;
		//Math.
		return 'r';
	};
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector;
	
	spaceReign.initialSettings = (function () {
		var timeMarginFraction = 0.2;
		
		return {
			epsilon : 0.01,
			
			// Set a margin that the Governor tries to keep processing time within desired frame rate.
			timeMarginMultiplier : 1 - timeMarginFraction,
			minMarginFraction : 0.01,
			
			// Used in Governor to determine when to update workload proportions.
			numItersToWait : 5,
			
			// Average number of stars in the universe.
			numberOfSolarSystems : 40000,
			
			initialNumberOfShips : 600,
			
			// Sectors define space as a checker board.
			// (Sizes are relative to the sector size which has a width, height and depth of 1.)
			//sectorSize: { x: 1, y: 1, z: 1 },
			// This is how many sectors in the star map, horizontally and vertically.
			// This is also the most top-right point of space.
			sectorCount : new Vector(80, 48),
			
			maxZoom : 0.01,
			minZoom : 2,
			defZoom : 0.25,
			
			fov : Math.PI * (1 - 1 / 2),
			zNearest : 1,
			zFurthest : 100000,
			
			framesPerSecond : 30
		};
	}
		());
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {};
	
	spaceReign.tradeGoods = {
		// Define the names of the trade items.
		TradeItemNames : ["Gem-stones", "Food", "Water", "Oil", "Flish"],
		
		GetIndexByName : function (itemName) {
			return this.TradeItemNames.indexOf(itemName);
		}
	};
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	ShipClass = spaceReign.ShipClass;
	
	// The types of vessel class available.
	spaceReign.shipClasses = (function () {
		var ar = [];
		
		// Standard ships move by warping space.
		ar.push(new ShipClass('Runt', 1));
		ar.push(new ShipClass('Rump', 2.5));
		
		// This class of ship doesn't move but travels by folding space. (AKA. heighliner)
		ar.push(new ShipClass('Void-folder', 0));
		
		return ar;
	}
		());
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	rand = cmnMisc.rand,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	initialSettings = spaceReign.initialSettings,
	TradeItem = spaceReign.TradeItem,
	tradeGoods = spaceReign.tradeGoods,
	Solar = spaceReign.Solar;
	
	// Space is made up of sectors of solar systems.
	spaceReign.starMap = (function () {
		var space,
		margin,
		numberOfSectors,
		minStarsPerSector,
		maxStarsPerSector,
		averageStarsPerSector,
		rangeStarsPerSector,
		ix,
		iy,
		ar,
		v1 = new Vector(1, 1, 1),
		v2 = new Vector(2, 2, 2);
		
		// (Sizes are relative to the sector size which has a width, height and depth of 1.)
		//sectorSize = new Vector(1, 1, 1);
		
		numberOfSectors = initialSettings.sectorCount.x * initialSettings.sectorCount.y;
		averageStarsPerSector = initialSettings.numberOfSolarSystems / numberOfSectors;
		margin = Math.max(1, averageStarsPerSector / 10);
		minStarsPerSector = Math.max(0, averageStarsPerSector - margin);
		maxStarsPerSector = averageStarsPerSector + margin;
		rangeStarsPerSector = maxStarsPerSector - minStarsPerSector + 1;
		
		// This creates a solar system within the specified area.
		function createSolar(area /*Vector*/
		) {
			var i,
			sol;
			
			function makeTradeItem() {
				var ti = new TradeItem();
				ti.ImportPrice = rand.nextInt32();
				ti.ExportPrice = rand.nextInt32();
				ti.Quantity = rand.nextInt32();
				return ti;
			}
			
			sol = new Solar();
			sol.coord = area;
			sol.inhabited = rand.nextBool();
			for (i = 0; i < tradeGoods.TradeItemNames.length; i++) {
				sol.tradeItems.push(makeTradeItem());
			}
			return sol;
		}
		
		// Create stars in a sector of the universe.
		function createSectorSolars() {
			var i,
			numSolars,
			sols;
			
			numSolars = minStarsPerSector + rand.nextRangedInt(rangeStarsPerSector);
			
			sols = [];
			for (i = 1; i <= numSolars; i++) {
				//sols.push(createSolarWithin(topLeft, bottomRight));
				// (Sizes are relative to the sector size which has a width, height and depth of 1.)
				sols.push(createSolar(rand.nextVectorFloat(v1)));
			}
			sols.sort(function (s1, s2) {
				return cmnSpatial.compare(s1.coord, s2.coord);
			});
			return sols;
		}
		
		// Create the star map of sectors.
		space = [];
		for (ix = 0; ix < initialSettings.sectorCount.x; ix++) {
			ar = [];
			for (iy = 0; iy < initialSettings.sectorCount.y; iy++) {
				ar[iy] = createSectorSolars(ix, iy);
			}
			space[ix] = ar;
		}
		
		return {
			// The bottom-left back-most point of space is zero.
			zero : new Vector(0, 0, 0),
			
			// The star map.
			space : space
		};
	}
		());
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	rand = cmnMisc.rand,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	initialSettings = spaceReign.initialSettings,
	TradeItem = spaceReign.TradeItem,
	Solar = spaceReign.Solar,
	ShipClass = spaceReign.ShipClass,
	Vessel = spaceReign.Vessel,
	tradeGoods = spaceReign.tradeGoods,
	shipClasses = spaceReign.shipClasses,
	starMap = spaceReign.starMap;
	
	spaceReign.vessels = (function () {
		var I = {}; // I will be the returned object instance.
		
		// This is how far through the ship list "iterateTask" has traversed.
		I.taskStateIndex = 0;
		
		// This is how many jobs "iterateTask" needs to do. (The number of ships currently in transit.)
		I.taskCount = 0;
		Object.defineProperty(I, 'taskCount', {
			get : function () {
				return I.allShips.length;
			}
		});
		
		// Here is the portion that "iterateTask" is allowed process in one calling.
		I.taskPortion = cmnMisc.maxInt32;
		
		// The array of all ships in the game.
		I.allShips = (function () {
			var i,
			ar;
			
			function makeShip() {
				var classIndex,
				vx,
				vy,
				coord,
				dest,
				ship,
				v2 = new Vector(2, 2);
				
				function chooseSystem() {
					var sectorCenter,
					solars;
					sectorCenter = initialSettings.sectorCount.div(v2);
					solars = starMap.space[sectorCenter.x][sectorCenter.y];
					if (solars.length === 0) {
						// A fix for when a sector doesn't have any stars.
						return new Solar();
					}
					return solars[rand.nextRangedInt(solars.length)];
				}
				
				// Now make the Vessel object.
				classIndex = rand.nextRangedInt(shipClasses.length);
				// (Sizes are relative to the sector size which has a width, height and depth of 1.)
				vx = rand.nextRangedFloat(1);
				vy = rand.nextRangedFloat(1);
				coord = initialSettings.sectorCount.div(v2).add(new Vector(vx, vy, 0));
				dest = chooseSystem();
				ship = new Vessel(undefined, classIndex, coord, dest);
				return ship;
			}
			
			ar = [];
			for (i = 0; i < initialSettings.initialNumberOfShips; i++) {
				ar.push(makeShip());
			}
			return ar;
		}
			());
		
		// This manages the coordination of vessels.
		I.iterateTask = function () {
			var i,
			s,
			startIndex,
			tuple,
			endIndex,
			extraEndIndex,
			dilation = I.taskCount / I.taskPortion;
			
			// A function to move a coordinate closer to a destination.
			// Returns the tuple (newCoordinate : DepthPoint, isAtDestination : bool)
			function moveStep(hereCoord, thereCoord, moveDistance) {
				var distCoord,
				fullDistance,
				ratio,
				ratioVector,
				result;
				
				distCoord = thereCoord.sub(hereCoord);
				fullDistance = distCoord.length;
				if (moveDistance > fullDistance) {
					// The move distance will over-shoot the target, so just return the destination.
					return {
						coord : thereCoord,
						arrived : true
					};
				}
				ratio = moveDistance / fullDistance;
				ratioVector = new Vector(ratio, ratio);
				result = hereCoord.add(distCoord).mul(ratioVector);
				return {
					coord : result,
					arrived : false
				};
			}
			
			// A function to move a ship closer to it's destination.
			function moveShip(ship) {
				if (!ship.arrived) {
					var v = moveStep(ship.coord, ship.dest.coord, (shipClasses[ship.classIndex].speed * dilation));
					ship.coord = v.coord;
					ship.arrived = v.arrived;
				}
			}
			
			// Move the allowed portion of ships *that are currently in transit*.
			startIndex = I.taskStateIndex;
			tuple = (function () {
				var e,
				count;
				
				count = I.allShips.length;
				e = -1 + startIndex + (I.taskPortion > count ? count : I.taskPortion);
				
				if (e < count) {
					return [e, -1];
				} else {
					return [count - 1, e - count];
				}
			}
				());
			endIndex = tuple[0];
			extraEndIndex = tuple[1];
			
			// Here I should be splitting the list into left, middle and right segments
			// and then joining them back after, perhaps.
			
			// Do the right portion.
			for (i = startIndex; i <= endIndex; i++) {
				moveShip(I.allShips[i]);
			}
			
			// Do the left portion.
			if (extraEndIndex >= 0) {
				for (i = 0; i <= extraEndIndex; i++) {
					moveShip(I.allShips[i]);
				}
				I.taskStateIndex = extraEndIndex + 1;
			} else {
				s = endIndex + 1;
				I.taskStateIndex = (s === I.allShips.length) ? 0 : s;
			}
		};
		
		return I;
	}
		());
}
	(this));
﻿(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	models = spaceReign.models = {},
	cmnMisc = global.cmnMisc,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	initialSettings = spaceReign.initialSettings;
	
	function createSunSphere(bag) {
		var steps,
		end,
		coord,
		i,
		geometry,
		material,
		mesh;
		
		geometry = new THREE.IcosahedronGeometry();
		material = new THREE.MeshBasicMaterial({
				color : bag.color,
				shading : THREE.FlatShading
			});
		
		mesh = new THREE.Mesh(geometry, material);
		mesh.scale = bag.scale;
		mesh.position = bag.position;
		
		steps = [];
		end = bag.stepsOffset + 7;
		for (i = bag.stepsOffset; i < end; i++) {
			coord = {
				x : bag.xSpeed * i,
				y : bag.ySpeed * i
			};
			steps.push(cmnMisc.clone(coord));
		}
		
		cmnSpatial.tweenLoop(cmnMisc.rand.nextRangedInt(1000) + 3000, mesh.rotation, steps);
		
		return mesh;
	}
	
	models.createSolarModel = function (solData) {
		var group,
		bag = {};
		
		bag.scale = new THREE.Vector3(solData.radius, solData.radius, solData.radius);
		bag.position = new THREE.Vector3(solData.coord.x, solData.coord.y, solData.coord.z);
		
		bag.xSpeed = Math.PI;
		bag.ySpeed = Math.PI / 1.5;
		
		group = new THREE.Object3D();
		
		bag.color = 0xFFFF97;
		bag.stepsOffset = 0;
		group.add(createSunSphere(bag));
		
		bag.color = 0xFFFC00;
		bag.stepsOffset = 0.8;
		group.add(createSunSphere(bag));
		
		return group;
	};
	
	models.createSectorStrutsModel = function () {
		var model = new THREE.Object3D(),
		addLine = cmnSpatial.makeAddLineFunc(model, 0xFF0000);
		
		// Add the x,y axis lines.
		addLine([[0, 1, 1], [0, 0, 1], [1, 0, 1]]);
		
		// Add the z axis line.
		addLine([[0, 0, 0], [0, 0, 1]]);
		
		//model.position.set(0, 0, 0);
		// (Sizes are relative to the sector size which has a width, height and depth of 1.)
		//model.scale.set(1, 1, 1);
		return model;
	};
	
	models.createBox = function (square1Coordinates, square2Coordinates) {
		var s1 = square1Coordinates,
		s2 = square2Coordinates,
		model = new THREE.Object3D(),
		addLine = cmnSpatial.makeAddLineFunc(model, 0x00CCDD);
		
		// Add square 1.
		addLine(s1, true);
		
		// Add square 2.
		addLine(s2, true);
		
		// Add the joining lines.
		addLine([s1[0], s2[0]]);
		addLine([s1[1], s2[1]]);
		addLine([s1[2], s2[2]]);
		addLine([s1[3], s2[3]]);
		
		return model;
	};
}
	(this));
﻿(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	initialSettings = spaceReign.initialSettings,
	starMap = spaceReign.starMap,
	models = spaceReign.models;
	
	spaceReign.visuals = (function () {
		var winSize,
		viewportSize,
		imgDir,
		imageNames,
		sunTex,
		pinkLoveTex,
		camera = new THREE.PerspectiveCamera(1, 1, 1, 1),
		viewPoint = new THREE.Vector3(0, 0, 0),
		scene = new THREE.Scene(),
		renderer = new THREE.WebGLRenderer({
				antialias : true
			}),
		projector = new THREE.Projector(),
		manageSectorSolars, //stats, sectorGroups = [ new THREE.Object3D() ],
		finalSector = {
			x : initialSettings.sectorCount.x - 1,
			y : initialSettings.sectorCount.y - 1
		};
		
		renderer.sortObjects = false;
		camera = undefined;
		
		imgDir = '../Images/';
		sunTex = THREE.ImageUtils.loadTexture(imgDir + 'sun.png');
		pinkLoveTex = THREE.ImageUtils.loadTexture(imgDir + 'pink_love.png');
		
		manageSectorSolars = (function () {
			var sides = { // the sides of the viewed rectangle of sectors
				from : { // the start sector (inclusive)
					x : 0,
					y : 0
				},
				to : { // the end sector (exclusive)
					x : 0,
					y : 0
				}
			},
			sectors = [];
			
			function renderRowOfSectorModels(bag) {
				var x,
				y,
				j,
				arr = [],
				sectorModel,
				solsDataArray,
				solModel;
				
				// Iterate the visible sectors.
				y = Math.floor(bag.startY);
				for (x = Math.floor(bag.startX); x < bag.xEnd; x++) {
					sectorModel = new THREE.Object3D();
					
					// Get data about the stars in the sector.
					solsDataArray = starMap.space[x][y];
					
					// Iterate the stars.
					for (j = 0; j < solsDataArray.length; j++) {
						// Create the model of a star and add to the sector model.
						solModel = models.createSolarModel(solsDataArray[j]);
						sectorModel.add(solModel);
					}
					
					// Draw the sector's struts.
					sectorModel.add(models.createSectorStrutsModel());
					
					// Move the whole sector into position.
					sectorModel.position.set(x, y, 0);
					
					// Add the sector to my array and the THREE scene.
					arr.push(sectorModel);
					scene.add(sectorModel);
				}
				return arr;
			}
			
			// Remember: this will add to the end in order, but
			// add to the beginning in reverse order.
			function addSectorRows(bag) {
				var i,
				row;
				
				bag.xEnd = bag.startX + bag.fullWidth;
				
				// Add sector rows.
				for (i = 0; i < bag.addSize; i++) {
					row = renderRowOfSectorModels(bag);
					if (bag.atBeginning) {
						sectors.unshift(row);
					} else {
						sectors.push(row);
					}
					bag.startY++;
				}
			}
			
			// This will always add in order, at either end.
			function addSectorColumns(bag) {
				var i,
				cols;
				
				bag.xEnd = bag.startX + bag.addSize;
				
				// Add columns to each sector row.
				for (i = 0; i < sectors.length; i++) {
					cols = renderRowOfSectorModels(bag);
					if (bag.atBeginning) {
						sectors[i] = cols.concat(sectors[i]);
					} else {
						sectors[i] = sectors[i].concat(cols);
					}
					bag.startY++;
				}
			}
			
			function addSectors(newSides) {
				var bag = {}; // bits and gubbins
				
				// Add sectors to the left.
				bag.addSize = sides.from.x - newSides.from.x;
				if (bag.addSize > 0) {
					bag.startX = newSides.from.x;
					bag.startY = newSides.from.y;
					bag.atBeginning = true;
					addSectorColumns(bag);
				}
				
				// Add sectors to the right.
				bag.addSize = newSides.to.x - sides.to.x;
				if (bag.addSize > 0) {
					bag.startX = sides.to.x;
					bag.startY = newSides.from.y;
					bag.atBeginning = false;
					addSectorColumns(bag);
				}
				
				bag.fullWidth = newSides.to.x - newSides.from.x;
				
				// Add sectors to the bottom.
				bag.addSize = sides.from.y - newSides.from.y;
				if (bag.addSize > 0) {
					bag.startX = newSides.from.x;
					bag.startY = newSides.from.y;
					bag.atBeginning = true;
					addSectorRows(bag);
				}
				
				// Add sectors to the top. (y > 0)
				bag.addSize = newSides.to.y - sides.to.y;
				if (bag.addSize > 0) {
					bag.startX = newSides.from.x;
					bag.startY = sides.to.y;
					bag.atBeginning = false;
					addSectorRows(bag);
				}
			}
			
			function removeArrayOfSectors(arr) {
				var i;
				for (i = 0; i < arr.length; i++) {
					scene.remove(arr[i]);
				}
			}
			
			function removeSectorRows(index, removeHeight) {
				var i,
				rows;
				
				if (removeHeight <= 0) {
					return;
				}
				
				// Remove sector rows.
				rows = sectors.splice(index, removeHeight);
				for (i = 0; i < rows.length; i++) {
					removeArrayOfSectors(rows[i]);
				}
			}
			
			function removeSectorColumns(index, removeWidth) {
				var i,
				cols;
				
				if (removeWidth <= 0) {
					return;
				}
				
				// Remove sector columns from each row.
				for (i = 0; i < sectors.length; i++) {
					cols = sectors[i].splice(index, removeWidth);
					removeArrayOfSectors(cols);
				}
			}
			
			function removeSectors(newSides) {
				var removeSize;
				
				// Remove sectors as necessary.
				removeSize = newSides.from.y - sides.from.y;
				removeSectorRows(0, removeSize);
				
				removeSize = sides.to.y - newSides.to.y;
				removeSectorRows(-removeSize, removeSize);
				
				removeSize = newSides.from.x - sides.from.x;
				removeSectorColumns(0, removeSize);
				
				removeSize = sides.to.x - newSides.to.x;
				removeSectorColumns(-removeSize, removeSize);
			}
			
			function determineSides() {
				var r;
				
				if (camera) {
					r = cmnSpatial.sidesAtDepthWithinBounds(projector, camera, finalSector);
					r.to.x++;
					r.to.y++;
					return r;
				}
				
				return cmnMisc.clone(sides);
			}
			
			function assignSceneSectors() {
				var newSides = determineSides();
				removeSectors(newSides);
				addSectors(newSides);
				sides = newSides;
			}
			
			function init() {
				var newSides = determineSides();
				addSectors(newSides);
				sides = newSides;
			}
			
			return {
				init : init,
				assignSceneSectors : assignSceneSectors,
				sectors : sectors
			};
		}
			());
		
		function init() {
			var i,
			$window = $(window);
			
			winSize = {
				x : $window.width(),
				y : $window.height()
			};
			
			// Add dots down the z axis.
			/*for (i = -10; i <= 20; i += 0.1) {
			if (i < 0 || i > 1) {
			scene.add(models.createSolarModel({
			radius : 0.01,
			coord : {
			x : 0,
			y : 0,
			z : i
			}
			}));
			}
			}*/
			
			// Load the solars of each sector into the rendering engine.
			manageSectorSolars.init();
		}
		
		function resize() {
			var $starChartDiv,
			viewAngle,
			aspect,
			near,
			far,
			$window = $(window);
			
			winSize = {
				x : $window.width(),
				y : $window.height()
			};
			
			viewAngle = 96;
			aspect = winSize.x / winSize.y;
			near = 0.5;
			far = 2;
			
			scene.remove(camera);
			camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
			camera.position.x = 0.5;
			camera.position.y = 0.5;
			camera.position.z = 1.8;
			scene.add(camera);
			
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
			viewPoint.x = camera.position.x;
			viewPoint.y = camera.position.y;
			camera.lookAt(viewPoint);
			
			//            group.rotation.x += 0.01;
			//            group.rotation.y += 0.02;
			
			renderer.render(scene, camera);
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
		xar = starMap.space;
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
			manageSectorSolars.assignSceneSectors();
			render();
			//stats.update();
		}
		
		function moveCamera(screenFrom, screenTo) {
			var xDist,
			yDist,
			fromPoint,
			toPoint;
			
			fromPoint = cmnSpatial.screenPosToCoordsAtDepth(screenFrom, 1, viewportSize, projector, camera);
			toPoint = cmnSpatial.screenPosToCoordsAtDepth(screenTo, 1, viewportSize, projector, camera);
			
			xDist = fromPoint.x - toPoint.x;
			yDist = fromPoint.y - toPoint.y;
			
			camera.position.x += xDist;
			camera.position.y += yDist;
		}
		
		function getObjectsInScreenRegion(screenPos, size) {
			var foundObjects,
			firstSector,
			lastSector,
			lineBottomLeft,
			lineTopRight,
			sectorBackCoord,
			sectorFrontCoord,
			someCoordBL,
			someCoordTR,
			space = starMap.space,
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
				}, viewportSize, projector, camera);
			
			lineTopRight = cmnSpatial.screenPosToNearFarCoords({
					x : screenPos.x + size,
					y : screenPos.y - size
				}, viewportSize, projector, camera);
			
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
			lastSector = {
				x : pickMost(lineTopRight.sectorBackCoord.x, lineTopRight.sectorFrontCoord.x),
				y : pickMost(lineTopRight.sectorBackCoord.y, lineTopRight.sectorFrontCoord.y)
			};
			
			// Fix sector indexes that are out of bounds.
			firstSector = {
				x : pickMost(0, firstSector.x),
				y : pickMost(0, firstSector.y)
			};
			
			lastSector = {
				x : pickLeast(finalSector.x, lastSector.x),
				y : pickLeast(finalSector.y, lastSector.y)
			};
			
			// A list of collided objects.
			foundObjects = [];
			
			// Collision test all chosen sectors.
			for (cx = firstSector.x; cx <= lastSector.x; cx++) {
				column = space[cx];
				for (cy = firstSector.y; cy <= lastSector.y; cy++) {
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
			getObjectsInScreenRegion : getObjectsInScreenRegion
		};
	}
		());
	
}
	(this));
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	rand = cmnMisc.rand,
	initialSettings = spaceReign.initialSettings,
	vessels = spaceReign.vessels;
	
	spaceReign.governor = (function () {
		var portionMultiplier,
		reproportioningCountdown;
		
		// The task portion allowance, it is the multiplier of each task's total job count.
		// (It will never be greater than 1, but always greater than 0)
		portionMultiplier = 1;
		
		// A count of how many iterations have passed since the last proportioning.
		reproportioningCountdown = 0;
		
		// Set the portion allowance for each task, based on the mportionMultiplier.
		// Basically there should be a portion field in the module of each task,
		// and this function will alter that number when a new mportionMultiplier is set.
		function doApportioning() {
			vessels.taskPortion = portionMultiplier * vessels.taskCount;
		}
		
		// Get each task to do it's thing.
		function doTasks() {
			// Move a portion of the vessels.
			vessels.iterateTask();
			
			// Work out how much to divide each task's workload.
			if (reproportioningCountdown === 0) {
				//var paintTimeAverage = visualizer.PaintTimer.ElapsedMilliseconds / float InitialSettings.NumItersToWait
				//var taskTimeAverage = float taskTimer.ElapsedMilliseconds / float InitialSettings.NumItersToWait
				//visualizer.PaintTimer.Reset()
				//taskTimer.Reset()
				
				// Reset the counter.
				reproportioningCountdown = initialSettings.numItersToWait;
				
				// Set a new divisor of portions.
				var portionMultiplier = (function () {
					var timeAllowance,
					timeMargin,
					p,
					halfP;
					
					// Deduct from "frame rate" the "painting time" to get "allowed processing time".
					timeAllowance = 1;
					//visualizer.MillisecondsPerFrame - paintTimeAverage
					
					// Reduce that time by a margin.
					timeMargin = timeAllowance * initialSettings.timeMarginMultiplier;
					
					//p = mportionMultiplier * timeMargin / taskTimeAverage
					//p = timeMargin / taskTimeAverage;
					p = timeMargin;
					
					if (p > 1) {
						//viz.StepUpFps()
						//recomputeFormTimer ()
						return 1;
					} else if (p > 0) {
						return p;
					} else {
						//viz.StepDownFps()
						//recomputeFormTimer ()
						halfP = portionMultiplier / 2;
						if (halfP > initialSettings.minMarginFraction) {
							return halfP;
						} else {
							return initialSettings.minMarginFraction;
						}
					}
				}
					());
				// Now to set the new portion allowance in all tasks.
				doApportioning();
			} else {
				reproportioningCountdown--;
			}
		}
		
		function recomputeGameTimings(/*fps*/
		) {
			//visualizer.FramesPerSecond <- fps
		}
		
		function initialize() {
			//taskTimer.Start()
			recomputeGameTimings(1);
			//visualizer.FramesPerSecond
		}
		
		// Manage the tasks.
		function iterateTasks() {
			// Run all tasks.
			doTasks();
		}
		
		return {
			initialize : initialize,
			recomputeGameTimings : recomputeGameTimings,
			iterateTasks : iterateTasks
		};
	}
		());
}
	(this));
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
	starMap = spaceReign.starMap;
	
	spaceReign.controls = (function () {
		function init() {
			// document.addEventListener('mousemove', onDocumentMouseMove, false);
			// document.addEventListener('touchstart', onDocumentTouchStart, false);
			// document.addEventListener('touchmove', onDocumentTouchMove, false);
			
			initMouseInput();
		}
		
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
			
			function showSolarDialog(str) {
				var $div;
				
				// Get the solar dialog div.
				$div = $('#solar-dialog');
				
				// Load its content.
				$div.load('../markup/dialogs.html #solar', function () {
					// Set the name.
					$div.find('#sol-name').html(str);
				});
				
				// Show the div as a jQueryUI dialog.
				$div.dialog({
					autoOpen : false,
					title : 'Solar System - Space Reign',
					width : 500,
					height : 300
				}).dialog('open');
			}
			
			function mouseClick() {
				var objs,
				o,
				str = '',
				i;
				
				log.mouse('CLICK');
				
				function coordSystem(vector) {
					var v = vector;
					function f(n) {
						return n.toFixed(3);
					}
					return '({0},{1},{2})'.format(f(v.x), f(v.y), f(v.z));
				}
				
				function sectorPlusSolarCoords(solCoord) {
					return coordSystem(solCoord);
				}
				
				objs = visuals.getObjectsInScreenRegion(mouseNow.pos, clickRegionSize);
				
				if (objs.length === 0) {
					return;
				}
				
				for (i = 0; i < objs.length; i++) {
					str += '<br>';
					o = objs[i];
					if (o.obj instanceof Solar) {
						str += '{0} {1}'.format(o.obj.name || Solar.createName(o.objCoord), sectorPlusSolarCoords(o.objCoord));
					} else {
						throw new Error('Unknown object type before showing the solar dialog.');
					}
				}
				
				showSolarDialog('found {0} objects:{1}'.format(objs.length, str));
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
					if (e.which == 1) {
						log.mouse('which==1');
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
				if (e.which == 1 && mouseNow.button) {
					log.mouse('which==1');
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
			init : init
		};
	}
		());
}
	(this));
// A game inspired by the Amiga game: Supremacy. (and Megalomania, The Settlers, Elite...)
// Codename: Space Reign
// Proposed Title: Galactic Reign
// By->Nasher
(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	visuals = spaceReign.visuals,
	controls = spaceReign.controls,
	vessels = spaceReign.vessels;
	
	function ticker() {
		requestAnimationFrame(ticker);
		
		//controls.handleInput();
		visuals.draw();
		vessels.iterateTask();
	}
	
	$(document).ready(function () {
		controls.init();
		visuals.init();
		visuals.resize();
		
		// Load the images in parallel and begin the game ticker once loaded.
		//scene.loadImages(visuals.imageNames, ticker);
		requestAnimationFrame(ticker);
	});
	
	$(window).resize(function () {
		visuals.resize();
	});
}
	(this));
