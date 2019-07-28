namespace CMN.Reign.Tools

open System
//open System.Diagnostics
open OpenTK

type RandomNumber() =
    let r = new Random(10)
    
    // Get a random unranged.
    member this.RandNextInt() = r.Next()
    member this.RandNextBool() = r.Next(2) = 0

    // Get a random in range: 0 <= result < high.
    member this.RandRangedInt(high:int) = r.Next(high)
    member this.RandRangedFloat32 (high:float32) = float32 <| r.NextDouble() * (float high)

    /// Make a random point within an area.
    member this.Random(area:Vector2i) =
        let r = this.RandRangedInt
        new Vector2i(r area.X, r area.Y)

    /// Make a random point within an area.
    member this.Random(area:Vector2) =
        let r = this.RandRangedFloat32
        new Vector2(r area.X, r area.Y)

    /// Make a random point within an area.
    member this.Random(area:Vector3) =
        let r = this.RandRangedFloat32
        new Vector3(r area.X, r area.Y, r area.Z)
    