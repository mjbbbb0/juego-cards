import { generateGrid } from "./generators/gridGenerator.js";


export function generateMap(
    random,
    act,
    biome
) {

    const map = {

        act: act,

        biome: biome,

        rows: 15,

        columns: 7,

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