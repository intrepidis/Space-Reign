// A game inspired by the Amiga game: Supremacy. (and Megalomania, The Settlers, Elite...)
// Codename: Reign
// Proposed Title: Space Reign
// Nashers

open System
open CMN.Reign.Application

/// The main entry point for the application.
[<STAThread>]
do
    // The 'use' idiom guarantees proper resource cleanup.
    // We request 30 UpdateFrame events per second, and unlimited
    // RenderFrame events (as fast as the computer can handle).
    use game = new MainForm()
    game.Run(30.0)
    ()
