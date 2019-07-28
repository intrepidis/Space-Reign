namespace CMN.Reign.GameLogic

open OpenTK
open CMN.Reign.Tools

type Solar =
    {   // Some solar system names are randomly generated. If "name" is None then it will be randomly generated when ever it is required. The seed comes from the "coord" value.
        name : string option
        // This is absolute and NOT relative to a sector. (i.e. its relative to the zero point of space.)
        coord : Vector3
        // This tells us if the solar system is occupied.
        inhabited : bool
        // Here is information about trade items.
        tradeItems : TradeItem array
    }
    
    // This creates a solar system within the specified area.
    static member CreateSolar(area:Vector3, rand:RandomNumber) = 
        let makeTradeItem () =
            {   ImportPrice = rand.RandNextInt()
                ExportPrice = rand.RandNextInt()
                Quantity = rand.RandNextInt()
            }

        {   name = None
            coord = area
            inhabited = rand.RandNextBool()
            tradeItems = [| for i in 1..TradeGoods.TradeItemNames.Length -> makeTradeItem () |]
        }

    static member CreateSolarWithin(topLeft:Vector3, bottomRight:Vector3, rand:RandomNumber) =
        Solar.CreateSolar <| (rand.Random(bottomRight - topLeft) + topLeft, rand)

// Here's an example:
type SolarExample() =
    static member Result() =
        let rand = new RandomNumber()
        let s = Solar.CreateSolar <| (new Vector3(100.0f, 80.0f, 20.0f), rand)
        //s.tradeItems.GetItem("GemStones").ExportPrice <- 10
        //s.tradeItems.GetItem(0).ExportPrice <- 10
        s.tradeItems.[0] <- {s.tradeItems.[0] with ExportPrice = 10}
