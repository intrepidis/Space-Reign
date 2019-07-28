using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MergeJavaScript
{
    using c = System.Console;

    public static class Console
    {
        public static int CursorLeft { get { return c.CursorLeft; } set { c.CursorLeft = value; } }

        public static void WriteUnderLined(string value, bool withOverline = false)
        {
            string line = new string('=', value.Length);
            if (withOverline)
                c.WriteLine(line);
            c.WriteLine(value);
            c.WriteLine(line);
        }

        public static void Write(string value)
        {
            c.Write(value);
        }

        public static void WriteLine()
        {
            c.WriteLine();
        }

        public static void WriteLine(string value)
        {
            c.WriteLine(value);
        }

        public static void ReadKey()
        {
            c.ReadKey();
        }
    }
}
