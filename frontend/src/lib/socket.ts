import { io, Socket } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL;
export const socket: Socket = apiUrl ? io(apiUrl) : io(); 

