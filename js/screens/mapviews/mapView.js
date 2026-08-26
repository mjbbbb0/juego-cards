export class MapView {

    constructor(gameScreen) {

        this.gameScreen = gameScreen;

    }


    render(container) {

        container.innerHTML = `

            <div class="map-view">

                <h1>Mapa</h1>

                <p>
                    Este será el mapa de la partida.
                </p>

                <div class="map-test-buttons">

                    <button id="combatButton">
                        Combate
                    </button>

                    <button id="shopButton">
                        Tienda
                    </button>

                    <button id="eventButton">
                        Evento
                    </button>

                </div>

            </div>

        `;


        const combatButton =
            document.getElementById("combatButton");


        combatButton.addEventListener(
            "click",
            () => {

                this.gameScreen.showCombat();

            }
        );


        const shopButton =
            document.getElementById("shopButton");


        shopButton.addEventListener(
            "click",
            () => {

                this.gameScreen.showShop();

            }
        );


        const eventButton =
            document.getElementById("eventButton");


        eventButton.addEventListener(
            "click",
            () => {

                this.gameScreen.showEvent();

            }
        );

    }

}
