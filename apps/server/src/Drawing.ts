import { createId } from "@paralleldrive/cuid2";
import type { DrawingDTO } from "@wtd/shared/schemas";

export class Drawing {
  /**
   * Drawing ID for identification.
   */
  id: string;

  /**
   * The prompt given to the drawer.
   */
  prompt: string;

  /**
   * The guess made by the guesser.
   */
  guess: string | null;

  /**
   * The ID of the player who is the guesser for this drawing.
   */
  guesserId: string;

  /**
   * The ID of the player who is the drawer for this drawing.
   */
  drawerId: string;

  /**
   * The index of the drawing thread this drawing belongs to.
   */
  threadIndex: number;

  /**
   * The JPEG representation of the drawing.
   */
  jpgBase64: string | null;

  constructor(threadIndex: number, drawerId: string, guesserId: string) {
    this.id = createId();
    this.threadIndex = threadIndex;
    this.prompt = "";
    this.guess = null;
    this.drawerId = drawerId;
    this.guesserId = guesserId;
    this.jpgBase64 = null;
  }

  /**
   * Converts the Drawing instance to a Data Transfer Object (DTO).
   */
  getDTO(): DrawingDTO {
    return {
      id: this.id,
      drawerId: this.drawerId,
      guesserId: this.guesserId,
      prompt: this.prompt,
      guess: this.guess,
      threadIndex: this.threadIndex,
    };
  }
}
