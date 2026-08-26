import { gameState } from "../gameState.js";


export class GameScreen {

    constructor(screenManager) {

        this.screenManager = screenManager;

    }


    render(container) {

        container.innerHTML = `

            <div class="game-screen">

                <div id="topBar"></div>

                <div id="gameContent"></div>

            </div>

        `;


        this.renderTopBar();

        this.showMap();

    }


    renderTopBar() {

        const topBar =
            document.getElementById("topBar");


        const player =
            gameState.player;


        topBar.innerHTML = `

            <div class="top-bar">

                <div>
                    ❤️
                    ${player.hp}
                    /
                    ${player.maxHp}
                </div>

                <div>
                    💰
                    ${gameState.gold}
                </div>

            </div>

        `;

    }


    showMap() {

        const content =
            document.getElementById(
                "gameContent"
            );


        content.innerHTML = `

            <div class="map-view">

                <h1>
                    Mapa
                </h1>

                <p>
                    Aquí aparecerá el mapa.
                </p>

            </div>

        `;

    }

}