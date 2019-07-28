(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log,
	rand = CMN.rand;
	
	SR.governor = (function () {
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
			SR.vessels.taskPortion = portionMultiplier * SR.vessels.taskCount;
		}
		
		// Get each task to do it's thing.
		function doTasks() {
			// Move a portion of the vessels.
			SR.vessels.iterateTask();
			
			// Work out how much to divide each task's workload.
			if (reproportioningCountdown === 0) {
				//var paintTimeAverage = visualizer.PaintTimer.ElapsedMilliseconds / float InitialSettings.NumItersToWait
				//var taskTimeAverage = float taskTimer.ElapsedMilliseconds / float InitialSettings.NumItersToWait
				//visualizer.PaintTimer.Reset()
				//taskTimer.Reset()
				
				// Reset the counter.
				reproportioningCountdown = SR.initialSettings.numItersToWait;
				
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
					timeMargin = timeAllowance * SR.initialSettings.timeMarginMultiplier;
					
					//p = mportionMultiplier * timeMargin / taskTimeAverage
					//p = timeMargin / taskTimeAverage;
					p = timeMargin;
					
					if (p > 1) {
						//viz.StepUpFps()
						//recomputeFormTimer ()
						return 1;
					}
					
					if (p > 0) {
						return p;
					}
					
					//viz.StepDownFps()
					//recomputeFormTimer ()
					halfP = portionMultiplier / 2;
					if (halfP > SR.initialSettings.minMarginFraction) {
						return halfP;
					}
					
					return SR.initialSettings.minMarginFraction;
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
