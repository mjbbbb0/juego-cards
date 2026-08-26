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


        // Guardamos el mapa en GameState

        gameState.map = map;


        // Mostrar TODO el objeto del mapa

        container.innerHTML = `

            <div class="map-view">

                <h2>MAPA GENERADO</h2>

                <pre id="mapData"></pre>

            </div>

        `;


        const mapData =
            document.getElementById(
                "mapData"
            );


        mapData.textContent =
            JSON.stringify(
                map,
                null,
                2
            );

    }

}