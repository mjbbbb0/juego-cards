import { ScreenManager } from "./screens/ScreenManager.js";
import { MenuScreen } from "./screens/MenuScreen.js";


// Contenedor principal

const app =
    document.getElementById("app");


// Crear ScreenManager

const screenManager =
    new ScreenManager(app);


// Crear pantalla inicial

const menuScreen =
    new MenuScreen();


// Mostrar pantalla inicial

screenManager.show(
    menuScreen
);