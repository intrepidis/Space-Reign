// A game inspired by the Amiga game: Supremacy. (and Megalomania, The Settlers, Elite...)
// Codename: Space Reign
// Proposed Title: Galactic Reign
// By->Nasher
(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {};
	
	function ticker() {
		requestAnimationFrame(ticker);
		
		//controls.handleInput();
		SR.starChartVisuals.draw();
		SR.vessels.iterateTask();
	}
	
	$(document).ready(function () {
		SR.vessels.init();
		SR.starChartVisuals.init();
		SR.controls.init();
		SR.starChartVisuals.resize();
		
		// Load the images in parallel and begin the game ticker once loaded.
		//scene.loadImages(visuals.imageNames, ticker);
		requestAnimationFrame(ticker);
	});
	
	$(window).resize(function () {
		SR.starChartVisuals.resize();
	});
}
	(this));
