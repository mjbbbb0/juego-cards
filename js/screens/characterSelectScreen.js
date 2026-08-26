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
                            ❤️
                            ${character.maxHp}
                            HP
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

                <div class="character-select-error">

                    <h1>
                        Error
                    </h1>

                    <p>
                        No se pudieron cargar
                        los personajes.
                    </p>

                </div>

            `;

        }

    }


    selectCharacter(character) {

        // Guardamos el personaje seleccionado

        gameState.player = {

            id: character.id,

            name: character.name,

            description: character.description,

            color: character.color,

            maxHp: character.maxHp,

            hp: character.maxHp

        };


        // Dinero inicial

        gameState.gold = 100;


        // Por ahora empezamos en el Acto 1

        gameState.currentAct = 1;


        // Todavía no tenemos bioma

        gameState.currentBiome = null;


        // Todavía no estamos en ningún nodo

        gameState.currentNode = null;


        // Crear la pantalla principal de partida

        const gameScreen =
            new GameScreen(
                this.screenManager
            );


        // Cambiar a la partida

        this.screenManager.show(
            gameScreen
        );

    }

}