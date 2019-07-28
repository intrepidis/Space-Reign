namespace CMN.Reign.GraphicEngine

open System

open OpenTK
open OpenTK.Graphics
open OpenTK.Graphics.OpenGL
//open OpenTK.Audio
//open OpenTK.Audio.OpenAL
//open OpenTK.Input

open CMN.Reign.Tools
open CMN.Reign.GameLogic

//let spriteSizeI = 64
//let spriteSizeF = float32 spriteSizeI
//let spriteScaler = spriteSizeF * 0.5f

type VisualObject = {draw:Vector3->unit}

type VisualObjects(starMap:StarMap) =
    //let font = new Font(FontFamily.GenericSansSerif, 10.0f)
    //let font =
    //    let f = new Font("Arial", "Arial", 10.0f, true, true)
    //    f.CharacterList <- f.CharacterList + "\u2191\u2193"; f
    
    // Get the ball image.
    //let ballImage = Image.FromFile("BallDemo.png")

    // Create ball sprite.
    //_ball = new Sprite("Ball", _ballImage, new Vector2D(64.0f, 0.0f), new Vector2D(64.0f, 64.0f), new Vector2D(32.0f, 32.0f));
    //_ball.Smoothing = Smoothing.Smooth;
    //_checkeredBall = new Vector2D(64.0f, 0.0f);
    //_bubbleBall = new Vector2D(0.0f, 64.0f);

    // Create frame stats window image.
    //let rendCounter =
    //    let ci = new RenderImage("StatsImage", 140, 50, ImageBufferFormats.BufferRGB888A8)
    //
    //    // Draw decoration.
    //    Gorgon.CurrentRenderTarget <- ci
    //    ci.BeginDrawing()
    //    ci.FilledRectangle(0.0f, 0.0f, float32 ci.Width, float32 ci.Height, Drawing.Color.FromArgb(128, 0, 0, 0))
    //    ci.Rectangle(0.0f, 0.0f, float32 ci.Width, float32 ci.Height, Drawing.Color.FromArgb(221, 215, 190))
    //    ci.EndDrawing()
    //    Gorgon.CurrentRenderTarget <- primaryRenderBuffer
    //    ci

    // Create window.
    //let spriteWindow = new Sprite("Window", rendCounter)

    // Text for window.
    //let spriteText = new TextSprite("WindowText", String.Empty, font, Vector2D.Zero, Drawing.Color.White)

    //let _text:TextSprite = null
    //let _checkeredBall:Vector2D = Vector2D.Zero // Checkered ball offset.
    //let _bubbleBall:Vector2D = Vector2D.Zero // Bubble ball offset.
    //let _counterImage:RenderImage = null // Frame counter image.

    let makeStarSprite sol_inhabited =
        // Set up.
        let size = starMap.SectorSize.X / 20.0f
        let halfSize = size * 0.5f
        let ((*name,*)colour) = if sol_inhabited
                                then ((*"StarInhabited",*)Drawing.Color.Yellow)
                                else ((*"StarUninhabited",*)Drawing.Color.Gray)
        {draw = fun p ->
            GL.Begin(BeginMode.Triangles)

            let (p_Xplus,p_Xminus) = (p.X+halfSize,p.X-halfSize)

            let (p_YplusB,p_YplusS,p_YminusB,p_YminusS) =
                let ofOffset = halfSize / GeneralUse.Pi
                let bigOffset = halfSize + ofOffset
                let smallOffset = halfSize - ofOffset
                (p.Y+bigOffset,p.Y+smallOffset,p.Y-bigOffset,p.Y-smallOffset)
            
            let p_Z = p.Z - GeneralUse.Epsilon

            GL.Color3(Drawing.Color.White)
            GL.Vertex3(p.X, p_YminusB, p_Z)
            GL.Color3(colour)
            GL.Vertex3(p_Xplus, p_YplusS, p_Z)
            GL.Vertex3(p_Xminus, p_YplusS, p_Z)

            GL.Color3(colour)
            GL.Vertex3(p.X, p_YplusB, p_Z)
            GL.Color3(Drawing.Color.White)
            GL.Vertex3(p_Xplus, p_YminusS, p_Z)
            GL.Vertex3(p_Xminus, p_YminusS, p_Z)

            GL.End()
        }

    member this.BgSpace =
        // Set up.
        let size = 64.0f
        //let name = "BackgroundSpace"
        let colour = Drawing.Color.Black
        // Make Bitmap to draw into, and attach a Graphics object.
        //let bm = new Drawing.Bitmap(size, size)
        //let g = Drawing.Graphics.FromImage(bm)
        // Draw the picture.
        //g.FillRectangle(colour, 0, 0, size, size)
        // Return a VisualObject.
        //let s = new Sprite(name, Image.FromBitmap(name, bm, ImageBufferFormats.BufferRGB888A8))
        //s.SetAxis(halfSize, halfSize)
        {draw = fun p ->
            GL.Begin(BeginMode.Polygon)

            GL.Color3(colour)
            GL.Vertex3(p.X, p.Y, p.Z)
            GL.Vertex3(p.X+size, p.Y, p.Z)
            GL.Vertex3(p.X+size, p.Y+size, p.Z)
            GL.Vertex3(p.X, p.Y+size, p.Z)

            GL.End()
        }

    //static member SectorGrid =
    //    // Set up.
    //    let marge = 2.0f
    //    //let name = "SectorGrid"
    //    let colour = Drawing.Color.Blue
    //    //let bgcolour = Drawing.Color.Black//Transparent
    //    // Make Bitmap to draw into, and attach a Graphics object.
    //    //let bm = new Drawing.Bitmap(size, size)
    //    //let g = Drawing.Graphics.FromImage(bm)
    //    // Draw the picture.
    //    //g.DrawRectangle(colour, 0, 0, size, size)
    //    //g.DrawRectangle(colour, 1, 1, size, size)
    //    //g.FillRectangle(bgcolour, 2, 2, size, size)
    //    // Return a Sprite object.
    //    //let s = new Sprite(name, Image.FromBitmap(name, bm, ImageBufferFormats.BufferRGB888A8))
    //    //s.SetAxis(halfSize, halfSize)
    //    {draw = fun p ->
    //        let outer = {left = p.X; right = p.X+starMap.sectorSize.X; top = p.Y; bottom = p.Y+starMap.sectorSize.Y}
    //        let inner = {left = p.X+marge; right = p_R-marge; top = p.Y+marge; bottom = p_B-marge}
    //
    //        let outTopLeft = new Vector3(p.X, p.Y, p.Z)
    //        let outTopRight = new Vector3(p_R, p.Y, p.Z)
    //        let outBottomRight = new Vector3(p_R, p_B, p.Z)
    //        let outBottomLeft = new Vector3(p.X, p_B, p.Z)
    //        
    //        let inTopLeft = new Vector3(inner.left, inner.top, p.Z)
    //        let inTopRight = new Vector3(inner.right, inner.top, p.Z)
    //        let inBottomRight = new Vector3(inner.right, inner.bottom, p.Z)
    //        let inBottomLeft = new Vector3(inner.left, inner.bottom, p.Z)
    //
    //        // Top of frame.
    //        GL.Begin(BeginMode.Polygon)
    //        GL.Color3(colour)
    //        GL.Vertex3(outTopLeft)
    //        GL.Vertex3(outTopRight)
    //        GL.Vertex3(inTopRight)
    //        GL.Vertex3(inTopLeft)
    //        GL.End()
    //
    //        // Right of frame.
    //        GL.Begin(BeginMode.Polygon)
    //        GL.Color3(colour)
    //        GL.Vertex3(outTopRight)
    //        GL.Vertex3(outBottomRight)
    //        GL.Vertex3(inBottomRight)
    //        GL.Vertex3(inTopRight)
    //        GL.End()
    //
    //        // Bottom of frame.
    //        GL.Begin(BeginMode.Polygon)
    //        GL.Color3(colour)
    //        GL.Vertex3(outBottomRight)
    //        GL.Vertex3(outBottomLeft)
    //        GL.Vertex3(inBottomLeft)
    //        GL.Vertex3(inBottomRight)
    //        GL.End()
    //
    //        // Left of frame.
    //        GL.Begin(BeginMode.Polygon)
    //        GL.Color3(colour)
    //        GL.Vertex3(outBottomLeft)
    //        GL.Vertex3(outTopLeft)
    //        GL.Vertex3(inTopLeft)
    //        GL.Vertex3(inBottomLeft)
    //        GL.End()
    //    }

    member this.SectorGrid =
        {draw = fun p ->
            let drawSectorFrame =
                let p_R = p.X+starMap.SectorSize.X // Half X of the sector.
                let p_B = p.Y+starMap.SectorSize.Y/2.0f // Half Y of the sector.

                let (r,g,b) = (0,0,200)
                let col1 = Drawing.Color.FromArgb(r,g,b)
                let col2 = Drawing.Color.FromArgb(0,0,0)

                GL.Begin(BeginMode.Lines)
            
                GL.Color3(col1);    GL.Vertex3(p.X, p.Y, p.Z)
                GL.Color3(col2);    GL.Vertex3(p_R, p.Y, p.Z)
            
                GL.Color3(col1);    GL.Vertex3(p.X, p.Y, p.Z)
                GL.Color3(col2);    GL.Vertex3(p.X, p_B, p.Z)
            
                GL.End()

            let drawStrut =
                // The margin m is the strut's width.
                let m = starMap.SectorSize.X / 32.0f
            
                GL.Begin(BeginMode.Triangles)

                let drawTop =
                    GL.Color3(Drawing.Color.Blue)
                    GL.Vertex3(p.X, p.Y, p.Z)
                    GL.Vertex3(p.X+m, p.Y, p.Z)
                    GL.Vertex3(p.X, p.Y+m, p.Z)

                let drawSides =
                    GL.Color3(Drawing.Color.FromArgb(0, 0, 120))
                
                    let depth = starMap.Size.Z

                    let drawSide1 =
                        GL.Vertex3(p.X, p.Y, p.Z)
                        GL.Vertex3(p.X, p.Y, depth)
                        GL.Vertex3(p.X+m, p.Y, p.Z)

                        GL.Vertex3(p.X+m, p.Y, p.Z)
                        GL.Vertex3(p.X, p.Y, depth)
                        GL.Vertex3(p.X+m, p.Y, depth)

                    let drawSide2 =
                        GL.Vertex3(p.X, p.Y, p.Z)
                        GL.Vertex3(p.X, p.Y, depth)
                        GL.Vertex3(p.X, p.Y+m, p.Z)

                        GL.Vertex3(p.X, p.Y+m, p.Z)
                        GL.Vertex3(p.X, p.Y, depth)
                        GL.Vertex3(p.X, p.Y+m, depth)

                    let drawBottom =
                        GL.Vertex3(p.X, p.Y, depth)
                        GL.Vertex3(p.X+m, p.Y, depth)
                        GL.Vertex3(p.X, p.Y+m, depth)
                    ()

                GL.End()
            ()
        }

    member this.InhabitedStar =
        makeStarSprite true

    member this.UninhabitedStar =
        makeStarSprite false

    member this.Stalk =
        {draw = fun p ->
            GL.Begin(BeginMode.Lines)
            GL.Color3(Drawing.Color.FromArgb(60,60,60))
            GL.Vertex3(p)
            let mid =
                let x = p.X
                let y = p.Y
                let z = starMap.HalfSize.Z
                new Vector3(x, y, z)
            GL.Vertex3(mid)
            GL.End()
        }

    member this.Ship =
        // Set up.
        let size = starMap.SectorSize.X / 24.0f
        //let sizeHalved = size / 2
        //let name = "Vessel"
        let colour = Drawing.Color.Green
        //let points = [| new Vector2i(sizeHalved, 0)
        //                new Vector2i(size, sizeHalved)
        //                new Vector2i(sizeHalved, size)
        //                new Vector2i(0, sizeHalved)    |]
        // Make Bitmap to draw into, and attach a Graphics object.
        //let bm = new Drawing.Bitmap(size, size)
        //let g = Drawing.Graphics.FromImage(bm)
        // Draw the picture.
        //g.FillPolygon(colour, points)
        // Return an Image object.
        //let s = new Sprite(name, Image.FromBitmap(name, bm, ImageBufferFormats.BufferRGB888A8))
        let halfSize = size * 0.5f
        //s.SetAxis(halfSize, halfSize)
        {draw = fun p ->
            GL.Begin(BeginMode.Polygon)

            GL.Color3(colour)
            GL.Vertex3(p.X, p.Y-halfSize, p.Z)
            GL.Vertex3(p.X+halfSize, p.Y, p.Z)
            GL.Vertex3(p.X, p.Y+halfSize, p.Z)
            GL.Vertex3(p.X-halfSize, p.Y, p.Z)

            GL.End()
        }

    member this.Interface =
        let size = starMap.SectorSize.X / 3.0f
        let colour = Drawing.Color.Moccasin
        {draw = fun p ->
            GL.Begin(BeginMode.Polygon)

            GL.Color3(colour)
            GL.Vertex3(p.X, p.Y, p.Z)
            GL.Vertex3(p.X+size, p.Y, p.Z)
            GL.Vertex3(p.X+size, p.Y+size, p.Z)
            GL.Vertex3(p.X, p.Y+size, p.Z)

            GL.End()
        }

    //let spriteFpsText =
    //    let name = "FPS Text"
    //    let font = new Font("Lucida Console", "Fixed", 10.0f)
    //    let colour = Drawing.Color.BlanchedAlmond
    //    let text = String.Empty
    //    let s = new TextSprite(name, text, font, colour)
    //    s.SetPosition(20.0f, 20.0f)
    //    s

    //let scaleSolars = 0.9f
    //let scaleSolarsAdditive = starMap.starMapSize.Z * (1.0f - scaleSolars)
