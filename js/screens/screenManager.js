export class ScreenManager {

    constructor(container) {

        this.container = container;

        this.currentScreen = null;

    }


    show(screen) {

        this.currentScreen = screen;

        this.container.innerHTML = "";

        screen.render(this.container);

    }

}