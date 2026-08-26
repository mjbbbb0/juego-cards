// Genera una seed nueva para una partida
export function generateRunSeed() {

    const array = new Uint32Array(1);

    crypto.getRandomValues(array);

    return array[0];
}
