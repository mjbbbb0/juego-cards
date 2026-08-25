let currentScreen = null;

const game = document.getElementById("game");


// ========================================
// MOSTRAR PANTALLA
// ========================================

export function showScreen(screen) {

    // Eliminar pantalla actual
    if (currentScreen) {
        currentScreen.remove();
    }

    // Añadir nueva pantalla
    game.appendChild(screen);

    // Guardar pantalla actual
    currentScreen = screen;
}