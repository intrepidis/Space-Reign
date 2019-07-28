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
