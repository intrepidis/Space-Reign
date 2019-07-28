namespace CMN.Reign.GameLogic

open CMN.Reign.Tools

type InitialSettings() =
    static let TimeMarginFraction = 0.2 // 20%

    // Set a margin that the Governor tries to keep processing time within desired frame rate.
    static member TimeMarginMultiplier = 1.0 - TimeMarginFraction
    static member MinMarginFraction = 0.01 // 1%

    // Used in Governor to determine when to update workload proportions.
    static member NumItersToWait = 5

    // Average number of stars in the universe.
    static member NumberOfSolarSystems = 40000

    static member InitialNumberOfShips = 600

    static member SectorSize = 500.0f
    static member SectorDepth = 1000.0f
    static member SectorCountHorizontal = 80
    static member SectorCountVertical = 48

    static member MaxZoom = -0.1f
    static member MinZoom = -20000.0f
    static member DefZoom = -500.0f

    static member Fov = GeneralUse.Pi * (1.0f - 1.0f/2.0f)
    static member ZNearest = 1.0f
    static member ZFurthest = 100000.0f

    static member FramesPerSecond = 30
