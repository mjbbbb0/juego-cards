import { gameState } from "../gameState.js";
import { showScreen } from "./screenManager.js";
import { createMenuScreen } from "./menuScreen.js";
import { createMapScreen } from "./mapScreen.js";


// ========================================
// CREAR PANTALLA DE SELECCIÓN
// ========================================

export function createCharacterSelectScreen() {

    const screen = document.createElement("div");

    screen.id = "character-select-screen";
    screen.classList.add("screen");

    screen.innerHTML = `

        <h1>Elige tu personaje</h1>

        <div id="characters-container">
            <p>Cargando personajes...</p>
        </div>

        <button id="back-to-menu">
            Volver
        </button>

    `;


    // ========================================
    // BOTÓN VOLVER
    // ========================================

    screen
        .querySelector("#back-to-menu")
        .addEventListener("click", () => {

            showScreen(
                createMenuScreen()
            );

        });


    // ========================================
    // CARGAR PERSONAJES
    // ========================================

    loadCharacters(screen);


    return screen;
}


// ========================================
// CARGAR CHARACTERS.JSON
// ========================================

async function loadCharacters(screen) {

    try {

        const response = await fetch(
            "./data/characters.json"
        );


        if (!response.ok) {

            throw new Error(
                "No se pudo cargar characters.json"
            );

        }


        const data = await response.json();


        renderCharacters(
            screen,
            data.characters
        );


    } catch (error) {

        console.error(
            "Error cargando personajes:",
            error
        );


        const container =
            screen.querySelector(
                "#characters-container"
            );


        container.innerHTML = `
            <p>
                No se pudieron cargar los personajes.
            </p>
        `;

    }

}


// ========================================
// MOSTRAR PERSONAJES
// ========================================

function renderCharacters(
    screen,
    characters
) {

    const container =
        screen.querySelector(
            "#characters-container"
        );


    container.innerHTML = "";


    characters.forEach(character => {

        const card =
            createCharacterCard(character);


        container.appendChild(card);

    });

}


// ========================================
// CREAR TARJETA DE PERSONAJE
// ========================================

function createCharacterCard(character) {

    const card =
        document.createElement("div");


    card.classList.add(
        "character-card"
    );


    card.innerHTML = `

        <h2>
            ${character.name}
        </h2>

        <p>
            ${character.description}
        </p>

        <p>
            Color: ${character.color}
        </p>

        <p>
            Vida: ${character.maxHp}
        </p>

        <button class="select-character">
            Elegir
        </button>

    `;


    // ========================================
    // BOTÓN ELEGIR
    // ========================================

    card
        .querySelector(".select-character")
        .addEventListener("click", () => {

            selectCharacter(character);

        });


    return card;
}


// ========================================
// SELECCIONAR PERSONAJE
// ========================================

function selectCharacter(character) {

    // Guardamos el personaje en el estado
    gameState.player = {

        id: character.id,

        name: character.name,

        description: character.description,

        color: character.color,

        hp: character.maxHp,

        maxHp: character.maxHp

    };


    console.log(
        "Personaje seleccionado:",
        gameState.player
    );


    // ========================================
    // PASAR AL MAPA
    // ========================================

    showScreen(
        createMapScreen()
    );

}