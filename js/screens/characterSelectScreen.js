import { gameState } from "../gameState.js";
import { GameScreen } from "./gameScreen.js";


export class CharacterSelectScreen {

    constructor(screenManager) {

        this.screenManager =
            screenManager;

    }


    async render(container) {

        // Mostrar pantalla de carga

        container.innerHTML = `

            <div class="character-select">

                <h1>
                    Selecciona tu personaje
                </h1>

                <div id="characters">
                    Cargando personajes...
                </div>

            </div>

        `;


        try {

            // IMPORTANTE:
            // data está en la raíz del proyecto,
            // no dentro de js.

            const response =
                await fetch(
                    "./data/characters.json"
                );


            if (!response.ok) {

                throw new Error(
                    "No se pudo cargar characters.json"
                );

            }


            const data =
                await response.json();


            const charactersContainer =
                document.getElementById(
                    "characters"
                );


            charactersContainer.innerHTML = "";


            // Crear una tarjeta para cada personaje

            data.characters.forEach(
                character => {

                    const element =
                        document.createElement(
                            "div"
                        );


                    element.className =
                        "character";


                    element.innerHTML = `

                        <h2>
                            ${character.name}
                        </h2>

                        <p>
                            ${character.description}
                        </p>

                        <p>
                            Color:
                            ${character.color}
                        </p>

                        <p>
                            ❤️
                            ${character.maxHp}
                        </p>

                        <button>
                            Elegir
                        </button>

                    `;


                    const button =
                        element.querySelector(
                            "button"
                        );


                    button.addEventListener(
                        "click",
                        () => {

                            this.selectCharacter(
                                character
                            );

                        }
                    );


                    charactersContainer.appendChild(
                        element
                    );

                }
            );

        }
        catch (error) {

            console.error(
                "Error cargando personajes:",
                error
            );


            document.getElementById(
                "characters"
            ).innerHTML = `

                <p>
                    ❌ Error cargando los personajes.
                </p>

                <p>
                    Comprueba la consola del navegador.
                </p>

            `;

        }

    }


    selectCharacter(character) {

        // Guardar personaje en GameState

        gameState.player = {

            id: character.id,

            name: character.name,

            description:
                character.description,

            color: character.color,

            maxHp: character.maxHp,

            hp: character.maxHp

        };


        // Ir a la pantalla principal

        const gameScreen =
            new GameScreen(
                this.screenManager
            );


        this.screenManager.show(
            gameScreen
        );

    }

}