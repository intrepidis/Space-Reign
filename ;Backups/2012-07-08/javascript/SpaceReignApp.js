// A game inspired by the Amiga game: Supremacy. (and Megalomania, The Settlers, Elite...)
// Codename: Space Reign
// Proposed Title: Galactic Reign
// By->Nasher
(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {};
	
	function ticker() {
		requestAnimationFrame(ticker);
		
		//SR.controls.handleInput();
		SR.starChartVisuals.draw();
		SR.vessels.iterateTask();
	}
	
	$(document).ready(function () {
		SR.companies.init();
		SR.vessels.init();
		SR.textures.init();
		SR.starChartVisuals.init();
		SR.controls.init();
		SR.starChartVisuals.resize();
		
		requestAnimationFrame(ticker);
	});
	
	$(window).resize(function () {
		SR.starChartVisuals.resize();
	});
}
	(this));
