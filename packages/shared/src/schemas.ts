import { z } from "zod";

// =================================================================================================
// DTO Schemas
// =================================================================================================

export const PlayerDTO = z.object({
  name: z.string(),
  id: z.string(),
  avatar: z.string(),
});

export type PlayerDTO = z.infer<typeof PlayerDTO>;

export const DrawingDTO = z.object({
  id: z.string(),
  drawerId: z.string(),
  guesserId: z.string(),
  prompt: z.string(),
  guess: z.string().nullable(),
  threadIndex: z.number(),
});

export type DrawingDTO = z.infer<typeof DrawingDTO>;

export const GameDTO = z.object({
  drawingTimeSeconds: z.number(),
  totalRounds: z.number(),
  currentRound: z.number(),
  state: z.enum(["lobby", "selecting-initial-prompts", "drawing", "guessing", "finale"]),
  stateChangedAt: z.number().optional(),
  drawings: DrawingDTO.array().array(),
  initialPrompts: z.record(z.string(), z.string().array()),
  initialPromptsPerPlayer: z.number(),
  promptLanguage: z.enum(["fi"]),
});

export type GameDTO = z.infer<typeof GameDTO>;

export const RoomDTO = z.object({
  id: z.string(),
  players: z.array(PlayerDTO),
  game: GameDTO,
});

export type RoomDTO = z.infer<typeof RoomDTO>;

// =================================================================================================
// MESSAGE SCHEMAS
// =================================================================================================

export const ServerMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ROOM_SYNC"),
    room: RoomDTO,
  }),
  z.object({
    type: z.literal("ASSIGN_USER_ID"),
    userId: z.string(),
  }),
  z.object({
    type: z.literal("DRAWING_DATA"),
    roomId: z.string(),
    drawingId: z.string(),
    jpgBase64: z.string().nullable(),
  }),
]);

export type ServerMessage = z.infer<typeof ServerMessageSchema>;

export const ClientMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("PLAYER_UPDATED"),
    player: PlayerDTO.omit({ id: true }),
  }),
  z.object({
    type: z.literal("JOIN_ROOM"),
    roomId: z.string(),
  }),
  z.object({
    type: z.literal("LEAVE_ROOM"),
  }),
  z.object({
    type: z.literal("NEW_GAME"),
    roomId: z.string(),
  }),
  z.object({
    type: z.literal("UPDATE_GAME_SETTINGS"),
    roomId: z.string(),
    drawingTimeSeconds: z.number().optional(),
  }),
  z.object({
    type: z.literal("START_GAME"),
    roomId: z.string(),
  }),
  z.object({
    type: z.literal("SELECT_INITIAL_PROMPT"),
    roomId: z.string(),
    prompt: z.string(),
  }),
  z.object({
    type: z.literal("GUESS"),
    roomId: z.string(),
    guess: z.string(),
  }),
  z.object({
    type: z.literal("SUBMIT_DRAWING"),
    roomId: z.string(),
    drawingId: z.string(),
    jpgBase64: z.string(),
  }),
  z.object({
    type: z.literal("REQUEST_DRAWING"),
    roomId: z.string(),
    drawingId: z.string(),
  }),
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;
