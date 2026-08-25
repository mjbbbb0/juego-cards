import {
    showScreen,
    showMenu
} from "./screens/screenManager.js";


const newGameButton =
    document.getElementById("new-game");

const continueButton =
    document.getElementById("continue-game");


// ========================================
// NUEVA PARTIDA
// ========================================

newGameButton.addEventListener("click", () => {

    console.log("Nueva partida");

});


// ========================================
// CONTINUAR PARTIDA
// ========================================

continueButton.addEventListener("click", () => {

    console.log("Continuar partida");

});