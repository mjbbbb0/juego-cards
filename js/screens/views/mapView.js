import { gameState } from "../../gameState.js";
import { generateMap } from "../../map/mapGenerator.js";
import { Random } from "../../rng/random.js";


export class MapView {

    render(container) {

        const random =
            new Random(
                gameState.seed
            );


        const map =
            generateMap(
                random,
                gameState.currentAct,
                gameState.currentBiome
            );


        gameState.map = map;


        let html = `

            <div class="map-view">

                <h2>
                    Mapa
                </h2>

                <p>
                    Seed: ${gameState.seed}
                </p>

                <p>
                    Acto: ${map.act}
                </p>

                <p>
                    Bioma: ${map.biome}
                </p>

                <hr>

        `;


        // Mostrar pisos de arriba hacia abajo

        for (
            let row = map.rows;
            row >= 1;
            row--
        ) {

            html += `

                <div class="map-floor">

                    <strong>
                        Piso ${row}
                    </strong>

                    <div>
            `;


            const nodes =
                map.nodes.filter(
                    node =>
                        node.row === row
                );


            for (
                let column = 0;
                column < map.columns;
                column++
            ) {

                const node =
                    nodes.find(
                        node =>
                            node.column === column
                    );


                if (!node) {

                    html += `
                        <span>
                            &nbsp;&nbsp;&nbsp;
                        </span>
                    `;

                    continue;

                }


                html += `

                    <span
                        style="
                            display:inline-block;
                            width:40px;
                            text-align:center;
                        "
                    >
                        ${getNodeSymbol(node.type)}
                    </span>

                `;

            }


            html += `

                    </div>

                </div>

            `;

        }


        html += `

                <hr>

                <h3>
                    Conexiones
                </h3>

        `;


        for (
            const node of map.nodes
        ) {

            if (
                node.connections.length === 0
            ) {

                continue;

            }


            html += `

                <p>

                    ${node.id}

                    →

                    ${node.connections.join(", ")}

                </p>

            `;

        }


        html += `

                <hr>

                <p>
                    Jefe: ${map.boss?.id}
                </p>

            </div>

        `;


        container.innerHTML =
            html;

    }

}


function getNodeSymbol(type) {

    switch (type) {

        case "combat":
            return "⚔️";

        case "event":
            return "?";

        case "elite":
            return "☠️";

        case "rest":
            return "🔥";

        case "shop":
            return "$";

        case "treasure":
            return "💎";

        case "chest":
            return "📦";

        default:
            return "○";

    }

}