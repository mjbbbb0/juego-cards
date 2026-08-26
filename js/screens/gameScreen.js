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


                <div class="player-info">

                    <p>
                        ❤️ Vida:
                        ${player.hp}
                        /
                        ${player.maxHp}
                    </p>


                    <p>
                        💰 Oro:
                        ${gameState.gold}
                    </p>

                </div>


                <p>
                    Esta será la pantalla
                    principal del juego.
                </p>

            </div>

        `;

    }

}