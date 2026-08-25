import { showScreen } from "./screens/screenManager.js";

import { createMenuScreen } from "./screens/menuScreen.js";


const menu =
    createMenuScreen();


showScreen(menu);