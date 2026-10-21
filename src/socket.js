import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let socket = null;

// Get or initialize persistent Socket.IO connection
export const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            transports: ["websocket", "polling"]
        });

        socket.on("connect", () => {
            console.log("[Socket.IO Client] Connected to server with ID:", socket.id);
        });

        socket.on("connect_error", (error) => {
            console.warn("[Socket.IO Client] Connection error:", error.message);
        });

        socket.on("disconnect", (reason) => {
            console.log("[Socket.IO Client] Disconnected:", reason);
        });
    }

    return socket;
};

// Join a ride room
export const joinRideRoom = (rideId, userId) => {
    const s = getSocket();
    if (s && rideId) {
        s.emit("join_ride", { rideId, userId });
    }
};

// Leave a ride room
export const leaveRideRoom = (rideId) => {
    const s = getSocket();
    if (s && rideId) {
        s.emit("leave_ride", { rideId });
    }
};
