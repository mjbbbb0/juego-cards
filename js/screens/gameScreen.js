import { gameState } from "../gameState.js";


export class GameScreen {

    constructor(screenManager) {

        this.screenManager =
            screenManager;

    }


    render(container) {

        const player =
            gameState.player;


        container.innerHTML = `

            <div class="game-screen">

                <h1>
                    Bienvenido,
                    ${player.name}
                </h1>

                <p>
                    ❤️
                    ${player.hp}
                    /
                    ${player.maxHp}
                </p>

                <p>
                    💰
                    ${gameState.gold}
                </p>

                <p>
                    Esta será la pantalla
                    principal del juego.
                </p>

            </div>

        `;

    }

}
