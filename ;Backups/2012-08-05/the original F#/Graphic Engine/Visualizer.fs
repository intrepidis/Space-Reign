namespace CMN.Reign.GraphicEngine

open System
open System.Collections.Generic
open System.ComponentModel
open System.Diagnostics
//open System.Drawing <- I want to keep this namespace CMN.Reign.out of scope, even though I am using some of it.
open System.Text
//open System.Windows.Forms <- Keep out of scope.

open OpenTK
open OpenTK.Graphics
open OpenTK.Graphics.OpenGL
//open OpenTK.Audio
//open OpenTK.Audio.OpenAL
//open OpenTK.Input

open CMN.Reign.Tools
open CMN.Reign.GameLogic

#if MYTRACE
let private wantTrace = false
let timer = new Stopwatch()
#endif

// This is a static class, as there should only ever be one of these in this game's application.V
type Visualizer(starMap:StarMap, vessels:Vessels) =
    let visualObjects = new VisualObjects(starMap)

    // Frame rate controls.
    let mutable m_fps = InitialSettings.FramesPerSecond
    let mutable m_millisecondsPerFrame = 1000.0
    let mutable m_wantFpsDisplay = true

    // Start in the centre of the map.
    let mutable m_viewPosition =
        let x = starMap.HalfSize.X + starMap.SectorHalfSize.X
        let y = starMap.HalfSize.Y + starMap.SectorHalfSize.Y
        let z = InitialSettings.DefZoom
        new Vector3(x, y, z)

    // Create a string buffer for the frames per second text.
    //static let sb_fps = new StringBuilder(256)
    
    let renderObjects (e:FrameEventArgs) =
        #if MYTRACE
        if wantTrace then
            timer.Restart()
            Debug.WriteLine("\trenderObjects\tSTART")
        #endif

//        // Draw the click position.
//        GL.Begin(BeginMode.Quads)
//        GL.Color3(Drawing.Color.White)
//        let p = UserInterface.sectorDraggingPos
//        GL.Vertex3(p.X-50.0f, p.Y-50.0f, p.Z)
//        GL.Vertex3(p.X+50.0f, p.Y-50.0f, p.Z)
//        GL.Vertex3(p.X+50.0f, p.Y+50.0f, p.Z)
//        GL.Vertex3(p.X-50.0f, p.Y+50.0f, p.Z)
//        GL.End()

        let vp = Spatial.Viewport

        // Draw the background.
//        for y in 0.0f..spriteSizeF..vp.Y do
//            for x in 0.0f..spriteSizeF..vp.X do
//                if voBgSpace.scale <> 1.0f then raise (Exception())
//                let s = voBgSpace.sprite
//                s.SetPosition(x, y)
//                s.Draw()
        
//        // Curry these functions with these current values.
//        let transCoords = translateCoordinates vp UserInterface.viewSize.x viewCorner
//        let transCoordsBack = translateCoordinatesBack vp UserInterface.viewSize.x viewCorner
//        let transPersp = translatePerspective starMap.starMapSize UserInterface.viewCentre
//        let scaleCoords_IP = scaleCoordinates_IP vp UserInterface.viewSize.x
        
//        let tkDraw (vo:VisualObject) (coord:DepthPoint) =
//            vo.draw <| transCoords coord

        // Get the range of sectors to draw.
        let drawPosition (viewCorner:Vector3) =
            let sx = int <| viewCorner.X / starMap.SectorSize.X
            let sy = int <| viewCorner.Y / starMap.SectorSize.Y
            new Vector2i(sx, sy)

        let drawStart =
            let scaled = drawPosition <| Spatial.ScreenPosToCoordsAtDepth2(Vector2.Zero, starMap.SectorSize.Z)
            // Make sure to not go out of bounds.
            let dx = if scaled.X < 0 then 0 else scaled.X
            let dy = if scaled.Y < 0 then 0 else scaled.Y
            new Vector2i(dx, dy)

        let drawEnd = 
            let scaled = drawPosition <| Spatial.ScreenPosToCoordsAtDepth2(vp, starMap.SectorSize.Z)
            // Make sure to not go out of bounds.
            let dx = if scaled.X >= starMap.SectorCount.X then (starMap.SectorCount.X - 1) else scaled.X
            let dy = if scaled.Y >= starMap.SectorCount.Y then (starMap.SectorCount.Y - 1) else scaled.Y
            new Vector2i(dx, dy)

        // This is a temporary way to draw the sector grid.
        // It should really be drawn as lines of rows and columns.
        // Also, this isn't good because the computations are done in the inner loop.
        let drawSectorGrid sx sy =
            let x = sx * starMap.SectorSize.X
            let y = sy * starMap.SectorSize.Y
            let z = starMap.HalfSize.Z
            let coord = new Vector3(x, y, z)
            visualObjects.SectorGrid.draw coord

        for sectorY in drawStart.Y..drawEnd.Y do
            let float32sectorY = float32 sectorY
            let mutable float32sectorX = float32 drawStart.X

            for sectorX in drawStart.X..drawEnd.X do
                drawSectorGrid float32sectorX float32sectorY

                // Draw all stars in this sector.
                starMap.Space.[int sectorX, int sectorY].solars
                |> List.iter
                    // A function to draw a star and it's stalk.
                    (fun sol ->
                        //let txt = sprintf "(%1.0f,%1.0f,%1.0f)" sol.x sol.y sol.z

                        // Draw star.
                        let vo = if sol.inhabited then visualObjects.InhabitedStar else visualObjects.UninhabitedStar
                        vo.draw sol.coord

                        // Draw stalk
                        visualObjects.Stalk.draw sol.coord

                        //Gorgon.CurrentRenderTarget.Line(origin.x, origin.y, 10.0f, 15.0f, Drawing.Color.Gray)
                        //Gorgon.CurrentRenderTarget.Line(origin.x, origin.y, vector.x-origin.x, vector.y-origin.y, Drawing.Color.Gray)
//                        voStalk.sprite.SetPosition(origin.x, origin.y)
//                        voStalk.sprite.Draw()

                        //g.DrawString(txt, font, brushYellow, vector.x, vector.y)
                        ()
                    )

                float32sectorX <- float32sectorX + 1.0f

        // Draw the space ships currently in the view area.
        vessels.AllShips
