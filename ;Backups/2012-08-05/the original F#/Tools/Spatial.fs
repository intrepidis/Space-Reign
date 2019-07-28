namespace CMN.Reign.Tools

open System

open OpenTK
open OpenTK.Graphics.OpenGL

//type Box2 = System.Drawing.RectangleF
//type Box2i = System.Drawing.Rectangle

/// A two dimensional int32 vector type.
type Vector2i(x:int, y:int) =
    member this.X = x
    member this.Y = y
        
    static member Zero = Vector2i(0, 0)

type Spatial() =
    // The viewport resolution.
    static let mutable viewport = Vector2.One
    static let mutable viewportHalf = Vector2.One
    //!!!!! STATIC MUTABLE SEEMS BAD (MULTITHREADING-WISE) !!!!!

    static let float32ArrayToMatrix4 (arr:float32 array) =
        new Matrix4(    arr.[0],arr.[1],arr.[2],arr.[3],
                        arr.[4],arr.[5],arr.[6],arr.[7],
                        arr.[8],arr.[9],arr.[10],arr.[11],
                        arr.[12],arr.[13],arr.[14],arr.[15])

    static let arrFloat32Length16 = Array.create 16 0.0f

    // The OpenGL projection matrix.
    static let mutable projectionMatrix = Matrix4.Identity
