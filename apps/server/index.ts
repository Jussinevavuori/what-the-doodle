import { createId } from "@paralleldrive/cuid2";
import { ClientMessageSchema } from "@wtd/shared/schemas";
import {
  handleClientMessage,
  handleConnected,
  handleDisconnected,
} from "./src/handleClientMessage";

export type WebSocketData = {
  createdAt: number;
  userId: string;
};

export const BunServer = Bun.serve({
  /**
   * Routes
   */
  routes: {
    "/": () => new Response("Hello, World!"),
  },

  /**
   * Handle incoming HTTP requests not handled by routes
   */
  fetch(req, server) {
    const url = new URL(req.url);

    /**
     * Connect websocket at /ws
     */
    if (url.pathname === "/ws") {
      const cookies = new Bun.CookieMap(req.headers.get("cookie")!);

      const userId = cookies.get("X-UserId") || createId();

      /**
       * Upgrade the request to a WebSocket connection with a session ID
       */
      const isUpgraded = server.upgrade(req, {
        headers: {
          "Set-Cookie": `X-UserId=${userId}`,
        },
        data: {
          createdAt: Date.now(),
          userId: cookies.get("X-UserId") || "",
        },
      });

      if (!isUpgraded) {
        return new Response("Upgrade failed", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },

  /**
   * WebSocket event handlers
   */
  websocket: {
    // TypeScript: specify the type of ws.data like this
    data: {} as WebSocketData,

    /**
     * Parse messages from client and route them to the appropriate handler
     */
    async message(ws, message) {
      try {
        if (typeof message !== "string") {
          throw new Error("Expected message to be a string");
        }
        const json = JSON.parse(message);
        const data = ClientMessageSchema.parse(json);
        await handleClientMessage(ws, ws.data.userId, data);
      } catch (e) {
        console.error("Invalid message received:", e);
        return;
      }
    },

    /**
     * A socket is opened
     */
    async open(ws) {
      await handleConnected(ws, ws.data.userId);
    },

    /**
     * A socket is closed
     */
    async close(ws, _code, _message) {
      await handleDisconnected(ws, ws.data.userId);
    },
  },
});
