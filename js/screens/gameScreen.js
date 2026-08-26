import { gameState } from "../gameState.js";

import { MapView } from "./views/mapView.js";
import { CombatView } from "./views/combatView.js";
import { ShopView } from "./views/shopView.js";
import { EventView } from "./views/eventView.js";


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

        this.renderCurrentView();

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


    renderCurrentView() {

        const content =
            document.getElementById(
                "gameContent"
            );


        switch (gameState.currentView) {

            case "map":

                new MapView(this)
                    .render(content);

                break;


            case "combat":

                new CombatView(this)
                    .render(content);

                break;


            case "shop":

                new ShopView(this)
                    .render(content);

                break;


            case "event":

                new EventView(this)
                    .render(content);

                break;


            default:

                console.error(
                    "Vista desconocida:",
                    gameState.currentView
                );

                gameState.currentView = "map";

                new MapView(this)
                    .render(content);

        }

    }


    changeView(view) {

        gameState.currentView = view;

        this.renderCurrentView();

    }

}