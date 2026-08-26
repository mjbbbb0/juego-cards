import { generateRunSeed } from "./rng/seedManager.js";


export const gameState = {

    runSeed: null,

    act: 1,

    biomes: {
        act1: null,
        act2: null,
        act3: null
    },

    maps: {
        act1: null,
        act2: null,
        act3: null
    },

    player: null,

    currentNode: null

};


// ========================================
// NUEVA PARTIDA
// ========================================

export function resetGameState() {

    gameState.runSeed = generateRunSeed();

    gameState.act = 1;

    gameState.biomes = {
        act1: null,
        act2: null,
        act3: null
    };

    gameState.maps = {
        act1: null,
        act2: null,
        act3: null
    };

    gameState.player = null;

    gameState.currentNode = null;


    console.log(
        "Nueva partida. Seed:",
        gameState.runSeed
    );

}