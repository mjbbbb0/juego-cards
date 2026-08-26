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
                            ❤️ ${character.maxHp}
                        </p>

                        <button>
                            Elegir
                        </button>

                    `;


                    const button =
                        card.querySelector(
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

        console.log(
            "Personaje seleccionado:",
            character
        );

    }

}