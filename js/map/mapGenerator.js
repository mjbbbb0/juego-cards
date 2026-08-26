import { generateGrid } from "./generators/gridGenerator.js";
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


    return map;

}