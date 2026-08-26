import { gameState } from "../gameState.js";


export class MapView {

    constructor(screenManager) {

        this.screenManager =
            screenManager;

    }


    render(container) {

        const maps =
            gameState.map || {};


        const map1 =
            maps[1] || null;

        const map2 =
            maps[2] || null;

        const map3 =
            maps[3] || null;


        container.innerHTML = `

            <div class="map-view">

                <h1>
                    MAPAS GENERADOS
                </h1>


                <h2>
                    ACTO 1
                </h2>

                <pre>
${map1
    ? JSON.stringify(
        map1,
        null,
        2
    )
    : "Mapa del Acto 1 no generado."
}
                </pre>


                <h2>
                    ACTO 2
                </h2>

                <pre>
${map2
    ? JSON.stringify(
        map2,
        null,
        2
    )
    : "Mapa del Acto 2 no generado."
}
                </pre>


                <h2>
                    ACTO 3
                </h2>

                <pre>
${map3
    ? JSON.stringify(
        map3,
        null,
        2
    )
    : "Mapa del Acto 3 no generado."
}
                </pre>

            </div>

        `;

    }

}