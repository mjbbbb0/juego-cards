import { generateGrid } from "./generators/gridGenerator.js";
import { generatePaths } from "./generators/pathGenerator.js";
import { cleanNodes } from "./generators/nodeCleaner.js";
import { generateLocations } from "./generators/locationGenerator.js";
import { generateBoss } from "./generators/bossGenerator.js";

import { mapConfig } from "./mapConfig.js";


// ============================================================
// MAP GENERATOR
// ============================================================

export function generateMap(
    random,
    act,
    biome
) {

    // ========================================================
    // MAPA BASE
    // ========================================================

    const map = {

        act: act,

        biome: biome,

        rows: mapConfig.rows,

        columns: mapConfig.columns,

        nodes: [],

        paths: [],

        boss: null

    };


    // ========================================================
    // PASO 1
    // CREAR GRID
    // ========================================================

    generateGrid(
        map
    );


    // ========================================================
    // PASO 2
    // GENERAR PATHS
    // ========================================================

    generatePaths(
        map,
        random
    );


    // ========================================================
    // PASO 3
    // ELIMINAR NODOS DESCONECTADOS
    // ========================================================

    cleanNodes(
        map
    );


    // ========================================================
    // PASO 4
    // ASIGNAR LOCATIONS
    // ========================================================

    generateLocations(
        map,
        random
    );


    // ========================================================
    // PASO 5
    // GENERAR BOSS
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