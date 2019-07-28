using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace MergeJavaScript
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 3)
            {
                Console.WriteLine("Bad input, should be this: <input-list> <input-folder> <output-file>");
                return;
            }

            string inputList = args[0];
            string inputFolder = args[1];
            string outputFile = args[2];

            Console.WriteUnderLined("Merging JavaScript Files", true);
            Console.WriteLine();

            using (var outFile = File.OpenWrite(outputFile))
            {
                foreach (string fileName in File.ReadAllLines(inputList))
                {
                    if (fileName.StartsWith("/"))
                    {
                        continue;
                    }

                    Console.Write(fileName + "...");
                    string filePath = Path.Combine(inputFolder, fileName);
                    using (var inFile = File.OpenRead(filePath))
                    {
                        inFile.CopyTo(outFile);
                    }
                    Console.CursorLeft -= 3;
                    Console.WriteLine("   ");
                }
            }

            Console.WriteLine();
            Console.WriteUnderLined("Mission Complete", true);

#if DEBUG
            Console.ReadKey();
#endif
        }
    }
}
