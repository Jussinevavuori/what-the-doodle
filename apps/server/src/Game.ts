import type { GameDTO } from "@wtd/shared/schemas";
import { Chainer } from "./Chainer";
import { Drawing } from "./Drawing";
import { DrawingPrompts, type PromptLanguage } from "./DrawingPrompts";
import type { Player } from "./Player";

export class Game {
  // Time allocated for each drawing phase in seconds
  drawingTimeSeconds: number;

  // Total number of rounds (each round includes a draw and a guess)
  totalRounds: number;

  // Current round
  currentRound: number;

  // Collection of all drawings in the game by round
  drawings: Drawing[][];

  // Initial prompts provided to players
  initialPrompts: Map<string, string[]>;

  // Number of initial prompts per player
  initialPromptsPerPlayer: number;

  // Language of game
  promptLanguage: PromptLanguage;

  // Current state
  state:
    | "lobby" // Waiting to start
    | "selecting-initial-prompts" // Players select initial prompts
    | "drawing" // Players draw based on prompts
    | "guessing" // Players guess what the drawing is
    | "finale"; // Game over, show all results

  // State change timestamp
  stateChangedAt?: number;

  // Call this function to sync
  private requestSync: () => void;

  constructor(requestSync: () => void) {
    // Controlled by game automatically
    this.state = "lobby";
    this.drawings = [];
    this.currentRound = -1;
    this.initialPrompts = new Map();

    // Controllable settings
    this.drawingTimeSeconds = 60;

    // Uncontrollable defaults
    this.totalRounds = 3;
    this.promptLanguage = "fi";
    this.initialPromptsPerPlayer = 3;

    // Server-side stuff
    this.requestSync = requestSync;
  }

  /**
   * Utility to change state with timestamp
   */
  private _setState(newState: Game["state"]) {
    this.state = newState;
    this.stateChangedAt = Date.now();
  }

  /**
   * Start game to move from idle to first phase
   */
  start(players: Player[]) {
    // Prompter for getting unique prompts
    const prompter = DrawingPrompts.getPrompter(this.promptLanguage);

    // Assign initial prompts for each player
    for (const player of players) {
      const prompts: string[] = [];
      for (let i = 0; i < this.initialPromptsPerPlayer; i++) {
        prompts.push(prompter.getNextPrompt());
      }
      this.initialPrompts.set(player.id, prompts);
    }

    // Double number of rounds to account for draw-guess loop
    const mappings = Chainer.build(this.totalRounds * 2, players.length);

    // Create all drawing objects
    for (let round = 0; round < this.totalRounds; round++) {
      const drawingsRound = [];

      // Populate drawings for this round based on mappings
      for (let threadIndex = 0; threadIndex < players.length; threadIndex++) {
        const drawerIndex = mappings[round * 2]![threadIndex]!;
        const guesserIndex = mappings[round * 2 + 1]![threadIndex]!;
        const drawing = new Drawing(
          threadIndex,
          players[drawerIndex]!.id,
          players[guesserIndex]!.id,
        );
        drawingsRound.push(drawing);
      }

      this.drawings.push(drawingsRound);
    }

    // Move to first phase
    this.state = "selecting-initial-prompts";
    this.stateChangedAt = Date.now();
  }

  /**
   * Start a drawing round
   */
  private _startDrawing() {
    this.currentRound += 1;
    this._setState("drawing");
    setTimeout(() => {
      this._setState("guessing");
      this.requestSync();
    }, this.drawingTimeSeconds * 1000);
  }

  /**
   * Player has selected initial prompt
   */
  onPlayerSelectedInitialPrompt(playerId: string, prompt: string) {
    if (this.state !== "selecting-initial-prompts") return;

    // Set to prompt of player's own first drawing
    const drawing = this.drawings[0]?.find((d) => d.drawerId === playerId);
    if (drawing) {
      drawing.prompt = prompt;
    }

    // Check if all players have selected prompts and move to first drawing phase
    const allSelected = this.drawings[0]!.every((d) => d.prompt);
    if (allSelected) this._startDrawing();
  }

  /**
   * Player has guessed a drawing
   */
  onPlayerGuessed(playerId: string, guess: string) {
    if (this.state !== "guessing") return;

    // Find the drawing for this player in the current round
    const drawing = this.drawings[this.currentRound]?.find((d) => d.guesserId === playerId);
    if (drawing) {
      drawing.guess = guess;

      // Set as prompt for next round's drawing if not last round
      const nextDrawing = this.drawings[this.currentRound + 1]?.find(
        (d) => d.threadIndex === drawing.threadIndex,
      );
      if (nextDrawing) {
        nextDrawing.prompt = guess;
      }
    }

    // Check if all players have guessed and move to next round or finale
    const allGuessed = this.drawings[this.currentRound]!.every((d) => d.guess);
    if (allGuessed) {
      // Move to next round or finale
      if (this.currentRound === this.totalRounds - 1) {
        this._setState("finale");
      } else {
        this._startDrawing();
      }
    }
  }

  /**
   * Player has submitted a drawing
   */
  onPlayerSubmittedDrawing(playerId: string, drawingId: string, jpgBase64: string) {
    const drawing = this.drawings.flat().find((d) => d.drawerId === playerId && d.id === drawingId);
    if (drawing) drawing.jpgBase64 = jpgBase64;
  }

  /**
   * Convert to DTO for client
   */
  getDTO(): GameDTO {
    return {
      drawingTimeSeconds: this.drawingTimeSeconds,
      totalRounds: this.totalRounds,
      currentRound: this.currentRound,
      state: this.state,
      stateChangedAt: this.stateChangedAt,
      drawings: this.drawings.map((round) => round.map((drawing) => drawing.getDTO())),
      initialPrompts: Object.fromEntries(this.initialPrompts.entries()),
      initialPromptsPerPlayer: this.initialPromptsPerPlayer,
      promptLanguage: this.promptLanguage,
    };
  }
}