//        |> List.filter (fun ship -> coordIsWithin viewCorner (viewCorner + UserInterface.viewSize) ship.coord)
        |> List.iter
            // A function to draw a vessel.
            (fun ship ->
                visualObjects.Ship.draw ship.coord
            )

        //if this.m_colorBitmap <> null then
        //    g.DrawImage( m_colorBitmap, m_colorRegion )
      
        //ControlPaint.DrawBorder3D( g, m_outerRegion )
        //g.DrawRectangle(Pens.Black, new Rectangle(10,10,100,100))
    
        //match UserInterface.mouseClick with
        //| None -> ()
        //| Some(SingleClick(LeftButton))     -> ()//g.DrawString("l", font, brushYellow, 30.0f, 0.0f)
        //| Some(SingleClick(RightButton))    -> ()//g.DrawString("r", font, brushYellow, 30.0f, 0.0f)
        //| Some(DoubleClick(LeftButton))     -> ()//g.DrawString("ll", font, brushYellow, 30.0f, 0.0f)
        //| Some(DoubleClick(RightButton))    -> ()//g.DrawString("rr", font, brushYellow, 30.0f, 0.0f)

        m_millisecondsPerFrame <- e.Time / 1000.0
//        if m_wantFpsDisplay then
//            // Put FPS info.
//            spriteText.Text <- "FPS: " + e.TimingData.AverageFps.ToString()
//            spriteText.Draw()

        #if MYTRACE
        if wantTrace then
            timer.Stop()
            Debug.WriteLine("\tpaintGraphics\tEND {0}\tfps:{1}", timer.ElapsedMilliseconds, m_fps.ToString())
        #endif

    let renderInterface (e:FrameEventArgs) =
        
        visualObjects.Interface.draw (vessels.AllShips.[0].coord)
        ()

    let loadView () =
        let (eye:Vector3) = m_viewPosition

        let eyePos = new Vector3(eye.X, eye.Y, eye.Z)
        let eyeTarget = new Vector3(eye.X, eye.Y, 0.0f)
        let eyeUp = new Vector3(0.0f, -1.0f, 0.0f)
            
        let modelview = Matrix4.LookAt(eyePos, eyeTarget, eyeUp)
            
        GL.MatrixMode(MatrixMode.Modelview)
        GL.LoadMatrix(ref modelview)

    // Stopwatch to keep track of how much time is spent performing operations.
    let paintTimer = 
        let t = new Stopwatch()
        t.Start(); t
    
    member this.RenderGraphics(e:FrameEventArgs) =
        paintTimer.Start()
        
        GL.Clear(ClearBufferMask.ColorBufferBit ||| ClearBufferMask.DepthBufferBit)
        loadView ()
        renderObjects e
        renderInterface e

        paintTimer.Stop()

    member this.ResizeDrawingArea(cr:System.Drawing.Rectangle) =
        GL.Viewport(cr.X, cr.Y, cr.Width, cr.Height)
        let viewport = new Vector2(float32 cr.Width, float32 cr.Height)
        Spatial.Viewport <- viewport

        loadView ()

        Spatial.ProjectionMatrix <- Matrix4.CreatePerspectiveFieldOfView(InitialSettings.Fov, viewport.X / viewport.Y, InitialSettings.ZNearest, InitialSettings.ZFurthest)
        GL.MatrixMode(MatrixMode.Projection)
        GL.LoadMatrix(ref Spatial.ProjectionMatrix)

    member this.ViewPosition
        with get () = m_viewPosition
        and set value = m_viewPosition <- value

    member this.FramesPerSecond
        with get() = m_fps
        and set(value) =
            if value < 1 then       m_fps <- 1
            elif value > 60 then    m_fps <- 60
            else                    m_fps <- value

    member this.PaintTimer with get() = paintTimer
    member this.MillisecondsPerFrame with get () = m_millisecondsPerFrame
