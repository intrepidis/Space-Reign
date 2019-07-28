(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN;
	
	SR.starChartModels = (function () {
		var X = {}, // This will be the publically exposed object instance.
		N = {}; // Enclosed (private) members shall reside here.
		
		(function ENCLOSED_METHODS() {
			N.createSunSphere = function (bag) {
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
					steps.push(CMN.misc.clone(coord));
				}
				
				CMN.spatial.tweenLoop(CMN.rand.nextRangedInt(1000) + 3000, mesh.rotation, steps);
				
				mesh.name = 'sun sphere';
				return mesh;
			};
			
			N.createSolarStalk = function (p) {
				var model = new THREE.Object3D(),
				addLine = CMN.spatial.makeAddLineFunc(model, 0x333333);
				
				// Add the z axis line.
				addLine([[p.x, p.y, p.z], [p.x, p.y, 0]]);
				
				model.name = 'solar stalk';
				return model;
			};
			
			N.createShipHull = function (bag) {
				var geometry,
				material,
				mesh;
				
				geometry = new THREE.OctahedronGeometry(0.5 / 40);
				material = new THREE.MeshBasicMaterial({
						color : bag.color,
						shading : THREE.FlatShading
					});
				
				mesh = new THREE.Mesh(geometry, material);
				mesh.scale = bag.scale;
				mesh.position = bag.position;
				
				mesh.name = 'ship hull';
				return mesh;
			};
		}
			());
		
		(function EXPOSED_METHODS() {
			X.createSolarModel = function (mass, position) {
				var group = new THREE.Object3D(),
				bag = {};
				
				// Create a solar stalk.
				group.add(N.createSolarStalk(position));
				
				// Make the sun.
				bag.scale = new THREE.Vector3(mass, mass, mass);
				bag.position = new THREE.Vector3(position.x, position.y, position.z);
				
				bag.xSpeed = Math.PI;
				bag.ySpeed = Math.PI / 1.5;
				
				bag.color = 0xFFFF97;
				bag.stepsOffset = 0;
				group.add(N.createSunSphere(bag));
				
				bag.color = 0xFFFC00;
				bag.stepsOffset = 0.8;
				group.add(N.createSunSphere(bag));
				
				group.name = 'solar model';
				return group;
			};
			
			X.createSolarOwnerEmblem = function (mass, position, color) {
				var sprite = new THREE.Sprite({
						map : SR.textures.whiteRing,
						useScreenCoordinates : false,
						color : color
					});
				
				mass/=12;
				
				sprite.position = new THREE.Vector3(position.x, position.y, position.z);
				sprite.scale = new THREE.Vector3(mass, mass, mass);
				
				sprite.name = 'solar owner emblem';
				return sprite;
			};
			
			X.createShipModel = function (vessel) {
				var bag = {};
				
				bag.scale = new THREE.Vector3(1, 1, 1);
				bag.position = new THREE.Vector3(vessel.coord.x, vessel.coord.y, vessel.coord.z);
				bag.color = 0x30A9F1;
				
				return N.createShipHull(bag);
			};
			
			X.createSectorStrutsModel = function () {
				var model = new THREE.Object3D(),
				addLine = CMN.spatial.makeAddLineFunc(model, 0xFF0000);
				
				// Add the x,y axis lines.
				addLine([[0, 1, 1], [0, 0, 1], [1, 0, 1]]);
				
				// Add the z axis line.
				addLine([[0, 0, 0], [0, 0, 1]]);
				
				//model.position.set(0, 0, 0);
				// (Sizes are relative to the sector size which has a width, height and depth of 1.)
				//model.scale.set(1, 1, 1);
				model.name = 'sector struts model';
				return model;
			};
			
			X.createBox = function (square1Coordinates, square2Coordinates) {
				var s1 = square1Coordinates,
				s2 = square2Coordinates,
				model = new THREE.Object3D(),
				addLine = CMN.spatial.makeAddLineFunc(model, 0x00CCDD);
				
				// Add square 1.
				addLine(s1, true);
				
				// Add square 2.
				addLine(s2, true);
				
				// Add the joining lines.
				addLine([s1[0], s2[0]]);
				addLine([s1[1], s2[1]]);
				addLine([s1[2], s2[2]]);
				addLine([s1[3], s2[3]]);
				
				model.name = 'box';
				return model;
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
