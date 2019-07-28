module TemporaryControls

//open System
//open System.Windows.Forms
//open System.Drawing
//
////open RenderPane
////open Visualizer
//
//let maxZoom = decimal InitialSettings.maxZoom
//let minZoom = decimal InitialSettings.minZoom
//let scaleZoom = 100m
//let initialZoom = decimal InitialSettings.defZoom
//
//let panelViewControls recomputeGameTimings =
//    let p = new FlowLayoutPanel()
//    p.FlowDirection <- FlowDirection.TopDown
//    p.WrapContents <- true
//    p.Dock <- DockStyle.Bottom
//    p.BorderStyle <- BorderStyle.Fixed3D
//
//    [(
//        // Frames per second combo box.
//        let c = new ComboBox()
//        c.DropDownStyle <- ComboBoxStyle.DropDown
//        c.Items.AddRange([|6;8;10;12;15;20;25;30;45;60|])
//        c.SelectedItem <- 30
//        c.TextChanged.AddHandler(new EventHandler
//            (fun (s:obj) e ->
//                let c = s :?> ComboBox
//                match Int32.TryParse(c.Text) with
//                | true, i -> recomputeGameTimings i
//                | false, _ -> ()
//            ))
//        ("Frames:", c :> Control)
//    );(
//        // View zoom numeric gadget.
//        let c = new NumericUpDown()
//        c.Minimum <- maxZoom
//        c.Maximum <- minZoom
//        c.Value <- initialZoom
//        c.ValueChanged.AddHandler(new EventHandler
//            (fun (s:obj) e ->
//                let numSpin = s :?> NumericUpDown
//                let scaledValue = numSpin.Value / scaleZoom
//                ()//UserInterface.viewZoom <- float32 scaledValue
//                //UserInterface.changeViewZoom ()
//            ))
//        ("View Zoom:", c :> Control)
//    )]
//    |> List.iter (fun (labelText,control) ->
//        p.Controls.Add(
//            let p = new FlowLayoutPanel()
//            p.FlowDirection <- FlowDirection.LeftToRight
//            p.WrapContents <- false
//            p.AutoSize <- true
//            p.BorderStyle <- BorderStyle.Fixed3D
//            p.Controls.Add((new Label() |> fun c -> c.Text <- labelText; (*c.Anchor <- AnchorStyles.None;*) c))
//            p.Controls.Add((control:Control) |> fun c -> (*c.Dock <- DockStyle.Fill;*) c)
//            p))
//    p
