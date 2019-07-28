namespace CMN.Reign.Application

//open System.Drawing

open OpenTK
open OpenTK.Graphics.OpenGL
//open OpenTK.Graphics.Glu

open CMN.Reign.Tools
open CMN.Reign.GameLogic
open CMN.Reign.GraphicEngine

//type MouseButtonType = LeftButton | RightButton
//type MouseClickType =
//    | SingleClick of MouseButtonType
//    | DoubleClick of MouseButtonType
//
//type Temporal<'a> = {ye_old:'a; ye_new:'a}
//let mutable click = {ye_old=Some(SingleClick(LeftButton)); ye_new=None}

// "left" and "right" are the mouse buttons.
type mouseState = {left:bool; right:bool; pos:Vector2i}

type UserInterface(starMap:StarMap, visualizer:Visualizer) =
    let changeViewPos (v:Vector3) =
        let x = GeneralUse.WithinBounds(v.X, 0.0f, starMap.Size.X)
        let y = GeneralUse.WithinBounds(v.Y, 0.0f, starMap.Size.Y)
        let z = GeneralUse.WithinBounds(v.Z, InitialSettings.MinZoom, InitialSettings.MaxZoom)
        visualizer.ViewPosition <- new Vector3(x, y, z)

    // The current mouse state.
    let mutable m_mouseNow = {left=false; right=false; pos=Vector2i.Zero}

    // When either mouse button is pressed the mouse position is stored here.
    let mutable m_mouseDownPosition = Vector2i.Zero
    let mouseDragThreshold = 3
    let mutable m_mouseIsDragging = false

    member this.UpdateMouse ms =
        let mousePrev = m_mouseNow
        m_mouseNow <- ms
    
        let onLeftClick () =
            ()

        let onRightClick () =
            ()

        if not m_mouseNow.left && not m_mouseNow.right then
            m_mouseIsDragging <- false
        else // m_mouseNow.left || m_mouseNow.right
            if not mousePrev.left && not mousePrev.right then
                m_mouseDownPosition <- m_mouseNow.pos

            let mouseDragLength =
                lazy
                    Spatial.Sub(m_mouseDownPosition, m_mouseNow.pos)
                    |> Spatial.Magnitude
                    |> int

            if not m_mouseIsDragging then // see if there was a click or the start of a drag.
                [   (m_mouseNow.left,mousePrev.left,onLeftClick)
                    (m_mouseNow.right,mousePrev.right,onRightClick) ]
                |> List.iter
                    (fun (buttonNow,buttonPrev,clickFunc) ->
                        if buttonNow then
                            if mouseDragLength.Value > mouseDragThreshold then
                                // Started dragging the screen.
                                m_mouseIsDragging <- true
                        else
                            if buttonPrev then
                                // A click occurred.
                                clickFunc ()
                    )

        let mouseSectorPos = Spatial.ScreenPosToCoordsAtDepth2i(m_mouseNow.pos, starMap.SectorHalfSize.Z)
        let mouseThisDist = lazy Spatial.Sub(mousePrev.pos, m_mouseNow.pos)

        if m_mouseIsDragging then
            let (x,y) =
                if m_mouseNow.left then
                    let sectorDraggingPos = Spatial.ScreenPosToCoordsAtDepth2i(mousePrev.pos, starMap.SectorHalfSize.Z)
                    let createNewPos sectorPosNow sectorPosThen = sectorPosThen - sectorPosNow
                    let xDist = createNewPos mouseSectorPos.X sectorDraggingPos.X
                    let yDist = createNewPos mouseSectorPos.Y sectorDraggingPos.Y

                    (visualizer.ViewPosition.X+xDist, visualizer.ViewPosition.Y+yDist)
                else
                    (visualizer.ViewPosition.X, visualizer.ViewPosition.Y)

            let z =
                if m_mouseNow.right then
                    visualizer.ViewPosition.Z - (float32 mouseThisDist.Value.Y)*20.0f
                else
                    visualizer.ViewPosition.Z

            changeViewPos <| new Vector3(x, y, z)
