export const gameState = {

    // Partida
    isGameStarted: false,
    floor: 1,
    act: 1,

    // Personaje
    player: null,

    // Mazo
    deck: [],
    drawPile: [],
    discardPile: [],

    // Reliquias
    relics: [],

    // Mapa
    map: null,
    currentNode: null

};


// Reiniciar estado para una nueva partida
export function resetGameState() {

    gameState.isGameStarted = true;

    gameState.floor = 1;
    gameState.act = 1;

    gameState.player = null;

    gameState.deck = [];
    gameState.drawPile = [];
    gameState.discardPile = [];

    gameState.relics = [];

    gameState.map = null;
    gameState.currentNode = null;
}