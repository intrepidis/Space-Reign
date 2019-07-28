namespace CMN.Reign.Tools

open System
//open System.Diagnostics

type Bounds = {left:float32; right:float32; top:float32; bottom:float32}

//type TaskVariables() =
//    class
//    end

type GeneralUse() =
    //static member Epsilon = Single.Epsilon
    static member Epsilon = 0.01f // my epsilon

    static member Pi = float32 Math.PI
    
    // Return the 'i' constrained to the specified bounds.
    static member WithinBounds(i, min, max) =
        if i > max then max
        else if i < min then min
        else i

    static member SpanMilliseconds(startTime:DateTime, endTime:DateTime) =
        (endTime - startTime).TotalMilliseconds

    static member SpanMilliStr5(startTime:DateTime, endTime:DateTime) =
        (GeneralUse.SpanMilliseconds(startTime, endTime) |> int).ToString().PadLeft(5)

    static member ListRemove(l:'a list, index) =
        let rec funk outList headIndex inList =
            match inList with
            | h::t  ->  if headIndex = index then
                            funk outList (headIndex+1) t
                        else
                            funk (h::outList) (headIndex+1) t
            | []    ->  outList
        funk [] 0 l

    // ... or test these alternatives:

    //let removeAt index input = 
    //  input  
    //  // Associate each element with a boolean flag specifying whether  
    //  // we want to keep the element in the resulting list 
    //  |> List.mapi (fun i el -> (i <> index, el))  
    //  // Remove elements for which the flag is 'false' and drop the flags 
    //  |> List.filter fst |> List.map snd 
    //
    //let insertAt index newEl input = 
    //  // For each element, we generate a list of elements that should 
    //  // replace the original one - either singleton list or two elements 
    //  // for the specified index 
    //  input |> List.mapi (fun i el -> if i = index then [newEl; el] else [el]) 
    //        |> List.concat 
    //
    //let rec insert v i l = 
    //    match i, l with 
    //    | 0, xs -> v::xs 
    //    | i, x::xs -> x::insert v (i - 1) xs 
    //    | i, [] -> failwith "index out of range" 
    // 
    //let rec remove i l = 
    //    match i, l with 
    //    | 0, x::xs -> xs 
    //    | i, x::xs -> x::remove (i - 1) xs 
    //    | i, [] -> failwith "index out of range" 
