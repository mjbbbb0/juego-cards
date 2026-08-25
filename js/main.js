import {
    resetGameState
} from "./gameState.js";

import {
    showScreen
} from "./screens/screenManager.js";


const newGameButton =
    document.getElementById("new-game");

const continueButton =
    document.getElementById("continue-game");


// Nueva partida

newGameButton.addEventListener("click", () => {

    resetGameState();

    console.log("Nueva partida iniciada");

});


// Continuar partida

continueButton.addEventListener("click", () => {

    console.log("Continuar partida");

});