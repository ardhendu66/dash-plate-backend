import { Server as SocketServer } from "socket.io";
import { Server as httpServer } from "http";
import { WebsocketConnectionError } from "./utils/GlobalError";

let io: SocketServer;

const initSocket = (server: httpServer): SocketServer => {
    io = new SocketServer(server, {
        cors: {
            origin: "*", // frontend domain url
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        }
    });

    const orderNameSpace = io.of("/orders");

    orderNameSpace.on("connection", socket => {
        console.log(`User_${socket.id} connected`);
        
        socket.on("join_order_room", (orderId: string) => {
            if(socket.rooms.has(orderId)) {
                console.log(`User_${socket.id} already joined Order_Room_${orderId}`);
                return;
            }
            socket.join(orderId);
            console.log(`User_${socket.id} joined Order_Room_${orderId}`);            
        });
        
        socket.on("leave_order_room", (orderId: string) => {
            if(!socket.rooms.has(orderId)) {
                console.log(`User_${socket.id} not in Order_Room_${orderId}`);
                return;
            }
            socket.leave(orderId);
            console.log(`User_${socket.id} left Order_Room_${orderId}`);            
        });

        socket.on("disconnect", () => {
            console.log(`User_${socket.id} disconnected`);            
        });
    });

    return io;
}

const getIo = (): SocketServer => {
    if(!io) {
        throw new WebsocketConnectionError("Websocket not connected");
    }
    return io;
}

export { initSocket, getIo };