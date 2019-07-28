namespace CMN.Reign.Application

open System
//open System.Windows.Forms
//open System.Drawing

open OpenTK
open OpenTK.Graphics
open OpenTK.Graphics.OpenGL
//open OpenTK.Audio
//open OpenTK.Audio.OpenAL
open OpenTK.Input

open CMN.Reign.Tools
open CMN.Reign.GraphicEngine
open CMN.Reign.GameLogic

type MainForm() as this =
    /// Creates a 800x600 window with the specified title.
    inherit GameWindow(800, 600, GraphicsMode.Default, "Space Reign")

    let governor = new Governor()
    
    do
        // Initialise the one and only Governor.
        governor.Initialize()

        this.VSync <- VSyncMode.On
        //this.Controls.Add(pane)
        //this.Controls.Add(TemporaryControls.panelViewControls (gov.RecomputeGameTimings))

    /// Load resources here.
    override this.OnLoad(e:EventArgs) =
        base.OnLoad(e)

        GL.ClearColor(0.0f, 0.0f, 0.0f, 0.0f)
        GL.Enable(EnableCap.DepthTest)

    override this.Dispose(disposing) =
        base.Dispose(disposing)

    /// Called when it is time to setup the next frame. Add your game logic here.
    /// FrameEventArgs "e" contains timing information for framerate independent logic.
    override this.OnUpdateFrame(e:FrameEventArgs) =
        base.OnUpdateFrame(e)

        let k = this.Keyboard
        let m = this.Mouse

        if k.[Key.Escape] then
            this.Exit()

        governor.UserInterface.UpdateMouse
            {   left = m.[MouseButton.Left];
                right = m.[MouseButton.Right];
                pos = new Vector2i(m.X, m.Y) }
        

        governor.IterateTasks()

//    member this.OnMouseButtonDown(e:MouseButtonEventArgs) =
//        m_mouseLeftDownOrigin <- e.Position
//        
//        UserInterface.mousePosition.now <- {x = float32 e.X; y = float32 e.Y}
//        match e.Button with
//        | MouseButton.Left     -> UserInterface.mouseLeftHeld.now <- true
//        | MouseButton.Right    -> UserInterface.mouseRightHeld.now <- true
//        | _ -> ()
//
//    member this.OnMouseButtonUp(e:MouseButtonEventArgs) =
//        m_mouseDragThresholdMet <- false
//
//        UserInterface.mousePosition.now <- {x = float32 e.X; y = float32 e.Y}
//        match e.Button with
//        | MouseButton.Left     -> UserInterface.mouseLeftHeld.now <- false
//        | MouseButton.Right    -> UserInterface.mouseRightHeld.now <- false
//        | _ -> ()
//
//    override this.OnMouseClick(e:MouseEventArgs) =
//        base.OnMouseClick(e)
//
//        if not m_mouseDragThresholdMet then
//            match e.Button with
//            | MouseButtons.Left     -> UserInterface.mouseClick <- Some(SingleClick(LeftButton))
//            | MouseButtons.Right    -> UserInterface.mouseClick <- Some(SingleClick(RightButton))
//            | _ -> ()
//        
//    override this.OnMouseDoubleClick(e:MouseEventArgs) =
//        base.OnMouseDoubleClick(e)
//
//        if not m_mouseDragThresholdMet then
//            match e.Button with
//            | MouseButtons.Left     -> UserInterface.mouseClick <- Some(DoubleClick(LeftButton))
//            | MouseButtons.Right    -> UserInterface.mouseClick <- Some(DoubleClick(RightButton))
//            | _ -> ()
//
//    override this.OnMouseMove(e:MouseEventArgs) =
//        base.OnMouseMove(e)
//        
//        if e.Button = MouseButtons.Left then
//            let dist = int <| distPoint m_mouseLeftDownOrigin e.Location
//            if dist > m_mouseDragThreshold then
//                m_mouseDragThresholdMet <- true
//
//        UserInterface.mousePosition.now <- {x = float32 e.X; y = float32 e.Y}

    /// Called when your window is resized. Set your viewport here. It is also
    /// a good place to set up your projection matrix (which probably changes
    /// along when the aspect ratio of your window).
    override this.OnResize(e:EventArgs) =
        base.OnResize(e)
        governor.Visualizer.ResizeDrawingArea(this.ClientRectangle)

    /// Called when it is time to render the next frame. Add your rendering code here.
    /// FrameEventArgs "e" contains timing information.
    override this.OnRenderFrame(e:FrameEventArgs) =
        base.OnRenderFrame(e)
        governor.Visualizer.RenderGraphics(e)
        this.SwapBuffers()
