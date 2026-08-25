import { showScreen } from "./screens/screenManager.js";
import { createMenuScreen } from "./screens/menuScreen.js";


// ========================================
// INICIAR JUEGO
// ========================================

const menuScreen = createMenuScreen();

showScreen(menuScreen);