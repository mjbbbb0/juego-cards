export const mapConfig = {

    rows: 15,

    columns: 7,

    startingRooms: 6,

    maxDestinations: 3,

    locationOdds: {
        combat: 45,
        event: 22,
        elite: 16,
        rest: 12,
        shop: 5,
        chest: 0
    },

    specialFloors: {
        combat: 1,
        treasure: 9,
        rest: 15
    },

    restrictions: {
        eliteFromFloor: 6,
        restFromFloor: 6,
        restForbiddenFloor: 14
    }

};