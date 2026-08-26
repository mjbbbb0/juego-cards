import { gameState } from "../gameState.js";


export class MapView {

    constructor(screenManager) {

        this.screenManager =
            screenManager;

    }


    render(container) {

        // ====================================================
        // OBTENER LOS 3 MAPAS
        // ====================================================

        const map1 =
            gameState.map[1];

        const map2 =
            gameState.map[2];

        const map3 =
            gameState.map[3];


        // ====================================================
        // MOSTRAR LOS MAPAS
        // ====================================================

        container.innerHTML = `

            <div class="map-view">

                <h2>
                    MAPAS GENERADOS
                </h2>


                <h3>
                    ACTO 1
                </h3>

                <pre>
${JSON.stringify(
    map1,
    null,
    2
)}
                </pre>


                <h3>
                    ACTO 2
                </h3>

                <pre>
${JSON.stringify(
    map2,
    null,
    2
)}
                </pre>


                <h3>
                    ACTO 3
                </h3>

                <pre>
${JSON.stringify(
    map3,
    null,
    2
)}
                </pre>

            </div>

        `;

    }

}