export class ScreenManager {

    constructor(container) {

        this.container = container;

        this.currentScreen = null;

    }


    show(screen) {

        this.currentScreen = screen;

        screen.render(this.container);

    }

}