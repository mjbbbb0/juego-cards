import { generateGrid } from "./generators/gridGenerator.js";
import { generatePaths } from "./generators/pathGenerator.js";
import { cleanNodes } from "./generators/nodeCleaner.js";
import { mapConfig } from "./mapConfig.js";


export function generateMap(
    random,
    act,
    biome
) {

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
    // CREAR CAMINOS
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


    return map;

}