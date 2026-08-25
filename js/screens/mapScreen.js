export function createMapScreen() {

    const screen = document.createElement("div");

    screen.id = "map-screen";
    screen.classList.add("screen");

    screen.innerHTML = `

        <h1>Mapa</h1>

        <p>Bienvenido a la aventura.</p>

        <div id="map-container">
            <!-- Aquí construiremos el mapa -->
        </div>

    `;

    return screen;
}