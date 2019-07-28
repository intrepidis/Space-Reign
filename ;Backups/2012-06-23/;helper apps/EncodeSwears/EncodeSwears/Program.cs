using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EncodeSwears
{
    class Program
    {
        static void Main(string[] args)
        {
	        string swears = "shit,fuck,wank,cunt,cock,penis,pussy,vagina,prick,aids,arse,blowjob,bollock,dickhead,dumbass,queer,whore,slut,nigg,negr,suck,twat";
            string encoded = Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(swears));
        }
    }
}
