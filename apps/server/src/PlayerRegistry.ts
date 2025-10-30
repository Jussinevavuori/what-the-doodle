import type { Player } from "./Player";

/**
 * Registry to manage all Player instances
 */
export class PlayerRegistry {
  players: Map<string, Player>;

  constructor() {
    this.players = new Map();
  }

  getPlayer(id: string) {
    const player = this.players.get(id);
    if (!player) {
      throw new Error(`Player with ID ${id} not found in registry`);
    }
    return player;
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  removePlayer(id: string) {
    this.players.delete(id);
  }

  toArray(): Player[] {
    return Array.from(this.players.values());
  }

  size(): number {
    return this.players.size;
  }

  hasPlayer(id: string): boolean {
    return this.players.has(id);
  }
}
