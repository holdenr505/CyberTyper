import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import { Server } from 'socket.io';
import registerSocketHandlers from './src/back-end/utils/socketHandlers.js';

const port = process.env.PORT || 3000;
const rooms = new Map();

// convert url to path, then get only the directory (exclude the filename)
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const public_path = path.join(__dirname, 'public');

const server = http.createServer(async (req, res) => {
    try {
        if (req.method === 'GET') {
            // prevent directory traversal
            const requested_url = path.normalize(path.join(public_path, req.url));
            if (!requested_url.startsWith(public_path)) {
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                return res.end('Forbidden');
            }

            if (req.url === '/') {
                const data = await fs.readFile(path.join(public_path, 'index.html'), 'utf-8');
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            }
            else if (req.url === '/config') {
                const data = process.env.SERVER_ADDR;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            }
            else if (req.url.match(/.js$/)) {
                const data = await fs.readFile(path.join(public_path, req.url), 'utf-8'); // get JS file
                res.setHeader('Content-Type', 'text/javascript');
                res.end(data);
            }
            else if (req.url.match(/.svg$/)) {
                const data = await fs.readFile(path.join(public_path, req.url)); // get svg images
                res.setHeader('Content-Type', 'image/svg+xml');
                res.end(data);
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain'});
                res.end('Not Found');
            }
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain'});
        res.end('Server Error');
    }
});

const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {}
});

io.on('connection', (socket) => {
    registerSocketHandlers(socket, rooms, io);
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});