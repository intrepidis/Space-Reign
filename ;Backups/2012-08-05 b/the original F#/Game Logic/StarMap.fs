namespace CMN.Reign.GameLogic

open System
open System.Diagnostics

open OpenTK
open CMN.Reign.Tools

#if MYTRACE
let private wantTrace = false
let timer = new Stopwatch()
#endif

// Space is made up of sectors of solar systems.
type SectorType = { solars:Solar list }
type SpaceType = SectorType[,]

type StarMap() =
    let rand = new RandomNumber()
    let m_SectorSize =
        let size = InitialSettings.SectorSize
        let depth = InitialSettings.SectorDepth
        new Vector3(size, size, depth)
    let m_SectorHalfSize = m_SectorSize / 2.0f
    let m_SectorCount = Vector2i(InitialSettings.SectorCountHorizontal, InitialSettings.SectorCountVertical)
    let m_Size = Spatial.Mul(m_SectorSize, m_SectorCount)
    let m_HalfSize = m_Size / 2.0f
    let m_Space:SpaceType =
        let buildType = 2
        match buildType with
        | 1 ->
            #if MYTRACE
            if wantTrace then
                timer.Restart()
                Debug.WriteLine(": StarMap\t\tSTART universe")
            #endif
        
            // Propagate the star map with solar systems.
            let universe = [ for i in 1..InitialSettings.NumberOfSolarSystems -> Solar.CreateSolar <| (rand.Random(m_Size), rand) ]

            #if MYTRACE
            if wantTrace then
                timer.Stop()
                Debug.WriteLine(": StarMap\t\tEND universe {0}", timer.ElapsedMilliseconds)
            #endif

            // A function to pull all the stars out of a sector of the universe.
            let getSolarsWithin (offX:int) (offY:int) =
                let topLeft = new Vector2(m_SectorSize.X * float32 offX, m_SectorSize.Y * float32 offY)
                //let bottomRight = sectorSize + topLeft |> fun s -> {FlatPoint.x = s.x; y = s.y}
                let bottomRight = new Vector2(m_SectorSize.X + topLeft.X, m_SectorSize.Y + topLeft.Y)
                let isWithin = fun c ->
                    Spatial.CoordIsWithin(topLeft, bottomRight, c)
                {   solars =
                        universe
                        |> List.choose (fun s -> if isWithin s.coord then Some(s) else None)
                        |> List.sortWith (fun s1 s2 -> Spatial.Compare(s1.coord,s2.coord))
                }

            #if MYTRACE
            if wantTrace then
                timer.Restart()
                Debug.WriteLine(": StarMap\t\tSTART sector split")
            #endif

            // Create the star map of sectors.
            let v = Array2D.init m_SectorCount.X m_SectorCount.Y getSolarsWithin

            #if MYTRACE
            if wantTrace then
                timer.Stop()
                Debug.WriteLine(": StarMap\t\tEND sector split {0}", timer.ElapsedMilliseconds)
            #endif

            v

        | 2 ->
            #if MYTRACE
            if wantTrace then
                timer.Restart()
                Debug.WriteLine(": StarMap\t\tSTART populate sectors")
            #endif
        
            let numberOfSectors = m_SectorCount.X * m_SectorCount.Y
            let averageStarsPerSector = InitialSettings.NumberOfSolarSystems / numberOfSectors
            let margin = averageStarsPerSector / 10 |> (fun n -> if n = 0 then 1 else n)
            let minStarsPerSector = averageStarsPerSector - margin |> (fun n -> if n < 0 then 0 else n)
            let maxStarsPerSector = averageStarsPerSector + margin
            let rangeStarsPerSector = maxStarsPerSector - minStarsPerSector + 1
        
            // Create stars in a sector of the universe.
            let createSectorSolars (offX:int) (offY:int) =
                let topLeft = new Vector3(m_SectorSize.X * float32 offX, m_SectorSize.Y * float32 offY, z = 0.0f)
                let bottomRight = new Vector3(topLeft.X + m_SectorSize.X, topLeft.Y + m_SectorSize.Y, m_Size.Z)
                let numSolars = minStarsPerSector + rand.RandRangedInt(rangeStarsPerSector)
                {   solars =
                        [ for i in 1..numSolars -> Solar.CreateSolarWithin(topLeft, bottomRight, rand) ]
                        |> List.sortWith (fun s1 s2 -> Spatial.Compare(s1.coord, s2.coord))
                }

            // Create the star map of sectors.
            let v = Array2D.init m_SectorCount.X m_SectorCount.Y createSectorSolars

            #if MYTRACE
            if wantTrace then
                timer.Stop()
                Debug.WriteLine(": StarMap\t\tEND populate sectors {0}", timer.ElapsedMilliseconds)

                let numStars =
                    let mutable count = 0
                    let xEnd = -1 + Array2D.length1 v
                    let yEnd = -1 + Array2D.length2 v
                    for x in 0..xEnd do
                        for y in 0..yEnd do
                            count <- count + List.length v.[x,y].solars
                    count

                Debug.WriteLine(": Number of stars: {0}", numStars)
            #endif

            v

        | _ ->
            failwith "Unknown star map build type"
    
    /// Sectors define space as a checker board.
    /// The size of a sector as a vector.
    member this.SectorSize = m_SectorSize

    /// Half the size of a sector as a vector.
    member this.SectorHalfSize = m_SectorHalfSize

    /// How many sectors the star map is divided into, horizontally and vertically.
    /// This is also bottom-right back-most point of space.
    member this.SectorCount = m_SectorCount

    /// The top-left front-most point of space is zero.
    member this.Zero = Vector3.Zero

    /// This is also bottom-right back-most point of space.
    member this.Size = m_Size
    
    /// Half the size of the star map.
    member this.HalfSize = m_HalfSize

    /// The star map.
    member this.Space:SpaceType = m_Space
