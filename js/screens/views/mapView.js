export class CombatView {

    constructor(gameScreen) {

        this.gameScreen = gameScreen;

    }


    render(container) {

        container.innerHTML = `

            <h1>⚔️ Combate</h1>

            <p>
                Aquí irá el combate.
            </p>

            <button id="backToMap">
                Volver al mapa
            </button>

        `;


        document
            .getElementById("backToMap")
            .addEventListener(
                "click",
                () => {

                    this.gameScreen.showMap();

                }
            );

    }

}
