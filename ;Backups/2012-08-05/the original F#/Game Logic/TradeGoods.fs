namespace CMN.Reign.GameLogic

// A holacre is a standard cube unit of measure for interstella shipments.
type TradeItem =
    {   ImportPrice : int   // How much the solar system will pay for a holacre of the goods.
        ExportPrice : int   // How much the solar system sells a holacre of the goods for.
        Quantity    : int   // How many of the goods the solar system currently has. (In holacres, as a rough estimate. Can be negative, meaning in heavy demand.)
    }

//=================================================================================================
// Remove the TradeItemNames and put Name and Description fields into the TradeItem type.
//=================================================================================================

type TradeGoods() =
    // Define the names of the trade items.
    static member TradeItemNames =
        [|  "Gem-stones"
            "Food"
            "Water"
            "Oil"
            "Flish"
        |]

    static member GetIndexByName(itemName) =
        TradeGoods.TradeItemNames |> Array.findIndex (fun n -> n = itemName)
