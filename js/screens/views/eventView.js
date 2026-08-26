export class EventView {

    constructor(gameScreen) {

        this.gameScreen = gameScreen;

    }


    render(container) {

        container.innerHTML = `

            <h1>❓ Evento</h1>

            <p>
                Aquí irá el evento.
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
