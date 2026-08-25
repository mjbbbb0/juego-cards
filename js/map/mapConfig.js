export const mapConfig = {

    rows: 15,

    columns: 7,


    // Habitaciones iniciales
    startingRooms: 6,


    // Número de destinos posibles
    maxNextRooms: 3,


    // Probabilidades
    locationOdds: {

        combat: 45,
        event: 22,
        elite: 16,
        rest: 12,
        shop: 5,
        chest: 0

    },


    // Pisos especiales

    treasureFloor: 9,

    restFloor: 15,


    // No puede haber estos tipos
    // antes del piso indicado

    minimumEliteFloor: 6,

    minimumRestFloor: 6,


    // Descanso no permitido aquí

    restForbiddenFloor: 14,


    // Tipos que no pueden ser consecutivos

    nonConsecutiveTypes: [

        "elite",
        "shop",
        "rest"

    ]

};