import { gameState } from "../gameState.js";
import { showScreen } from "./screenManager.js";


// ========================================
// CREAR PANTALLA
// ========================================

export function createCharacterSelectScreen() {

    const screen = document.createElement("div");

    screen.id = "character-select-screen";

    screen.classList.add("screen");


    screen.innerHTML = `

        <h2>Elige tu personaje</h2>

        <div id="characters-container">
            Cargando personajes...
        </div>

        <button id="back-to-menu">
            Volver
        </button>

    `;


    // Botón volver

    screen
        .querySelector("#back-to-menu")
        .addEventListener("click", () => {

            showScreen(createMenuScreen());

        });


    // Cargar personajes

    loadCharacters(screen);


    return screen;
}


// ========================================
// CARGAR JSON
// ========================================

async function loadCharacters(screen) {

    try {

        const response =
            await fetch("./data/characters.json");


        if (!response.ok) {

            throw new Error(
                "No se pudo cargar characters.json"
            );

        }


        const data =
            await response.json();


        renderCharacters(
            screen,
            data.characters
        );


    } catch (error) {

        console.error(error);

        const container =
            screen.querySelector(
                "#characters-container"
            );


        container.innerHTML = `
            <p>
                Error cargando los personajes.
            </p>
        `;

    }
}


// ========================================
// MOSTRAR PERSONAJES
// ========================================

function renderCharacters(screen, characters) {

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
// CREAR TARJETA
// ========================================

function createCharacterCard(character) {

    const card =
        document.createElement("div");


    card.classList.add(
        "character-card"
    );


    card.innerHTML = `

        <h3>
            ${character.name}
        </h3>

        <p>
            ${character.description}
        </p>

        <p>
            Color: ${character.color}
        </p>

        <p>
            Vida: ${character.maxHp}
        </p>

        <button>
            Elegir
        </button>

    `;


    card
        .querySelector("button")
        .addEventListener(
            "click",
            () => selectCharacter(character)
        );


    return card;
}


// ========================================
// SELECCIONAR PERSONAJE
// ========================================

function selectCharacter(character) {

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


    // De momento nos quedamos aquí.
    // Más adelante:
    //
    // showScreen(createMapScreen());

}