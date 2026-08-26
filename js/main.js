import { ScreenManager } from "./screens/ScreenManager.js";
import { MenuScreen } from "./screens/menuScreen.js";

const app = document.getElementById("app");

const screenManager = new ScreenManager(app);

const menuScreen = new MenuScreen(screenManager);

screenManager.show(menuScreen);