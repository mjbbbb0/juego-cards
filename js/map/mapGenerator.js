import { generateGrid } from "./generators/gridGenerator.js";
import { generatePaths } from "./generators/pathGenerator.js";
import { cleanNodes } from "./generators/nodeCleaner.js";
import { generateLocations } from "./generators/locationGenerator.js";
import { generateBoss } from "./generators/bossGenerator.js";
import { generateBiome } from "./generators/biomeGenerator.js";

import { mapConfig } from "./mapConfig.js";


// ============================================================
// MAP GENERATOR
// ============================================================
//
// Orden de generación:
//
// 1. Seleccionar bioma
// 2. Crear Grid
// 3. Crear Paths
// 4. Limpiar nodos desconectados
// 5. Asignar Locations
// 6. Crear Boss
//
// MapGenerator NO contiene las reglas internas de cada paso.
// Solamente coordina los diferentes generadores.
//
// ============================================================


export function generateMap(
    random,
    act
) {

    // ========================================================
    // COMPROBAR ACTO
    // ========================================================

    if (
        !mapConfig.acts[act]
    ) {

        throw new Error(
            `El acto ${act} no existe en mapConfig.`
        );

    }


    // ========================================================
    // PASO 1
    // SELECCIONAR BIOMA
    // ========================================================
    //
    // El bioma se selecciona mediante el RNG basado en seed.
    //
    // Ejemplo:
    //
    // Acto 1 → bosque
    // Acto 2 → ciudad
    // Acto 3 → infierno
    //
    // La misma seed siempre produce el mismo resultado.
    //
    // ========================================================

    const biome =
        generateBiome(
            act,
            random
        );


    // ========================================================
    // CREAR ESTRUCTURA BASE DEL MAPA
    // ========================================================

    const map = {

        // ----------------------------------------------------
        // Información del mapa
        // ----------------------------------------------------

        act: act,

        biome: biome,


        // ----------------------------------------------------
        // Tamaño
        // ----------------------------------------------------

        rows:
            mapConfig.rows,

        columns:
            mapConfig.columns,


        // ----------------------------------------------------
        // Nodos
        // ----------------------------------------------------

        nodes: [],


        // ----------------------------------------------------
        // Caminos
        // ----------------------------------------------------

        paths: [],


        // ----------------------------------------------------
        // Boss
        // ----------------------------------------------------

        boss: null

    };


    // ========================================================
    // PASO 2
    // CREAR GRID
    // ========================================================

    generateGrid(
        map
    );


    // ========================================================
    // PASO 3
    // GENERAR PATHS
    // ========================================================
    //
    // Utiliza el mismo RNG, por lo que toda la generación
    // continúa dependiendo de la seed.
    //
    // ========================================================

    generatePaths(
        map,
        random
    );


    // ========================================================
    // PASO 4
    // ELIMINAR NODOS DESCONECTADOS
    // ========================================================

    cleanNodes(
        map
    );


    // ========================================================
    // PASO 5
    // ASIGNAR LOCATIONS
    // ========================================================
    //
    // También utiliza el RNG de la seed.
    //
    // ========================================================

    generateLocations(
        map,
        random
    );


    // ========================================================
    // PASO 6
    // CREAR BOSS
    // ========================================================

    generateBoss(
        map,
        random
    );


    // ========================================================
    // DEVOLVER MAPA COMPLETO
    // ========================================================

    return map;

}