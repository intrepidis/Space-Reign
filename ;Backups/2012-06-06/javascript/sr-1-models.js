(function (global) {
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
		
		bag.scale = new THREE.Vector3(solData.mass, solData.mass, solData.mass);
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
