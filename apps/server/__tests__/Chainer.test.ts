import { MIN_PLAYERS } from "@wtd/shared/consts";
import { describe, expect, it } from "bun:test";
import { Chainer } from "../src/Chainer";

describe("Chainer.build", () => {
  it("should output correct dimensional array each time", () => {
    for (let rounds = 1; rounds < 20; rounds++) {
      for (let players = MIN_PLAYERS; players < 20; players++) {
        const mappings = Chainer.build(rounds, players);
        expect(mappings).toHaveLength(rounds);
        mappings.forEach((roundMapping) => {
          expect(roundMapping).toHaveLength(players);
        });
      }
    }
  });

  it("should always have assigned all players in each round", () => {
    for (let rounds = 1; rounds < 10; rounds++) {
      for (let players = MIN_PLAYERS; players < 10; players++) {
        const mappings = Chainer.build(rounds, players);
        mappings.forEach((roundMapping) => {
          const assignedPlayers = new Set<number>();
          roundMapping.forEach((playerIndex) => {
            assignedPlayers.add(playerIndex);
          });

          expect(assignedPlayers.size).toBe(players);
          for (let player = 0; player < players; player++) {
            expect(assignedPlayers.has(player)).toBe(true);
          }
        });
      }
    }
  });

  it("should not self-assign players", () => {
    for (let rounds = 3; rounds < 10; rounds++) {
      for (let players = MIN_PLAYERS; players < 10; players++) {
        const mappings = Chainer.build(rounds, players);
        for (let round = 1; round < rounds; round++) {
          for (let thread = 0; thread < players; thread++) {
            const nextPlayer = mappings[round]![thread];
            const prevPlayer = mappings[round - 1]![thread];
            expect(nextPlayer).not.toBe(prevPlayer);
          }
        }
      }
    }
  });

  it("should not assign to previous", () => {
    for (let rounds = 3; rounds < 10; rounds++) {
      for (let players = MIN_PLAYERS; players < 10; players++) {
        const mappings = Chainer.build(rounds, players);
        for (let round = 2; round < rounds; round++) {
          for (let thread = 0; thread < players; thread++) {
            const nextPlayer = mappings[round]![thread];
            const prevPrevPlayer = mappings[round - 2]![thread];
            expect(nextPlayer).not.toBe(prevPrevPlayer);
          }
        }
      }
    }
  });

  it("should discourage short cycles", () => {
    // Calculate occurrences and total allowed occurrences
    let occurrences = 0;
    let allowedOccurrences = 0;

    // Run 5 times to account for randomness
    for (let attempt = 0; attempt < 5; attempt++) {
      for (let rounds = 3; rounds < 10; rounds++) {
        for (let players = MIN_PLAYERS; players < 10; players++) {
          const mappings = Chainer.build(rounds, players);

          // Occurrences should on average be rarer than 10% of all assignments
          allowedOccurrences += 0.1 * (rounds * players);

          for (let thread = 0; thread < players; thread++) {
            for (let player = 0; player < players; player++) {
              const threshold = Math.min(players - 1, 4);

              let lastApparance = -Infinity;

              for (let round = 0; round < rounds; round++) {
                if (mappings[round]![thread] === player) {
                  const gap = round - lastApparance;
                  lastApparance = round;
                  if (gap < threshold) {
                    occurrences++;
                  }
                }
              }
            }
          }
        }
      }

      expect(occurrences).toBeLessThanOrEqual(allowedOccurrences);
    }
  });

  it("should be non-deterministic", () => {
    function stableStringify(arr: number[][]) {
      return arr.map((subArr) => subArr.join(",")).join("|");
    }

    let nonDeterministic = false;

    let result = stableStringify(Chainer.build(7, 4));

    for (let i = 0; i < 100; i++) {
      const compare = stableStringify(Chainer.build(7, 4));
      if (compare !== result) {
        nonDeterministic = true;
        break;
      }
    }

    expect(nonDeterministic).toBe(true);
  });
});
