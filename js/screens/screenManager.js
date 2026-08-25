const screenContainer =
    document.getElementById("screen-container");

const menu =
    document.getElementById("menu");

let currentScreen = null;


// ========================================
// MOSTRAR PANTALLA
// ========================================

export function showScreen(screen) {

    // Eliminar pantalla actual
    if (currentScreen) {
        currentScreen.remove();
        currentScreen = null;
    }

    // Ocultar menú
    menu.classList.add("hidden");

    // Añadir nueva pantalla
    screenContainer.appendChild(screen);

    currentScreen = screen;
}


// ========================================
// MOSTRAR MENÚ
// ========================================

export function showMenu() {

    // Eliminar pantalla actual
    if (currentScreen) {
        currentScreen.remove();
        currentScreen = null;
    }

    // Mostrar menú
    menu.classList.remove("hidden");
}