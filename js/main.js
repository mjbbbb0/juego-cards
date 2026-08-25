const newGameButton = document.getElementById("new-game");
const continueGameButton = document.getElementById("continue-game");

// Comprobar si existe una partida guardada
function hasSaveGame() {
    return localStorage.getItem("gameSave") !== null;
}

// Actualizar estado del botón Continuar
function updateContinueButton() {
    continueGameButton.disabled = !hasSaveGame();
}

updateContinueButton();


// NUEVA PARTIDA
newGameButton.addEventListener("click", () => {

    const saveData = {
        player: {
            name: "Héroe",
            hp: 70,
            maxHp: 70,
            gold: 99
        },

        progress: {
            floor: 1,
            act: 1
        },

        deck: [
            "strike",
            "strike",
            "defend",
            "defend",
            "bash"
        ]
    };

    localStorage.setItem(
        "gameSave",
        JSON.stringify(saveData)
    );

    console.log("Nueva partida creada");

    // De momento mostramos esto.
    // Más adelante cambiaremos a la pantalla del mapa.
    alert("Nueva partida");
});


// CONTINUAR PARTIDA
continueGameButton.addEventListener("click", () => {

    const save = localStorage.getItem("gameSave");

    if (!save) {
        return;
    }

    const gameData = JSON.parse(save);

    console.log("Partida cargada:", gameData);

    alert(
        `Continuando partida...\n` +
        `Piso: ${gameData.progress.floor}\n` +
        `Vida: ${gameData.player.hp}/${gameData.player.maxHp}`
    );
});