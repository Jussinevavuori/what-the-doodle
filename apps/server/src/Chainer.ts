import { randomInt } from "crypto";

function rotateLeft<T>(array: T[]): T[] {
  if (array.length === 0) return array;
  const firstElement = array[0]!;
  const rest = array.slice(1);
  return [...rest, firstElement];
}

function rotateLeftBy<T>(array: T[], count: number): T[] {
  let result = array;
  for (let i = 0; i < count; i++) {
    result = rotateLeft(result);
  }
  return result;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

/**
 * Utility class for creating player chains for handing off drawings.
 *
 * Uses the dataformat `mappings = number[][]` where:
 *
 * ```
 * mappings[roundIndex][threadIndex] = playerIndex
 * ```
 */
export class Chainer {
  private static getDefaultMapping(players: number): number[] {
    return new Array(players).fill(0).map((_, i) => i);
  }

  /**
   * Algorithm:
   * - Rotate left by 1 until player would self-assign
   * - Then keep rotatling left by random amounts
   */
  static build(rounds: number, players: number) {
    // Initialize with first round mapping which is just sequential
    const mappings = [this.getDefaultMapping(players)];

    // Keep track of previous rotation amount to prevent "ping-ponging"
    let prevRotation = 0;

    // Get rotation amount
    function getRotation(round: number) {
      if (round <= players) return 1;

      // Would "ping-pong" if previousRotation + nextRotation === players
      const disallowedRotation = players - prevRotation;

      // Generate random number until not disallowed
      let rotation = disallowedRotation;
      while (rotation === disallowedRotation) {
        rotation = randomInt(1, players);
      }
      return rotation;
    }

    // Rotate each round by specified amount
    for (let round = 1; round < rounds; round++) {
      const previousMapping = mappings[round - 1]!;
      const rotation = getRotation(round);
      prevRotation = rotation;
      mappings.push(rotateLeftBy(previousMapping, rotation));
    }

    return mappings;
  }

  /**
   * Utility for loggin mappings
   */
  static logMappings(mappings: number[][]) {
    for (let round = 0; round < mappings.length; round++) {
      console.log(mappings[round]!.map((x) => x.toString().padStart(2, " ")).join(" "));
    }
  }
}
