export class ScreenManager {

    constructor(container) {

        this.container = container;

        this.currentScreen = null;

    }


    show(screen) {

        // Si hay una pantalla anterior,
        // le damos la oportunidad de limpiarse.

        if (this.currentScreen) {

            if (this.currentScreen.destroy) {

                this.currentScreen.destroy();

            }

        }


        // Guardamos la nueva pantalla

        this.currentScreen = screen;


        // Limpiamos el contenedor

        this.container.innerHTML = "";


        // Dibujamos la nueva pantalla

        this.currentScreen.render(
            this.container
        );

    }

}