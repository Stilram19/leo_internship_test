'use client'

import { createContext, ReactNode, useContext } from 'react';
import { io, Socket } from "socket.io-client";


type Props = {
    children: ReactNode;
}

const   SocketContext = createContext<Socket | null>(null);

const   SocketProvider = ({children}: Props) => {
    const   socket = io('/')

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;