export class ShopView {

    constructor(gameScreen) {

        this.gameScreen = gameScreen;

    }


    render(container) {

        container.innerHTML = `

            <h1>🛒 Tienda</h1>

            <p>
                Aquí irá la tienda.
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
