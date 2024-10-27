// import { NextApiRequest, NextApiResponse } from "next";
// import type { Server as HTTPServer } from 'http'
// import type { Socket as NetSocket } from 'net'
// import { Server as IOServer } from 'socket.io'
// import { onConnect } from "@/sockets";

// interface SocketServer extends HTTPServer {
//   io?: IOServer | undefined
// }

// interface SocketWithIO extends NetSocket {
//   server: SocketServer
// }

// interface NextApiResponseWithSocket extends NextApiResponse {
//   socket: SocketWithIO
// }

// export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
//     const socket = res.socket.server;
//     // console.log(req);
//     if (res.socket.server.io) {
//         console.log('Socket is already running.')
//     } else {
//         console.log('Socket is initializing...')

//         const io = new IOServer(res.socket.server)
//         res.socket.server.io = io
    
//         io.on('connection', (socket) => {

//             console.log('New client connected');
  
//             socket.on('disconnect', () => {
  
//               console.log('Client disconnected');
  
//             });
  
//         });
//     }

//     res.status(200).end();
// }
