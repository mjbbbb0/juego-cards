// ========================================
// RANDOM DETERMINISTA
// ========================================

export function createRandom(seed) {

    let state = seed >>> 0;


    // Genera un número entre 0 y 1
    function next() {

        state += 0x6D2B79F5;

        let t = state;

        t = Math.imul(
            t ^ (t >>> 15),
            t | 1
        );

        t ^= t +
            Math.imul(
                t ^ (t >>> 7),
                t | 61
            );

        return (
            (t ^ (t >>> 14)) >>> 0
        ) / 4294967296;

    }


    // Genera un entero entre min y max
    function int(min, max) {

        return Math.floor(
            next() * (max - min + 1)
        ) + min;

    }


    // Elige un elemento de un array
    function pick(array) {

        if (array.length === 0) {
            return undefined;
        }

        return array[
            int(0, array.length - 1)
        ];

    }


    return {
        next,
        int,
        pick
    };

}