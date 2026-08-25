import { gameState } from "../gameState.js";

import { showScreen } from "./screenManager.js";

import { createMenuScreen } from "./menuScreen.js";


export function createCharacterSelectScreen() {

    const screen =
        document.createElement("div");


    screen.id =
        "character-select-screen";


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


    screen
        .querySelector("#back-to-menu")
        .addEventListener("click", () => {

            showScreen(
                createMenuScreen()
            );

        });


    loadCharacters(screen);


    return screen;
}


// ========================================
// CARGAR PERSONAJES
// ========================================

async function loadCharacters(screen) {

    try {

        const response =
            await fetch(
                "./data/characters.json"
            );


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

        screen.querySelector(
            "#characters-container"
        ).innerHTML = `
            <p>
                Error cargando personajes.
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

        container.appendChild(
            createCharacterCard(character)
        );

    });

}


// ========================================
// TARJETA
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
            ❤️ ${character.maxHp}
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
// SELECCIONAR
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

}