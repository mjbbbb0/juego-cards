export class CharacterSelectScreen {

    constructor(screenManager) {

        this.screenManager = screenManager;

    }


    render(container) {

        container.innerHTML = `

            <div class="character-select-screen">

                <h1>
                    Selecciona tu personaje
                </h1>

                <p>
                    Aquí aparecerán los personajes.
                </p>

                <button id="backButton">
                    Volver
                </button>

            </div>

        `;


        const backButton =
            document.getElementById("backButton");


        backButton.addEventListener(
            "click",
            () => {

                // De momento no hacemos nada.

                console.log("Volver");

            }
        );

    }

}