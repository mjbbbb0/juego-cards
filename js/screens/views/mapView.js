import { gameState } from "../data/gameState.js";


export class MapView {

    constructor(gameScreen) {

        this.gameScreen = gameScreen;

    }


    render(container) {

        const maps =
            gameState.maps;


        // --------------------------------------------
        // Comprobar que existen los mapas
        // --------------------------------------------

        if (
            !maps ||
            maps.length === 0
        ) {

            container.innerHTML = `

                <div class="map-view">

                    <h2>
                        No hay mapas generados
                    </h2>

                </div>

            `;

            return;

        }


        // --------------------------------------------
        // Mostrar mapas
        // --------------------------------------------

        container.innerHTML = `

            <div class="map-view">

                <h1>
                    MAPAS DEL ACTO
                    ${gameState.currentAct}
                </h1>


                <p>
                    Seed:
                    ${gameState.seed}
                </p>


                ${maps.map(
                    (map, index) => `

                        <section>

                            <h2>
                                MAPA ${index + 1}
                            </h2>

                            <p>
                                Bioma:
                                ${map.biome ?? "Sin definir"}
                            </p>

                            <p>
                                Estado:
                                ${
                                    map.valid
                                        ? "VÁLIDO"
                                        : "INVÁLIDO"
                                }
                            </p>


                            <pre>
${JSON.stringify(
    map,
    null,
    2
)}
                            </pre>

                        </section>

                    `
                ).join("")}

            </div>

        `;

    }

}