import { mapConfig } from "../mapConfig.js";


// ============================================================
// BIOME GENERATOR
// ============================================================
//
// Selecciona el bioma de cada acto utilizando el RNG basado
// en la seed.
//
// Cada acto tiene sus propios biomas:
//
// Acto 1 → bosque / mar
// Acto 2 → desierto / ciudad
// Acto 3 → fortaleza / infierno
//
// La misma seed siempre producirá los mismos biomas.
//
// ============================================================


// ============================================================
// GENERAR BIOMA DE UN ACTO
// ============================================================

export function generateBiome(
    act,
    random
) {

    const actConfig =
        mapConfig.acts[act];


    // ========================================================
    // Comprobar que el acto existe
    // ========================================================

    if (
        !actConfig
    ) {

        throw new Error(
            `El acto ${act} no existe en mapConfig.`
        );

    }


    // ========================================================
    // Obtener los biomas disponibles
    // ========================================================

    const biomes =
        actConfig.biomes;


    // ========================================================
    // Comprobar que existen biomas
    // ========================================================

    if (
        !biomes ||
        biomes.length === 0
    ) {

        throw new Error(
            `El acto ${act} no tiene biomas configurados.`
        );

    }


    // ========================================================
    // Elegir bioma mediante el RNG
    // ========================================================

    const biome =
        random.pick(
            biomes
        );


    return biome;

}


// ============================================================
// GENERAR TODOS LOS BIOMAS DE LA PARTIDA
// ============================================================
//
// Devuelve:
//
// {
//     1: "bosque",
//     2: "ciudad",
//     3: "fortaleza"
// }
//
// La selección depende completamente de la seed.
//
// ============================================================

export function generateAllBiomes(
    random
) {

    const biomes = {};


    const acts =
        Object.keys(
            mapConfig.acts
        );


    for (
        const act of acts
    ) {

        const actNumber =
            Number(
                act
            );


        biomes[actNumber] =
            generateBiome(
                actNumber,
                random
            );

    }


    return biomes;

}