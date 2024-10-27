import { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import { Server as IOServer } from 'socket.io'
import { onConnect } from "@/sockets";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    // console.log(req);
    if (!res.socket.server.io) {
        const io = new IOServer(res.socket.server)
        res.socket.server.io = io
    
        io.on('connection', onConnect);
    }

    res.status(200).end();
}