//    
//    (*Common mathematics*)
//    static let intAdd = fun (n1:int) n2 -> n1 + n2
//    static let intSub = fun (n1:int) n2 -> n1 - n2
//    static let intMul = fun (n1:int) n2 -> n1 * n2
//    static let intDiv = fun (n1:int) n2 -> n1 / n2
//    static let float32Add = fun (n1:float32) n2 -> n1 + n2
//    static let float32Sub = fun (n1:float32) n2 -> n1 - n2
//    static let float32Mul = fun (n1:float32) n2 -> n1 * n2
//    static let float32Div = fun (n1:float32) n2 -> n1 / n2
//    (*end*)
//
//    (*Vector mathematics*)
//    static let maths2i (a:Vector2i) (funky) (b:Veccy) =
//        let (x,y) =
//            match b with
//            | V2i(v) -> (v.X,v.Y)
//            | V2(v) -> (int v.X,int v.Y)
//            | V3(v) -> (int v.X,int v.Y)
//        Vector2i(funky a.X x, funky a.Y y)
//
//    static let maths2 (a:Vector2) (funky) (b:Veccy) =
//        let (x,y) =
//            match b with
//            | V2i(v) -> (float32 v.X,float32 v.Y)
//            | V2(v) -> (v.X,v.Y)
//            | V3(v) -> (v.X,v.Y)
//        Vector2(funky a.X x, funky a.Y y)
//
//    static let maths3 (a:Vector3) (funky) (b:Veccy) =
//        let (x,y,z) =
//            match b with
//            | V2i(v) -> (float32 v.X,float32 v.Y, 0.0f)
//            | V2(v) -> (v.X,v.Y,0.0f)
//            | V3(v) -> (v.X,v.Y,v.Z)
//        Vector3(funky a.X x, funky a.Y y, funky a.Z z)
//    (*end*)

 
    
    (*Vector magnitude*)
    /// Get the vector's magnitude (length).
    static member Magnitude(a:Vector2i) = a.X*a.X + a.Y*a.Y |> float32 |> sqrt

    /// Get the vector's magnitude (length).
    static member Magnitude(a:Vector2) = a.X*a.X + a.Y*a.Y |> sqrt

    /// Get the vector's magnitude (length).
    static member Magnitude(a:Vector3) = a.X*a.X + a.Y*a.Y + a.Z*a.Z |> sqrt
    (*end*)
        
    (*Vector converters*)
    /// Convert the Vector2 to a Vector2i (losing precision).
    static member Convert2i(a:Vector2) = Vector2i(int a.X, int a.Y)
        
    /// Convert the Vector3 to a Vector2i (losing precision and Z axis).
    static member Convert2i(a:Vector3) = Vector2i(int a.X, int a.Y)
    
    /// Convert the Vector2i to a Vector2.
    static member Convert2(a:Vector2i) = Vector2(float32 a.X, float32 a.Y)

    /// Convert the Vector3 to a Vector2 (losing the Z axis).
    static member Convert2(a:Vector3) = Vector2(a.X, a.Y)

    /// Convert the Vector2i to a Vector3.
    static member Convert3(a:Vector2i) = Vector3(float32 a.X, float32 a.Y, 0.0f)

    /// Convert the Vector2 to a Vector3.
    static member Convert3(a:Vector2) = Vector3(a.X, a.Y, 0.0f)
    (*end*)

    (*Vector addition*)
    static member Add(a:Vector2i,b:Vector2i) = Vector2i(a.X + b.X, a.Y + b.Y)
    static member Add(a:Vector2i,b:Vector2) = Vector2i(a.X + int b.X, a.Y + int b.Y)
    static member Add(a:Vector2i,b:Vector3) = Vector2i(a.X + int b.X, a.Y + int b.Y)
    static member Add(a:Vector2i,b:int) = Vector2i(a.X + b, a.Y + b)

    static member Add(a:Vector2,b:Vector2i) = Vector2(a.X + float32 b.X, a.Y + float32 b.Y)
    static member Add(a:Vector2,b:Vector2) = Vector2(a.X + b.X, a.Y + b.Y)
    static member Add(a:Vector2,b:Vector3) = Vector2(a.X + b.X, a.Y + b.Y)
    static member Add(a:Vector2,b:float32) = Vector2(a.X + b, a.Y + b)

    static member Add(a:Vector3,b:Vector2i) = Vector3(a.X + float32 b.X, a.Y + float32 b.Y, a.Z)
    static member Add(a:Vector3,b:Vector2) = Vector3(a.X + b.X, a.Y + b.Y, a.Z)
    static member Add(a:Vector3,b:Vector3) = Vector3(a.X + b.X, a.Y + b.Y, a.Z + b.Z)
    static member Add(a:Vector3,b:float32) = Vector3(a.X + b, a.Y + b, a.Z + b)
    (*end*)
    
    (*Vector multiplication*)
    static member Mul(a:Vector2i,b:Vector2i) = Vector2i(a.X * b.X, a.Y * b.Y)
    static member Mul(a:Vector2i,b:Vector2) = Vector2i(a.X * int b.X, a.Y * int b.Y)
    static member Mul(a:Vector2i,b:Vector3) = Vector2i(a.X * int b.X, a.Y * int b.Y)
    static member Mul(a:Vector2i,b:int) = Vector2i(a.X * b, a.Y * b)

    static member Mul(a:Vector2,b:Vector2i) = Vector2(a.X * float32 b.X, a.Y * float32 b.Y)
    static member Mul(a:Vector2,b:Vector2) = Vector2(a.X * b.X, a.Y * b.Y)
    static member Mul(a:Vector2,b:Vector3) = Vector2(a.X * b.X, a.Y * b.Y)
    static member Mul(a:Vector2,b:float32) = Vector2(a.X * b, a.Y * b)

    static member Mul(a:Vector3,b:Vector2i) = Vector3(a.X * float32 b.X, a.Y * float32 b.Y, a.Z)
    static member Mul(a:Vector3,b:Vector2) = Vector3(a.X * b.X, a.Y * b.Y, a.Z)
    static member Mul(a:Vector3,b:Vector3) = Vector3(a.X * b.X, a.Y * b.Y, a.Z * b.Z)
    static member Mul(a:Vector3,b:float32) = Vector3(a.X * b, a.Y * b, a.Z * b)
    (*end*)
    
    (*Vector subtraction*)
    static member Sub(a:Vector2i,b:Vector2i) = Vector2i(a.X - b.X, a.Y - b.Y)
    static member Sub(a:Vector2i,b:Vector2) = Vector2i(a.X - int b.X, a.Y - int b.Y)
    static member Sub(a:Vector2i,b:Vector3) = Vector2i(a.X - int b.X, a.Y - int b.Y)
    static member Sub(a:Vector2i,b:int) = Vector2i(a.X - b, a.Y - b)

    static member Sub(a:Vector2,b:Vector2i) = Vector2(a.X - float32 b.X, a.Y - float32 b.Y)
    static member Sub(a:Vector2,b:Vector2) = Vector2(a.X - b.X, a.Y - b.Y)
    static member Sub(a:Vector2,b:Vector3) = Vector2(a.X - b.X, a.Y - b.Y)
    static member Sub(a:Vector2,b:float32) = Vector2(a.X - b, a.Y - b)

    static member Sub(a:Vector3,b:Vector2i) = Vector3(a.X - float32 b.X, a.Y - float32 b.Y, a.Z)
    static member Sub(a:Vector3,b:Vector2) = Vector3(a.X - b.X, a.Y - b.Y, a.Z)
    static member Sub(a:Vector3,b:Vector3) = Vector3(a.X - b.X, a.Y - b.Y, a.Z - b.Z)
    static member Sub(a:Vector3,b:float32) = Vector3(a.X - b, a.Y - b, a.Z - b)
    (*end*)
    
    (*Vector division*)
    static member Div(a:Vector2i,b:Vector2i) = Vector2i(a.X / b.X, a.Y / b.Y)
    static member Div(a:Vector2i,b:Vector2) = Vector2i(a.X / int b.X, a.Y / int b.Y)
    static member Div(a:Vector2i,b:Vector3) = Vector2i(a.X / int b.X, a.Y / int b.Y)
    static member Div(a:Vector2i,b:int) = Vector2i(a.X / b, a.Y / b)

    static member Div(a:Vector2,b:Vector2i) = Vector2(a.X / float32 b.X, a.Y / float32 b.Y)
    static member Div(a:Vector2,b:Vector2) = Vector2(a.X / b.X, a.Y / b.Y)
    static member Div(a:Vector2,b:Vector3) = Vector2(a.X / b.X, a.Y / b.Y)
    static member Div(a:Vector2,b:float32) = Vector2(a.X / b, a.Y / b)

    static member Div(a:Vector3,b:Vector2i) = Vector3(a.X / float32 b.X, a.Y / float32 b.Y, a.Z)
    static member Div(a:Vector3,b:Vector2) = Vector3(a.X / b.X, a.Y / b.Y, a.Z)
    static member Div(a:Vector3,b:Vector3) = Vector3(a.X / b.X, a.Y / b.Y, a.Z / b.Z)
    static member Div(a:Vector3,b:float32) = Vector3(a.X / b, a.Y / b, a.Z / b)
    (*end*)
    
