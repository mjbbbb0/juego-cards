export class MapView {

    constructor(screenManager) {

        this.screenManager =
            screenManager;

    }


    render(container) {

        container.innerHTML = `

            <div>

                <h1>
                    MAP VIEW FUNCIONA
                </h1>

                <p>
                    Esta es la pantalla del mapa.
                </p>

            </div>

        `;

    }

}