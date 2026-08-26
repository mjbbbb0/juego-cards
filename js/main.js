import { ScreenManager } from "./screens/ScreenManager.js";
import { MenuScreen } from "./screens/menuScreen.js";


// Obtener el contenedor principal

const app =
    document.getElementById("app");


// Crear el ScreenManager

const screenManager =
    new ScreenManager(app);


// Crear el menú

const menuScreen =
    new MenuScreen(screenManager);


// Mostrar el menú

screenManager.show(menuScreen);