//    // This tupplization is done by default.
//    new (tup:float32*float32*float32) =
//        let (x,y,z) = tup
//        Vector3f(x,y,z)
        
    /// Compare vectors using predetermined precedence.
    static member Compare(a:Vector3, b:Vector3) =
        match a,b with
        | a,b when a.Z < b.Z -> -1
        | a,b when a.Z > b.Z -> 1
        | a,b when a.Y < b.Y -> -1
        | a,b when a.Y > b.Y -> 1
        | a,b when a.X < b.X -> -1
        | a,b when a.X > b.X -> 1
        | _,_ -> 0

    /// Returns true if the coord is within the topRight to bottomLeft bounds.
    static member CoordIsWithin(topLeft:Vector2, bottomRight:Vector2, coord:Vector3) =
        coord.X >= topLeft.X && coord.Y >= topLeft.Y
        && coord.X < bottomRight.X && coord.Y < bottomRight.Y

    /// The viewport resolution.
    static member Viewport
        with get () = viewport
        and set v =
            viewport <- v
            viewportHalf <- v / 2.0f

    /// Half of the viewport resolution.
    static member ViewportHalf
        with get () = viewportHalf

    //let mutable projectionMatrix = Matrix4.Identity
    /// The OpenGL projection matrix.
    static member ProjectionMatrix
        with get () = projectionMatrix
        and set value = projectionMatrix <- value
        
    /// Unproject viewport coordinates to world coordinates, at the specified depth.
    /// The window vector should have viewport coordinates mapped to be within the range -1 to 1.
    static member Unproject(winX:float32, winY:float32, winZ:float32, transformMatrix:Matrix4) =
        let win = new Vector4(winX, winY, winZ, 1.0f)
        let out = Vector4.Transform(win, transformMatrix)
        match out.W with
        | 0.0f  ->  None // An error occurred.
        | _     ->  Some(// All okay, so return the coordinates in a Vector3 option.
                            let x = out.X / out.W
                            let y = out.Y / out.W
                            let z = out.Z / out.W
                            new Vector3(x, y, z))

    /// Unproject to the furthest and nearest points for which the viewport coordinates could refer to.
    static member private ScreenPosToNearFarCoords(screenX:float32, screenY:float32) =
        // Get the model matrix.
        let modelViewMatrix =
            GL.GetFloat(GetPName.ModelviewMatrix, arrFloat32Length16)
            float32ArrayToMatrix4 arrFloat32Length16

        // Map the viewport coordinates to the range -1 to 1.
        // With the Y origin of flipped from top to bottom.
        let x = (screenX / Spatial.ViewportHalf.X) - 1.0f
        let y = ((Spatial.Viewport.Y - screenY) / Spatial.ViewportHalf.Y) - 1.0f

        // Unproject to the furthest and nearest.
        let m = Matrix4.Invert(Matrix4.Mult(modelViewMatrix, projectionMatrix))
        let far = Spatial.Unproject(x, y, 1.0f, m).Value
        let near = Spatial.Unproject(x, y, -1.0f, m).Value
        (far,near)

    static member private RationFarNearToDepth((far:Vector3,near:Vector3), depthZ) =
        // Calculate the ratio between those points that the specified depth is at.
        let factor =
            let farNearDist = far.Z - near.Z
            let seekDist = depthZ - near.Z
            seekDist / farNearDist

        // Calculate the world coordinates at the specified depth.
        let calcPos f n =
            let farNearDist = f - n
            let seekDist = farNearDist * factor
            seekDist + n

        let worldX = calcPos far.X near.X
        let worldY = calcPos far.Y near.Y

        // Return the coordinates as a Vector3.
        new Vector3(worldX, worldY, depthZ)

    /// Unproject viewport coordinates to world coordinates, at the specified depth.
    static member ScreenPosToCoordsAtDepth2i(screenPos:Vector2i, depthZ) =
        // Get the furthest and nearest points for which the viewport coordinates could refer to.
        let (far,near) = Spatial.ScreenPosToNearFarCoords(float32 screenPos.X, float32 screenPos.Y)
        Spatial.RationFarNearToDepth((far,near), depthZ)

    /// Unproject viewport coordinates to world coordinates, at the specified depth.
    static member ScreenPosToCoordsAtDepth2(screenPos:Vector2, depthZ) =
        // Get the furthest and nearest points for which the viewport coordinates could refer to.
        let (far,near) = Spatial.ScreenPosToNearFarCoords(screenPos.X, screenPos.Y)
        Spatial.RationFarNearToDepth((far,near), depthZ)

    /// Unproject viewport coordinates to world coordinates, at the specified depth.
    static member ScreenPosToCoordsAtDepthXY(screenPosX, screenPosY, depthZ) =
        // Get the furthest and nearest points for which the viewport coordinates could refer to.
        let (far,near) = Spatial.ScreenPosToNearFarCoords(screenPosX, screenPosY)
        Spatial.RationFarNearToDepth((far,near), depthZ)

