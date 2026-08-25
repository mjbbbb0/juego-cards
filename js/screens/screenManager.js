let currentScreen = null;


const game =
    document.getElementById("game");


export function showScreen(screen) {

    // Eliminar pantalla anterior

    if (currentScreen) {

        currentScreen.remove();

    }


    // Mostrar nueva pantalla

    game.appendChild(screen);


    currentScreen = screen;

}