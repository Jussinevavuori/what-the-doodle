import { Room } from "./Room";

/**
 * Registry to manage all Player instances
 */
export class RoomRegistry {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  getRoom(id: string) {
    const existingRoom = this.rooms.get(id);
    if (existingRoom) {
      return existingRoom;
    }

    const newRoom = new Room(id);
    this.rooms.set(id, newRoom);
    return newRoom;
  }

  getPlayerRooms(playerId: string): Room[] {
    return [...this.rooms.values()].filter((room) => room.players.players.has(playerId));
  }

  forEach(callback: (room: Room) => void) {
    this.rooms.forEach(callback);
  }
}
