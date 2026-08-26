// ============================================================
// BOSS GENERATOR
// ============================================================
//
// Selecciona un jefe de forma determinista mediante la seed
// y conecta todos los nodos del último piso con él.
//
// ============================================================


export function generateBoss(
    map,
    random
) {

    // ========================================================
    // 1. Lista de jefes disponibles
    // ========================================================

    const bosses = [

        "boss_001",

        "boss_002",

        "boss_003"

    ];


    // ========================================================
    // 2. Elegir jefe mediante la seed
    // ========================================================

    const bossId =
        random.pick(
            bosses
        );


    // ========================================================
    // 3. Crear Boss Room
    // ========================================================

    map.boss = {

        id: bossId,

        connections: []

    };


    // ========================================================
    // 4. Obtener nodos del último piso
    // ========================================================

    const finalFloor =
        map.nodes.filter(
            node =>
                node.row === map.rows
        );


    // ========================================================
    // 5. Conectar todos los nodos del último piso al jefe
    // ========================================================

    for (
        const node of finalFloor
    ) {

        // ----------------------------------------------------
        // Evitar conexiones duplicadas
        // ----------------------------------------------------

        if (
            !node.connections.includes(
                "boss"
            )
        ) {

            node.addConnection(
                "boss"
            );

        }


        // ----------------------------------------------------
        // Registrar el nodo conectado al jefe
        // ----------------------------------------------------

        if (
            !map.boss.connections.includes(
                node.id
            )
        ) {

            map.boss.connections.push(
                node.id
            );

        }

    }


    // ========================================================
    // 6. Devolver mapa
    // ========================================================

    return map;

}
