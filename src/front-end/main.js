/** Coded by: HR ******************************
*   Date: February 13th, 2025                 *
**  Description: An online type racing game  **/

import io from 'socket.io-client'; // socket for client
import registerSocketHandlers from './utils/socketHandlers.js';
import Header from './ui_components/header/Header.js';
import Homepage from './ui_components/homepage/Homepage.js';
import TypingPanel from './ui_components/typing_panel/TypingPanel.js';
import Racetrack from './ui_components/player_components/PlayerComponents.js';
import assets from './assets/assets.js';
import DomController from './controllers/DomController.js';
import eventBus from './shared/eventBus.js';
import eventBusHandlers from './utils/eventBusHandlers.js';
import './style.css';

// fetch server address from config endpoint
const fetchAddr = async () => {
    try {
        const response = await fetch('/config');
        const serverAddr = await response.json();
        return serverAddr;
    } catch (error) {
        console.error(error.message);
        throw new error('Failed to fetch server address');
    }
}

// entry point for the application
const main = async () => {
    try {
        const serverAddr = await fetchAddr();
        const socket = io(serverAddr, { autoConnect: false });
        const controller = new DomController(new Header(assets.logo),
        new Homepage(), new TypingPanel('Generating prompt...', 'Waiting for players...'), 
        new Racetrack(), eventBus, eventBusHandlers);
    
        controller.render();
        registerSocketHandlers(socket, eventBus);
    } catch (error) {
        console.error(error.message);
    }
}

main();
