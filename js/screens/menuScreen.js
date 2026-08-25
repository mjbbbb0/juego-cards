import { resetGameState } from "../gameState.js";
import { showScreen } from "./screenManager.js";
import { createCharacterSelectScreen } from "./characterSelectScreen.js";


// ========================================
// CREAR MENÚ
// ========================================

export function createMenuScreen() {

    const screen =
        document.createElement("div");


    screen.id = "menu-screen";

    screen.classList.add("screen");


    screen.innerHTML = `

        <h1>MI ROGUELIKE</h1>

        <button id="new-game">
            Nueva partida
        </button>

        <button id="continue-game">
            Continuar partida
        </button>

    `;


    // Nueva partida

    screen
        .querySelector("#new-game")
        .addEventListener("click", () => {

            resetGameState();

            showScreen(
                createCharacterSelectScreen()
            );

        });


    // Continuar

    screen
        .querySelector("#continue-game")
        .addEventListener("click", () => {

            console.log(
                "Continuar partida"
            );

        });


    return screen;
}