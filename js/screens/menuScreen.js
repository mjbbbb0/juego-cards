export class MenuScreen {

    constructor(screenManager) {

        this.screenManager = screenManager;

    }

    render(container) {

        container.innerHTML = `

            <h1>Mi Roguelike</h1>

            <button id="newGameButton">
                Nueva partida
            </button>

            <button id="continueButton">
                Continuar partida
            </button>

        `;

    }

}