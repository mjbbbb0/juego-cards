export class MenuScreen {

    constructor(screenManager) {

        this.screenManager = screenManager;

    }


    render(container) {

        container.innerHTML = `

            <div class="menu-screen">

                <h1>Mi Roguelike</h1>

                <button id="newGameButton">
                    Nueva partida
                </button>

                <button id="continueButton">
                    Continuar partida
                </button>

            </div>

        `;


        const newGameButton =
            document.getElementById("newGameButton");


        newGameButton.addEventListener(
            "click",
            () => {

                console.log("Nueva partida");

            }
        );


        const continueButton =
            document.getElementById("continueButton");


        continueButton.addEventListener(
            "click",
            () => {

                console.log("Continuar partida");

            }
        );

    }

}