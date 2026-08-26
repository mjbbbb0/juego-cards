import { gameState } from "../gameState.js";


export class CharacterSelectScreen {

    constructor(screenManager) {

        this.screenManager =
            screenManager;

        this.characters = [];

    }


    async render(container) {

        // Cargar personajes

        const response =
            await fetch(
                "./js/data/characters.json"
            );


        const data =
            await response.json();


        this.characters =
            data.characters;


        container.innerHTML = `

            <div class="character-select">

                <h1>
                    Selecciona tu personaje
                </h1>

                <div id="characters">

                </div>

            </div>

        `;


        const charactersContainer =
            document.getElementById(
                "characters"
            );


        this.characters.forEach(
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
                        Vida:
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


    selectCharacter(character) {

        gameState.player = {

            id: character.id,

            name: character.name,

            description: character.description,

            color: character.color,

            maxHp: character.maxHp,

            hp: character.maxHp

        };


        import("./gameScreen.js")
            .then(module => {

                const screen =
                    new module.GameScreen(
                        this.screenManager
                    );


                this.screenManager.show(
                    screen
                );

            });

    }

}