namespace CMN.Reign.GameLogic

open System
open System.Diagnostics
//open System.Drawing

open OpenTK
open CMN.Reign.Tools

#if MYTRACE
let private wantTrace = false
let timer = new Stopwatch()
#endif

/// A type of vessel.
type ShipClassType =
    {   name : string
        speed : float32
    }
    
/// Metrics of an actual vessel.
type Vessel =
    {   classIndex : int // The index in ShipClasses.
        mutable coord : Vector3
        mutable dest : Solar option
        mutable arrived : bool // True if the ship is at it's destination.
    }
    
    /// The types of vessel class available.
    static member ShipClasses =
        [|  {name = "Runt"; speed = 1.0f} // Standard ships move by warping space.
            {name = "Rump"; speed = 2.5f}
            //{name = "Void-folder"; speed = 0.0f} // This class of ship doesn't move but travels by folding space. (AKA. heighliner)
        |]

type Vessels(starMap:StarMap) =
    let rand = new RandomNumber()
    let mutable allShips =
        let makeShip () =
            let chooseSystem () =
                let sectorCenter = Spatial.Div(starMap.SectorCount,2)
                let solars = starMap.Space.[sectorCenter.X, sectorCenter.Y].solars
                if solars.Length = 0 then
                    // A fix for when a sector doesn't have any stars.
                    let v:Solar = {name = None; coord = Vector3.Zero; inhabited = false; tradeItems = [||]}
                    v
                else
                    solars.[rand.RandRangedInt(solars.Length)]
            // Now make the Vessel record.
            let r = rand.RandRangedFloat32
            {   classIndex = rand.RandRangedInt(Vessel.ShipClasses.Length)
                coord = Spatial.Div(starMap.Size,2.0f) + new Vector3(r starMap.SectorSize.X, r starMap.SectorSize.Y, 0.0f)
                dest = Some(chooseSystem ())
                arrived = false
            }
        List.init InitialSettings.InitialNumberOfShips (fun i -> makeShip ())

    // This is how far through the ship list "iterateTask" has traversed.
    let mutable taskStateIndex = 0

    // Here is the portion that "iterateTask" is allowed process in one calling.
    let mutable taskPortion = Int32.MaxValue
    
    /// Return how many jobs "iterateTask" needs to do. (The number of ships currently in transit.)
    member this.TaskCount with get () = allShips.Length

    // Here is the portion that "iterateTask" is allowed process in one calling.
    member this.TaskPortion
        with get () = taskPortion
        and set value = taskPortion <- value

    member this.AddShip(ship:Vessel) =
        allShips <- ship::allShips

    member this.RemoveShip(index:int) =
        // Firstly make sure the Task State Index will still point to the correct ship.
        if index < 0 || index >= allShips.Length then
            ()
        else if index < taskStateIndex then
            taskStateIndex <- taskStateIndex - 1
        else if index = allShips.Length - 1 then
            taskStateIndex <- 0
        
        // Now remove the ship from the list.
        allShips <- GeneralUse.ListRemove(allShips, index)

    /// Here all ships are stored.
    member this.AllShips with get () = allShips

    /// This manages the coordination of vessels.
    member this.IterateTask () =
        let dilation = (float32 allShips.Length / float32 taskPortion)

        #if MYTRACE
        if wantTrace then
            timer.Restart()
            Debug.WriteLine("\tVessels\t\tSTART\tdilation:{0}", dilation)
        #endif

        // A function to move a coordinate closer to a destination. Returns the tuple (newCoordinate : DepthPoint, isAtDestination : bool)
        let moveStep hereCoord thereCoord moveDistance =
            let distCoord:Vector3 = thereCoord - hereCoord
            let fullDistance = distCoord.Length
            if moveDistance > fullDistance then
                // The move distance will over-shoot the target, so just return the destination.
                (thereCoord, true)
            else
                let ratio = moveDistance / fullDistance
                (hereCoord + distCoord * ratio, false)

        // A function to move a ship closer to it's destination.
        let moveShip ship =
            if not ship.arrived then
                let coord, arrived = moveStep ship.coord ship.dest.Value.coord (Vessel.ShipClasses.[ship.classIndex].speed * dilation)
                ship.coord <- coord
                ship.arrived <- arrived

        // Move the allowed portion of ships *that are currently in transit*.
        let startIndex = taskStateIndex
        let endIndex, extraEndIndex =
            let count = allShips.Length
            let e = -1 + startIndex + if taskPortion > count then count else taskPortion
            if e < count then (e, -1)
            else (count - 1, e - count)


        // Here I should be splitting the list into left, middle and right segments
        // and then joining them back after, perhaps.

        // Do the right portion.
        for i in startIndex..endIndex do
            moveShip allShips.[i]

        if extraEndIndex >= 0 then // Do the left portion.
            for i in 0..extraEndIndex do
                moveShip allShips.[i]
            taskStateIndex <- extraEndIndex + 1
        else
            let s = endIndex + 1
            taskStateIndex <- if s = allShips.Length then 0 else s

        #if MYTRACE
        if wantTrace then
            timer.Stop()
            Debug.WriteLine("\tVessels\t\tEND {0}", timer.ElapsedMilliseconds)
        #endif
