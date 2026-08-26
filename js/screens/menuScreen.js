import { CharacterSelectScreen } from "./characterSelectScreen.js";
import { gameState } from "../gameState.js";
import { generateSeed } from "../rng/seed.js";


export class MenuScreen {

    constructor(screenManager) {

        this.screenManager = screenManager;

    }


    render(container) {

        container.innerHTML = `

            <div class="menu-screen">

                <h1>
                    Mi Roguelike
                </h1>

                <button id="newGameButton">
                    Nueva partida
                </button>

                <button id="continueButton">
                    Continuar partida
                </button>

            </div>

        `;


        const newGameButton =
            document.getElementById(
                "newGameButton"
            );


        newGameButton.addEventListener(
            "click",
            () => {

                // Generar la seed de la partida

                gameState.seed =
                    generateSeed();


                console.log(
                    "Seed de la partida:",
                    gameState.seed
                );


                // Ir a selección de personaje

                const characterScreen =
                    new CharacterSelectScreen(
                        this.screenManager
                    );


                this.screenManager.show(
                    characterScreen
                );

            }
        );


        const continueButton =
            document.getElementById(
                "continueButton"
            );


        continueButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Continuar partida"
                );

            }
        );

    }

}