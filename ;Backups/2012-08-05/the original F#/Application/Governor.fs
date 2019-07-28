namespace CMN.Reign.Application

open System
open System.Diagnostics
open System.Timers
open System.Threading.Tasks

open CMN.Reign.Tools
open CMN.Reign.GraphicEngine
open CMN.Reign.GameLogic

#if MYTRACE
Debug.AutoFlush <- false
let private wantTrace = false
#endif

// This is a static class, as there should only ever be one of these in this game's application.V
type Governor() =
    let starMap = new StarMap()
    let vessels = new Vessels(starMap)
    let visualizer = new Visualizer(starMap, vessels)
    let userInterface = new UserInterface(starMap, visualizer)

    // A stopwatch for keeping track of the time that's spent performing operations.
    let taskTimer = new Stopwatch()
    
    // The task portion allowance, it is the multiplier of each task's total job count.
    // (It will never be greater than 1.0, but always greater than 0.0)
    let mutable m_portionMultiplier = 1.0

    // A count of how many iterations have passed since the last proportioning.
    let mutable m_reproportioningCountdown = 0

    // Set the portion allowance for each task, based on the m_portionMultiplier.
    // Basically there should be a portion field in the module of each task,
    // and this function will alter that number when a new m_portionMultiplier is set.
    let doApportioning () =
        vessels.TaskPortion <- int ( m_portionMultiplier * (float <| vessels.TaskCount) )

    // Get each task to do it's thing.
    let doTasks () =
        // Move a portion of the vessels.
        vessels.IterateTask()

    member this.Initialize() =
        taskTimer.Start()
        this.RecomputeGameTimings(visualizer.FramesPerSecond)

    member this.RecomputeGameTimings(fps) =
        visualizer.FramesPerSecond <- fps

    /// Manage the tasks.
    member this.IterateTasks() =
        // Switch which timer is running.
        taskTimer.Start()
    
        #if MYTRACE
        if wantTrace then
            Debug.WriteLine("TaskManager\tSTART porMul:{0}", m_portionMultiplier)
        #endif

        // Run all tasks.
        doTasks ()

        taskTimer.Stop()
    
        #if MYTRACE
        if wantTrace then
            Debug.WriteLine("TaskManager\tEND {0}", taskTimer.ElapsedMilliseconds)
        #endif

        // Work out how much to divide each task's workload.
        if m_reproportioningCountdown = 0 then
            let paintTimeAverage = float visualizer.PaintTimer.ElapsedMilliseconds / float InitialSettings.NumItersToWait
            let taskTimeAverage = float taskTimer.ElapsedMilliseconds / float InitialSettings.NumItersToWait
            visualizer.PaintTimer.Reset()
            taskTimer.Reset()

            // Reset the counter.
            m_reproportioningCountdown <- InitialSettings.NumItersToWait

            // Set a new divisor of portions.
            let m_portionMultiplier =
                // Deduct from "frame rate" the "painting time" to get "allowed processing time".
                let timeAllowance = visualizer.MillisecondsPerFrame - paintTimeAverage
            
                #if MYTRACE
                if wantTrace then
                    Debug.WriteLine("let timeAllowance({0}) = millisecondsPerFrame({1}) - paintTime({2})", timeAllowance, viz.MillisecondsPerFrame, paintTimeAverage)
                #endif
                            
                // Reduce that time by a margin.
                let timeMargin = timeAllowance * InitialSettings.TimeMarginMultiplier

                #if MYTRACE
                if wantTrace then
                    Debug.WriteLine("let timeMargin({0}) = timeAllowance({1}) * timeMarginMultiplier({2})", timeMargin, timeAllowance, InitialSettings.timeMarginMultiplier)
                #endif

                //let p = m_portionMultiplier * timeMargin / taskTimeAverage
                let p = timeMargin / taskTimeAverage
    
                #if MYTRACE
                if wantTrace then
                    //Debug.WriteLine("let p({0}) = m_portionMultiplier({3}) * timeMargin({1}) / taskTime({2})", p, timeMargin, taskTimeAverage, m_portionMultiplier)
                    Debug.WriteLine("let p({0}) = timeMargin({1}) / taskTime({2})", p, timeMargin, taskTimeAverage)
                #endif

                if p > 1.0 then
                    //viz.StepUpFps()
                    //recomputeFormTimer ()
                    1.0
                elif p > 0.0 then
                    p
                else
                    //viz.StepDownFps()
                    //recomputeFormTimer ()
                    let halfP = m_portionMultiplier / 2.0
                    if halfP > InitialSettings.MinMarginFraction
                    then halfP
                    else InitialSettings.MinMarginFraction

            // Now to set the new portion allowance in all tasks.
            doApportioning ()
        else
            m_reproportioningCountdown <- m_reproportioningCountdown - 1
        ()

    member this.UserInterface = userInterface
    member this.Visualizer = visualizer
