import { gameState } from "../gameState.js";

export function showMapScreen() {

    const app = document.getElementById("app");

    const map = gameState.maps.act1;

    app.innerHTML = `
        <div class="map-debug">

            <h1>Mapa - Acto 1</h1>

            <p>
                Seed:
                ${gameState.runSeed}
            </p>

            <p>
                Bioma:
                ${gameState.biomes.act1}
            </p>

            <pre>${JSON.stringify(map, null, 4)}</pre>

        </div>
    `;
}