import { MapNode } from "./mapNode.js";
import { MapPath } from "./mapPath.js";
import { mapConfig } from "./mapConfig.js";


// ============================================================
// MAP GENERATOR
// ============================================================

export function generateMap(random, act, biome) {

    const map = {

        act: act,

        biome: biome,

        rows: mapConfig.rows,

        columns: mapConfig.columns,

        nodes: [],

        paths: [],

        boss: null

    };


    // --------------------------------------------------------
    // 1. Crear la cuadrícula
    // --------------------------------------------------------

    createGrid(map);


    // --------------------------------------------------------
    // 2. Crear las rutas
    // --------------------------------------------------------

    generatePaths(map, random);


    // --------------------------------------------------------
    // 3. Eliminar nodos que no forman parte del mapa
    // --------------------------------------------------------

    removeDisconnectedNodes(map);


    // --------------------------------------------------------
    // 4. Asignar tipos de habitación
    // --------------------------------------------------------

    assignNodeTypes(map, random);


    // --------------------------------------------------------
    // 5. Crear jefe
    // --------------------------------------------------------

    createBoss(map, random);


    return map;
}


// ============================================================
// CREAR GRID
// ============================================================

function createGrid(map) {

    let nodeId = 0;


    for (
        let row = 1;
        row <= map.rows;
        row++
    ) {

        for (
            let column = 0;
            column < map.columns;
            column++
        ) {

            const node = new MapNode(

                `node_${nodeId}`,

                row,

                column

            );


            map.nodes.push(node);


            nodeId++;

        }

    }

}


// ============================================================
// GENERAR CAMINOS
// ============================================================

function generatePaths(map, random) {

    const firstFloor =
        getNodesOnFloor(map, 1);


    // --------------------------------------------------------
    // Elegimos dos puntos iniciales diferentes
    // --------------------------------------------------------

    const startA =
        random.pick(firstFloor);


    let startB;


    do {

        startB =
            random.pick(firstFloor);

    }
    while (
        startB.id === startA.id
    );


    // --------------------------------------------------------
    // Guardamos los nodos que están actualmente activos
    // --------------------------------------------------------

    let activeNodes = [
        startA,
        startB
    ];


    let pathId = 0;


    // --------------------------------------------------------
    // Expandimos piso por piso
    // --------------------------------------------------------

    for (
        let floor = 1;
        floor < map.rows;
        floor++
    ) {

        const nextActiveNodes = [];


        for (
            const node of activeNodes
        ) {

            const candidates =
                getClosestNodes(
                    map,
                    node
                );


            const validCandidates =
                candidates.filter(
                    candidate =>
                        canCreatePath(
                            map,
                            node,
                            candidate
                        )
                );


            if (
                validCandidates.length === 0
            ) {

                continue;

            }


            // ------------------------------------------------
            // Elegimos un destino
            // ------------------------------------------------

            const destination =
                random.pick(
                    validCandidates
                );


            // ------------------------------------------------
            // Crear camino
            // ------------------------------------------------

            const path =
                createPath(
                    map,
                    node,
                    destination,
                    pathId
                );


            pathId++;


            map.paths.push(path);


            // ------------------------------------------------
            // El destino continúa siendo activo
            // ------------------------------------------------

            if (
                !nextActiveNodes.includes(
                    destination
                )
            ) {

                nextActiveNodes.push(
                    destination
                );

            }

        }


        activeNodes =
            nextActiveNodes;


        // ----------------------------------------------------
        // Si nos quedamos sin rutas, intentamos recuperar
        // ----------------------------------------------------

        if (
            activeNodes.length === 0
        ) {

            break;

        }

    }

}


// ============================================================
// OBTENER NODOS DE UN PISO
// ============================================================

function getNodesOnFloor(
    map,
    floor
) {

    return map.nodes.filter(
        node =>
            node.row === floor
    );

}


// ============================================================
// OBTENER LOS 3 NODOS MÁS CERCANOS
// ============================================================

