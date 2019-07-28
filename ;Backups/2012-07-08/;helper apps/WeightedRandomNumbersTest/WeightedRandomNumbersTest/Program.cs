using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WeightedRandomNumbersTest
{
	class Program
	{
		static int WeightedRandom(int low, int high, double[] weights, double weightsSum)
		{
			if (high <= low)
			{
				throw new ArgumentException("The high parameter should be greater than the low parameter.", "high");
			}
			if (weights.Length != high + 1 - low)
			{
				throw new ArgumentException("Not the correct number of weights for the range of numbers.", "weights");
			}
			double randNum = new Random().NextDouble() * weightsSum;
			for (int choiceIndex = 0; choiceIndex < weights.Length; choiceIndex++)
			{
				double thisOnesWeight = weights[choiceIndex];
				if (randNum < thisOnesWeight)
				{
					return choiceIndex + low;
				}
				randNum -= thisOnesWeight;
			}
			// The code should never get here in normal operation.
			throw new ArgumentException("Computational error, the weights sum was less than expected.", "weightsSum");
		}

		static void Main(string[] args)
		{
			string title = "Weighted Random Numbers";
			Console.WriteLine(title);
			Console.WriteLine(new string('~', title.Length));
			Console.WriteLine();

			var low = 2; var lowChance = 0.05;
			var mid = 8; var midChance = 0.5;
			var high = 16; var highChance = 0.2;

			var weights = new double[high - low + 1];
			var weightsSum = 0.0;

			double scale = lowChance;
			double adder = (midChance - lowChance) / (mid - low);
			for (int i = low; i < mid; i++)
			{
				weights[i - low] = scale;
				weightsSum += scale;
				scale += adder;
			}

			scale = midChance;
			adder = (highChance - midChance) / (high - mid);
			for (int i = mid; i <= high; i++)
			{
				weights[i - low] = scale;
				weightsSum += scale;
				scale += adder;
			}

			Console.WriteLine(
				"Using low bound " + low + " (chance " + Math.Floor(lowChance * 100) + "%)" +
				" and high bound " + high + " (chance " + Math.Floor(highChance * 100) + "%).");
			Console.WriteLine();
			Console.WriteLine("Beginning chance test...");

			var slots = new int[high + 1 - low];
			var iterations = 500000;
			for (int i = 1; i <= iterations; i++)
			{
				if (i % (iterations / 64) == 1)
				{
					ClearLine();
					Console.Write("Test iteration " + i);
				}

				var num = WeightedRandom(low, high, weights, weightsSum);

				slots[num - low]++;
			}

			ClearLine();
			for (int i = 0; i < slots.Length; i++)
			{
				Console.WriteLine("Choice " + (i + low) + " has " + (slots[i] * 100 / iterations) + "% hit-rate.");
			}

			Console.WriteLine();
			Console.WriteLine("Mission complete.");

#if DEBUG
			Console.ReadKey();
#endif
		}

		private static void ClearLine()
		{
			var length = Console.CursorLeft;
			Console.CursorLeft = 0;
			Console.Write(new string(' ', length));
			Console.CursorLeft = 0;
		}
	}
}
