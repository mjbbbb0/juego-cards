import { ScreenManager } from "./screens/ScreenManager.js";


// Contenedor principal del juego

const app =
    document.getElementById("app");


// Crear el gestor de pantallas

const screenManager =
    new ScreenManager(app);