function getClosestNodes(
    map,
    node
) {

    const nextFloor =
        node.row + 1;


    if (
        nextFloor > map.rows
    ) {

        return [];

    }


    const candidates =
        getNodesOnFloor(
            map,
            nextFloor
        );


    candidates.sort(
        (a, b) => {

            const distanceA =
                Math.abs(
                    a.column -
                    node.column
                );


            const distanceB =
                Math.abs(
                    b.column -
                    node.column
                );


            return distanceA - distanceB;

        }
    );


    return candidates.slice(
        0,
        mapConfig.maxDestinations
    );

}


// ============================================================
// COMPROBAR SI SE PUEDE CREAR UN CAMINO
// ============================================================

function canCreatePath(
    map,
    from,
    to
) {

    // --------------------------------------------------------
    // No conectar un nodo consigo mismo
    // --------------------------------------------------------

    if (
        from.id === to.id
    ) {

        return false;

    }


    // --------------------------------------------------------
    // No duplicar caminos
    // --------------------------------------------------------

    if (
        from.connections.includes(
            to.id
        )
    ) {

        return false;

    }


    // --------------------------------------------------------
    // Comprobar cruces
    // --------------------------------------------------------

    if (
        pathCrossesExistingPaths(
            map,
            from,
            to
        )
    ) {

        return false;

    }


    return true;

}


// ============================================================
// CREAR CAMINO
// ============================================================

function createPath(
    map,
    from,
    to,
    pathId
) {

    const path =
        new MapPath(

            `path_${pathId}`,

            from.id,

            to.id

        );


    from.addConnection(
        to.id
    );


    to.addIncomingConnection(
        from.id
    );


    return path;

}


// ============================================================
// COMPROBAR CRUCES
// ============================================================

function pathCrossesExistingPaths(
    map,
    from,
    to
) {

    for (
        const path of map.paths
    ) {

        const pathFrom =
            getNodeById(
                map,
                path.from
            );


        const pathTo =
            getNodeById(
                map,
                path.to
            );


        if (
            segmentsCross(
                from,
                to,
                pathFrom,
                pathTo
            )
        ) {

            return true;

        }

    }


    return false;

}


// ============================================================
// COMPROBAR INTERSECCIÓN
// ============================================================

function segmentsCross(
    a,
    b,
    c,
    d
) {

    // --------------------------------------------------------
    // Si comparten un extremo NO es un cruce
    // --------------------------------------------------------

    if (
        a.id === c.id ||
        a.id === d.id ||
        b.id === c.id ||
        b.id === d.id
    ) {

        return false;

    }


    const o1 =
        orientation(
            a,
            b,
            c
        );


    const o2 =
        orientation(
            a,
            b,
            d
        );


    const o3 =
        orientation(
            c,
            d,
            a
        );


    const o4 =
        orientation(
            c,
            d,
            b
        );


    return (
        o1 !== o2 &&
        o3 !== o4
    );

}


// ============================================================
// ORIENTACIÓN
// ============================================================

function orientation(
    a,
    b,
    c
) {

    const value =
        (b.column - a.column) *
        (c.row - a.row)
        -
        (b.row - a.row) *
        (c.column - a.column);


    if (value === 0) {

        return 0;

    }


    return value > 0
        ? 1
        : 2;

}


// ============================================================
// OBTENER NODO
// ============================================================

function getNodeById(
    map,
    id
) {

    return map.nodes.find(
        node =>
            node.id === id
    );

}


// ============================================================
// ELIMINAR NODOS DESCONECTADOS
// ============================================================

function removeDisconnectedNodes(
    map
) {

    map.nodes =
        map.nodes.filter(
            node => {

                return (
                    node.connections.length > 0 ||
                    node.incomingConnections.length > 0
                );

            }
        );


    // --------------------------------------------------------
    // Eliminar caminos que apuntan a nodos eliminados
    // --------------------------------------------------------

    const validIds =
        new Set(
            map.nodes.map(
                node => node.id
            )
        );


    map.paths =
        map.paths.filter(
            path => {

                return (
                    validIds.has(path.from) &&
                    validIds.has(path.to)
                );

            }
        );

}


// ============================================================
// ASIGNAR TIPOS
// ============================================================

