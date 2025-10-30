import type { PlayerDTO } from "@wtd/shared/schemas";

/**
 * Represents a player in the game
 */
export class Player {
  /**
   * Unique identifier for the player
   */
  id: string;

  /**
   * Player's display name
   */
  name: string;

  /**
   * The player's avatar seed
   */
  avatar: string;

  constructor(id: string, player: Omit<PlayerDTO, "id">) {
    this.id = id;
    this.name = player.name;
    this.avatar = player.avatar;
  }

  /**
   * Converts the Player instance to a PlayerDTO
   */
  getDTO(): PlayerDTO {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
    };
  }
}
