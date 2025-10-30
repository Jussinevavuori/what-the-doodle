import type { RoomDTO } from "@wtd/shared/schemas";
import { Game } from "./Game";
import { PlayerRegistry } from "./PlayerRegistry";
import { sendServerMessage } from "./sendServerMessage";

/**
 * Represents a game room with players
 */
export class Room {
  id: string;
  players: PlayerRegistry;
  game: Game;

  constructor(id: string) {
    this.id = id;
    this.players = new PlayerRegistry();
    this.game = new Game(() => this.sync());
  }

  /**
   * Sync room state with all connected clients
   */
  sync() {
    sendServerMessage(
      { roomId: this.id },
      {
        type: "ROOM_SYNC",
        room: this.getDTO(),
      },
    );
  }

  /**
   * Resets the game state for a new game
   */
  resetGame() {
    this.game = new Game(() => this.sync());
    this.sync();
  }

  /**
   * Converts the Room instance to a RoomDTO
   */
  getDTO(): RoomDTO {
    return {
      id: this.id,
      players: Array.from(this.players.players.values()).map((player) => player.getDTO()),
      game: this.game.getDTO(),
    };
  }
}
