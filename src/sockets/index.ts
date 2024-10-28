import { Socket } from "socket.io";
import { isOfEmittedMessageType } from "./socket.types";
import { getResponse } from "./socket.service";

export function onConnect(socket: Socket) {
    socket.on('sendUserMessage', (data) => {
        if (!isOfEmittedMessageType(data)) {
            socket.disconnect();
            return ;
        }
        getResponse(data, socket);
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    })
}
