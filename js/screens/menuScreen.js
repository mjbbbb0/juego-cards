import { resetGameState } from "../gameState.js";
import { showScreen } from "./screenManager.js";
import { createCharacterSelectScreen } from "./characterSelectScreen.js";


// ========================================
// CREAR MENÚ
// ========================================

export function createMenuScreen() {

    const screen = document.createElement("div");

    screen.id = "menu-screen";

    screen.classList.add("screen");


    screen.innerHTML = `

        <h1>MI ROGUELIKE</h1>

        <div class="menu-buttons">

            <button id="new-game">
                Nueva partida
            </button>

            <button id="continue-game">
                Continuar partida
            </button>

        </div>

    `;


    // ========================================
    // NUEVA PARTIDA
    // ========================================

    const newGameButton =
        screen.querySelector("#new-game");


    newGameButton.addEventListener("click", () => {

        console.log("Nueva partida");

        // Reiniciar estado
        resetGameState();

        // Ir a selección de personaje
        showScreen(
            createCharacterSelectScreen()
        );

    });


    // ========================================
    // CONTINUAR PARTIDA
    // ========================================

    const continueButton =
        screen.querySelector("#continue-game");


    continueButton.addEventListener("click", () => {

        console.log("Continuar partida");

    });


    return screen;
}