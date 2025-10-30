import { MAX_PLAYERS, MIN_PLAYERS } from "@wtd/shared/consts";
import type { ClientMessage, ServerMessage } from "@wtd/shared/schemas";
import type { WebSocketData } from "..";
import { Player } from "./Player";
import { PlayerRegistry } from "./PlayerRegistry";
import { RoomRegistry } from "./RoomRegistry";
import { sendServerMessage } from "./sendServerMessage";

const Players = new PlayerRegistry();
const Rooms = new RoomRegistry();

setInterval(() => {
  console.log(`🟢 Online ${Players.players.size} players:`);
  Players.players.forEach((player) => {
    console.log(`   - ${player.name} (ID: ${player.id})`);
  });
}, 5000);

export async function handleClientMessage(
  ws: Bun.ServerWebSocket<WebSocketData>,
  userId: string,
  message: ClientMessage,
) {
  const player = Players.getPlayer(userId);
  console.log("🔥", message);

  switch (message.type) {
    /**
     * Player details updated
     */
    case "PLAYER_UPDATED": {
      // Update player info
      player.name = message.player.name;
      player.avatar = message.player.avatar;

      // Sync rooms the player is in
      Rooms.getPlayerRooms(userId).forEach((room) => room.sync());

      return;
    }

    /**
     * Join room request
     */
    case "JOIN_ROOM": {
      // Disable if room is full
      const room = Rooms.getRoom(message.roomId);
      if (room.players.size() >= MAX_PLAYERS) {
        console.log(`Room ${room.id} is full. Player ${player.id} cannot join.`);
        return;
      }

      // Add and subscribe to requested room
      ws.subscribe(message.roomId);
      room.players.addPlayer(player);
      room.sync();
      return;
    }

    /**
     * Leave room request
     */
    case "LEAVE_ROOM": {
      // Leave and unsubscribe all rooms
      for (const room of Rooms.getPlayerRooms(userId)) {
        ws.unsubscribe(room.id);
        room.players.removePlayer(player.id);
        room.sync();
      }

      return;
    }

    /**
     * Update game settings
     */
    case "UPDATE_GAME_SETTINGS": {
      const room = Rooms.getRoom(message.roomId);
      if (message.drawingTimeSeconds !== undefined) {
        room.game.drawingTimeSeconds = message.drawingTimeSeconds;
      }
      room.sync();
      return;
    }

    /**
     * Submit guess to the game
     */
    case "GUESS": {
      const room = Rooms.getRoom(message.roomId);
      room.game.onPlayerGuessed(userId, message.guess);
      room.sync();
      return;
    }

    /**
     * Select initial prompt for the drawing
     */
    case "SELECT_INITIAL_PROMPT": {
      const room = Rooms.getRoom(message.roomId);
      room.game.onPlayerSelectedInitialPrompt(userId, message.prompt);
      room.sync();
      return;
    }

    /**
     * Start a new game
     */
    case "START_GAME": {
      const room = Rooms.getRoom(message.roomId);
      if (room.players.size() >= MIN_PLAYERS) {
        room.game.start(room.players.toArray());
        room.sync();
      }
      return;
    }

    /**
     * Reset the game
     */
    case "NEW_GAME": {
      const room = Rooms.getRoom(message.roomId);
      room.resetGame();
      room.sync();
      return;
    }

    /**
     * Player has submitted a drawing
     */
    case "SUBMIT_DRAWING": {
      const room = Rooms.getRoom(message.roomId);
      room.game.onPlayerSubmittedDrawing(userId, message.drawingId, message.jpgBase64);
      return;
    }

    /**
     * Request drawing data
     */
    case "REQUEST_DRAWING": {
      const room = Rooms.getRoom(message.roomId);
      sendServerMessage(ws, {
        type: "DRAWING_DATA",
        roomId: room.id,
        drawingId: message.drawingId,
        jpgBase64:
          room.game.drawings.flat().find((_) => _.id === message.drawingId)?.jpgBase64 ?? null,
      });
      return;
    }
  }
}

/**
 * When a player connects
 *
 * - Add them to the player registry
 * - Send them their assigned user ID
 */
export async function handleConnected(ws: Bun.ServerWebSocket<WebSocketData>, userId: string) {
  Players.addPlayer(new Player(userId, { avatar: "", name: "" }));

  const message: ServerMessage = {
    type: "ASSIGN_USER_ID",
    userId: ws.data.userId,
  };

  // Assign user ID
  ws.send(JSON.stringify(message));
}

/**
 * When a player disconnects
 *
 * - Remove them from the player registry
 * - Remove them from any rooms they were in
 */
export async function handleDisconnected(_ws: Bun.ServerWebSocket<WebSocketData>, userId: string) {
  Players.removePlayer(userId);

  for (const room of Rooms.getPlayerRooms(userId)) {
    room.players.removePlayer(userId);
    room.sync();
  }
}
