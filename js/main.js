const app = document.getElementById("app");

app.innerHTML = `
    <h1>Mi Roguelike</h1>

    <p>El juego funciona correctamente.</p>

    <button id="newGameButton">
        Nueva partida
    </button>

    <button id="continueButton">
        Continuar partida
    </button>
`;

const newGameButton =
    document.getElementById("newGameButton");

newGameButton.addEventListener("click", () => {

    alert("Nueva partida");

});


const continueButton =
    document.getElementById("continueButton");

continueButton.addEventListener("click", () => {

    alert("Continuar partida");

});