(*
/// A regular 2D point.
type IntPoint =
    { x:int; y:int }
    static member Origin = {x = 0; y = 0}
    static member One = {x = 1; y = 1}
    // Operations with FlatPoint only.
    static member (+) (a, b) =
        {   x = a.x + b.x
            y = a.y + b.y
        }
    static member (-) (a, b) =
        {   x = a.x - b.x
            y = a.y - b.y
        }
    static member (*) (a, b) =
        {   x = a.x * b.x
            y = a.y * b.y
        }
    static member (/) (a, b) =
        {   x = a.x / b.x
            y = a.y / b.y
        }
    // Operations with primitive type.
    static member (+) (a, b) =
        {   x = a.x + b
            y = a.y + b
        }
    static member (-) (a, b) =
        {   x = a.x - b
            y = a.y - b
        }
    static member (*) (a, b) =
        {   x = a.x * b
            y = a.y * b
        }
    static member (/) (a, b) =
        {   x = a.x / b
            y = a.y / b
        }

/// A regular 2D point.
type FlatPoint =
    { x:float32; y:float32 }
    static member Origin = {x = 0.0f; y = 0.0f}
    static member One = {x = 1.0f; y = 1.0f}
    // Operations with FlatPoint only.
    static member (+) (a, b) =
        {   x = a.x + b.x
            y = a.y + b.y
        }
    static member (-) (a, b) =
        {   x = a.x - b.x
            y = a.y - b.y
        }
    static member (*) (a, b) =
        {   x = a.x * b.x
            y = a.y * b.y
        }
    static member (/) (a, b) =
        {   x = a.x / b.x
            y = a.y / b.y
        }
    // Operations with primitive type.
    static member (+) (a, b) =
        {   x = a.x + b
            y = a.y + b
        }
    static member (-) (a, b) =
        {   x = a.x - b
            y = a.y - b
        }
    static member (*) (a, b) =
        {   x = a.x * b
            y = a.y * b
        }
    static member (/) (a, b) =
        {   x = a.x / b
            y = a.y / b
        }
    // Operations with IntPoint.
    static member (+) (a, b:IntPoint) =
        {   x = a.x + float32 b.x
            y = a.y + float32 b.y
        }
    static member (-) (a, b:IntPoint) =
        {   x = a.x - float32 b.x
            y = a.y - float32 b.y
        }
    static member (*) (a, b:IntPoint) =
        {   x = a.x * float32 b.x
            y = a.y * float32 b.y
        }
    static member (/) (a, b:IntPoint) =
        {   x = a.x / float32 b.x
            y = a.y / float32 b.y
        }

/// A point in a 3D space that is always to be viewed from the "front".
type DepthPoint =
    { x:float32; y:float32; z:float32 }
    static member Origin = {x = 0.0f; y = 0.0f; z = 0.0f}
    static member One = {x = 1.0f; y = 1.0f; z = 1.0f}
    /// Compare against axis in this order: z, y then x.
    static member Compare p1 p2 =
        match p1,p2 with
        | p1,p2 when p1.z < p2.z -> -1
        | p1,p2 when p1.z > p2.z -> 1
        | p1,p2 when p1.y < p2.y -> -1
        | p1,p2 when p1.y > p2.y -> 1
        | p1,p2 when p1.x < p2.x -> -1
        | p1,p2 when p1.x > p2.x -> 1
        | _,_ -> 0
    // Operations with DepthPoint only.
    static member (+) (a, b) =
        {   x = a.x + b.x
            y = a.y + b.y
            z = a.z + b.z
        }
    static member (-) (a, b) =
        {   x = a.x - b.x
            y = a.y - b.y
            z = a.z - b.z
        }
    static member (*) (a, b) =
        {   x = a.x * b.x
            y = a.y * b.y
            z = a.z * b.z
        }
    static member (/) (a, b) =
        {   x = a.x / b.x
            y = a.y / b.y
            z = a.z / b.z
        }
    // Operations with primitive type.
    static member (*) (a, b) =
        {   x = a.x * b
            y = a.y * b
            z = a.z * b
        }
    static member (/) (a, b) =
        {   x = a.x / b
            y = a.y / b
            z = a.z / b
        }
    // Operations with FlatPoint.
    static member (+) (a, b:FlatPoint) =
        {   x = a.x + b.x
            y = a.y + b.y
            z = a.z
        }
    static member (-) (a, b:FlatPoint) =
        {   x = a.x - b.x
            y = a.y - b.y
            z = a.z
        }
    static member (*) (a, b:FlatPoint) =
        {   x = a.x * b.x
            y = a.y * b.y
            z = a.z
        }
    static member (/) (a, b:FlatPoint) =
        {   x = a.x / b.x
            y = a.y / b.y
            z = a.z
        }
    // Operations with IntPoint.
    static member (+) (a, b:IntPoint) =
        {   x = a.x + float32 b.x
            y = a.y + float32 b.y
            z = a.z
        }
    static member (-) (a, b:IntPoint) =
        {   x = a.x - float32 b.x
            y = a.y - float32 b.y
            z = a.z
        }
    static member (*) (a, b:IntPoint) =
        {   x = a.x * float32 b.x
            y = a.y * float32 b.y
            z = a.z
        }
    static member (/) (a, b:IntPoint) =
        {   x = a.x / float32 b.x
            y = a.y / float32 b.y
            z = a.z
        }

// Get a random point within an area.
let randomDepthPoint area =
    {   DepthPoint.x = randRangedFloat32 area.x
        DepthPoint.y = randRangedFloat32 area.y
        DepthPoint.z = randRangedFloat32 area.z }

/// Determine the distance from the origin to a Point.
let distFromOriginPoint (p:Point) =
    let x = float32 <| Math.Abs(p.X)
    let y = float32 <| Math.Abs(p.Y)
    sqrt (x**2.0f + y**2.0f)
            
/// Determine the distance between two System.Drawing.Point objects.
let distPoint (p1:Point) (p2:Point) =
    let x = float32 <| Math.Abs(p1.X - p2.X)
    let y = float32 <| Math.Abs(p1.Y - p2.Y)
    sqrt (x**2.0f + y**2.0f)
    
/// Determine the distance from the origin to an IntPoint.
let distFromOriginIntPoint (p:IntPoint) =
    let x = float32 <| Math.Abs(p.x)
    let y = float32 <| Math.Abs(p.y)
    sqrt (x**2.0f + y**2.0f)
    
/// Determine the distance between two IntPoint objects.
let distIntPoint (p1:IntPoint) (p2:IntPoint) =
    distFromOriginIntPoint (p1 - p2)
    
/// Determine the distance from the origin to a FlatPoint.
let distFromOriginFlatPoint (p:FlatPoint) =
    let x = float32 <| Math.Abs(p.x)
    let y = float32 <| Math.Abs(p.y)
    sqrt (x**2.0f + y**2.0f)
    
/// Determine the distance between two FlatPoint objects.
let distFlatPoint (p1:FlatPoint) (p2:FlatPoint) =
    distFromOriginFlatPoint (p1 - p2)

/// Determine the distance from the origin to a DepthPoint.
let distFromOriginDepthPoint (p:DepthPoint) =
    let x = float32 <| Math.Abs(p.x)
    let y = float32 <| Math.Abs(p.y)
    let z = float32 <| Math.Abs(p.z)
    sqrt (x**2.0f + y**2.0f + z**2.0f)

/// Determine the distance between two DepthPoint objects.
let distDepthPoint (p1:DepthPoint) (p2:DepthPoint) =
    distFromOriginDepthPoint (p1 - p2)

/// Returns true if the coord is within the topRight to bottomLeft bounds.
let coordIsWithin (topLeft:FlatPoint) (bottomRight:FlatPoint) (coord:DepthPoint) =
    coord.x >= topLeft.x && coord.y >= topLeft.y
    && coord.x < bottomRight.x && coord.y < bottomRight.y

/// Translate spacial coordinates to screen coordinates.
let translateCoordinates (canvasSize:FlatPoint) (viewWidth:float32) (viewCorner:FlatPoint) (graph:DepthPoint) =
    // Mutiply the coord relative to the canvas size.
    let multiplier = (canvasSize.x / viewWidth)
    // Get the coordinate relative to the corner of the view.
    let viewPos = graph - viewCorner
    viewPos * multiplier
    
/// Translate screen coordinates to spacial coordinates.
let translateCoordinatesBack (canvasSize:FlatPoint) (viewWidth:float32) (viewCorner:FlatPoint) (transgraph:DepthPoint) =
    let multiplier = (canvasSize.x / viewWidth)
    let viewPos = transgraph / multiplier
    viewPos + viewCorner
    
/// Scale spacial coordinates to screen coordinates.
let scaleCoordinates_FP (canvasSize:FlatPoint) (viewWidth:float32) (viewPos:FlatPoint) =
    // Mutiply the coord relative to the canvas size.
    let multiplier = (canvasSize.x / viewWidth)
    viewPos * multiplier
    
/// Scale spacial coordinates to screen coordinates.
let scaleCoordinates_IP (canvasSize:FlatPoint) (viewWidth:float32) (viewPos:IntPoint) : FlatPoint =
    // Mutiply the coord relative to the canvas size.
    let multiplier = (canvasSize.x / viewWidth)
    {x = (float32 viewPos.x) * multiplier; y = (float32 viewPos.y) * multiplier}

/// Scale screen coordinates to spacial coordinates.
let scaleCoordinatesBack (canvasSize:FlatPoint) (viewWidth:float32) (viewPos:FlatPoint) =
    // Mutiply the coord relative to the view size.
    let multiplier = (viewWidth / canvasSize.x)
    viewPos * multiplier

/// Add perspective to spacial coordinates.
let translatePerspective (starMapSize:DepthPoint) (viewCentre:FlatPoint) (graph:DepthPoint) =
    // Get the coordinate relative to the centre of the view.
    let viewPos = graph - viewCentre
    // Adjust perpective via this multiplier. (This number will always be between 0.875 and 1.125.)
    let perspAdjust = graph.z / (starMapSize.z * 2.0f) + (1.0f - 0.125f)
    let perspPos = viewPos * perspAdjust
    // Realign the coordinate relative to the star map.
    perspPos + viewCentre
*)
