export const mapConfig = {

    // ========================================================
    // CONFIGURACIÓN DEL MAPA
    // ========================================================

    rows: 15,

    columns: 7,

    startingRooms: 6,

    maxDestinations: 3,


    // ========================================================
    // BIOMAS DE CADA ACTO
    // ========================================================

    acts: {

        1: {

            biomes: [
                "bosque",
                "mar"
            ]

        },


        2: {

            biomes: [
                "desierto",
                "ciudad",
            ]

        },


        3: {

            biomes: [
                "fortaleza",
                "infierno",
            ]

        }

    },


    // ========================================================
    // PROBABILIDADES DE LOCALIZACIÓN
    // ========================================================

    locationOdds: {

        combat: 45,

        event: 22,

        elite: 16,

        rest: 12,

        shop: 5,

        chest: 0

    },


    // ========================================================
    // PISOS ESPECIALES
    // ========================================================

    specialFloors: {

        combat: 1,

        treasure: 9,

        rest: 15

    },


    // ========================================================
    // RESTRICCIONES
    // ========================================================

    restrictions: {

        eliteFromFloor: 6,

        restFromFloor: 6,

        restForbiddenFloor: 14

    }

};