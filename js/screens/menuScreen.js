import { CharacterSelectScreen } from "./characterSelectScreen.js";


export class MenuScreen {

    constructor(screenManager) {

        this.screenManager =
            screenManager;

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


        // Botón Nueva partida

        const newGameButton =
            document.getElementById(
                "newGameButton"
            );


        newGameButton.addEventListener(
            "click",
            () => {

                const characterScreen =
                    new CharacterSelectScreen(
                        this.screenManager
                    );


                this.screenManager.show(
                    characterScreen
                );

            }
        );


        // Botón Continuar

        const continueButton =
            document.getElementById(
                "continueButton"
            );


        continueButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Continuar partida todavía no está implementado."
                );

            }
        );

    }

}