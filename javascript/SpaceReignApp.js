// Space Reign
// A game inspired by the Amiga game: Supremacy. (and Megalomania, The Settlers, Elite...)
// Developed by Nasher / Chris M. Nash
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
		SR.gameLoader.loadGame();
		SR.starChartVisuals.resize();
		requestAnimationFrame(ticker);
	});
	
	$(window).resize(function () {
		SR.starChartVisuals.resize();
	});
}
	(this));