function assignNodeTypes(
    map,
    random
) {

    for (
        const node of map.nodes
    ) {

        // ----------------------------------------------------
        // Piso 1 = combate
        // ----------------------------------------------------

        if (
            node.row === 1
        ) {

            node.type =
                "combat";

            continue;

        }


        // ----------------------------------------------------
        // Piso 9 = tesoro
        // ----------------------------------------------------

        if (
            node.row === 9
        ) {

            node.type =
                "treasure";

            continue;

        }


        // ----------------------------------------------------
        // Piso 15 = descanso
        // ----------------------------------------------------

        if (
            node.row === 15
        ) {

            node.type =
                "rest";

            continue;

        }


        // ----------------------------------------------------
        // Resto de habitaciones
        // ----------------------------------------------------

        node.type =
            generateRandomLocation(
                map,
                node,
                random
            );

    }

}


// ============================================================
// GENERAR UBICACIÓN ALEATORIA
// ============================================================

function generateRandomLocation(
    map,
    node,
    random
) {

    let attempts = 0;


    while (
        attempts < 100
    ) {

        attempts++;


        const type =
            rollLocation(
                random
            );


        if (
            isLocationAllowed(
                map,
                node,
                type
            )
        ) {

            return type;

        }

    }


    // --------------------------------------------------------
    // Fallback
    // --------------------------------------------------------

    return "combat";

}


// ============================================================
// TIRADA DE UBICACIÓN
// ============================================================

function rollLocation(
    random
) {

    const roll =
        random.int(
            1,
            100
        );


    if (roll <= 45) {

        return "combat";

    }


    if (roll <= 67) {

        return "event";

    }


    if (roll <= 83) {

        return "elite";

    }


    if (roll <= 95) {

        return "rest";

    }


    return "shop";

}


// ============================================================
// VALIDAR UBICACIÓN
// ============================================================

function isLocationAllowed(
    map,
    node,
    type
) {

    // --------------------------------------------------------
    // ELITE
    // --------------------------------------------------------

    if (
        type === "elite" &&
        node.row < 6
    ) {

        return false;

    }


    // --------------------------------------------------------
    // REST
    // --------------------------------------------------------

    if (
        type === "rest"
    ) {

        if (
            node.row < 6
        ) {

            return false;

        }


        if (
            node.row === 14
        ) {

            return false;

        }

    }


    // --------------------------------------------------------
    // TIPOS QUE NO PUEDEN SER CONSECUTIVOS
    // --------------------------------------------------------

    const restrictedTypes = [
        "elite",
        "rest",
        "shop"
    ];


    if (
        restrictedTypes.includes(
            type
        )
    ) {

        // --------------------------------------------
        // Nodos anteriores
        // --------------------------------------------

        for (
            const nodeId
            of node.incomingConnections
        ) {

            const previous =
                getNodeById(
                    map,
                    nodeId
                );


            if (
                previous &&
                restrictedTypes.includes(
                    previous.type
                )
            ) {

                return false;

            }

        }


        // --------------------------------------------
        // Nodos posteriores
        // --------------------------------------------

        for (
            const nodeId
            of node.connections
        ) {

            const next =
                getNodeById(
                    map,
                    nodeId
                );


            if (
                next &&
                next.type &&
                restrictedTypes.includes(
                    next.type
                )
            ) {

                return false;

            }

        }

    }


    return true;

}


// ============================================================
// CREAR JEFE
// ============================================================

function createBoss(
    map,
    random
) {

    const bosses = [
        "boss_001",
        "boss_002",
        "boss_003"
    ];


    const bossId =
        random.pick(
            bosses
        );


    map.boss = {

        id: bossId,

        connections: []

    };


    // --------------------------------------------------------
    // Conectar todas las habitaciones del piso 15
    // --------------------------------------------------------

    const finalNodes =
        map.nodes.filter(
            node =>
                node.row === 15
        );


    for (
        const node of finalNodes
    ) {

        node.addConnection(
            "boss"
        );


        map.boss.connections.push(
            node.id
        );

    }

}