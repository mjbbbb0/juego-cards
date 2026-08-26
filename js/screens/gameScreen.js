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

        this.showMap();

    }


    renderTopBar() {

        const topBar =
            document.getElementById("topBar");


        const player =
            gameState.player;


        topBar.innerHTML = `

            <div class="top-bar">

                <div class="player-hp">

                    ❤️

                    ${player.hp}

                    /

                    ${player.maxHp}

                </div>


                <div class="player-gold">

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


        const mapView =
            new MapView(this);


        mapView.render(content);

    }


    showCombat() {

        const content =
            document.getElementById(
                "gameContent"
            );


        const combatView =
            new CombatView(this);


        combatView.render(content);

    }


    showShop() {

        const content =
            document.getElementById(
                "gameContent"
            );


        const shopView =
            new ShopView(this);


        shopView.render(content);

    }


    showEvent() {

        const content =
            document.getElementById(
                "gameContent"
            );


        const eventView =
            new EventView(this);


        eventView.render(content);

    }

}