import { gameState } from "../gameState.js";
import { GameScreen } from "./gameScreen.js";


export class CharacterSelectScreen {

    constructor(screenManager) {

        this.screenManager = screenManager;

    }


    async render(container) {

        container.innerHTML = `

            <div class="character-select-screen">

                <h1>
                    Selecciona tu personaje
                </h1>

                <div id="characters">
                    Cargando personajes...
                </div>

            </div>

        `;


        try {

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


            data.characters.forEach(
                character => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "character-card";


                    card.innerHTML = `

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
                            ❤️ ${character.maxHp} HP
                        </p>

                        <button class="select-character">
                            Elegir
                        </button>

                    `;


                    const button =
                        card.querySelector(
                            ".select-character"
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
                        card
                    );

                }
            );

        }
        catch (error) {

            console.error(
                "Error cargando personajes:",
                error
            );


            container.innerHTML = `

                <h1>
                    Error
                </h1>

                <p>
                    No se pudieron cargar
                    los personajes.
                </p>

            `;

        }

    }


    selectCharacter(character) {

        // Guardar personaje

        gameState.player = {

            id: character.id,

            name: character.name,

            description: character.description,

            color: character.color,

            maxHp: character.maxHp,

            hp: character.maxHp

        };


        // Estado inicial de la partida

        gameState.gold = 100;

        gameState.currentAct = 1;

        gameState.currentBiome = null;

        gameState.currentNode = null;


        // La primera vista de la partida será el mapa

        gameState.currentView = "map";


        // Crear GameScreen

        const gameScreen =
            new GameScreen(
                this.screenManager
            );


        // Cambiar de CharacterSelectScreen
        // a GameScreen

        this.screenManager.show(
            gameScreen
        );

    }

}