import { MapNode } from "./mapNode.js";
import { mapConfig } from "./mapConfig.js";


// ============================================================
// MAP GENERATOR
// ============================================================
//
// El mapa NO genera su propia seed.
//
// Recibe un Random ya inicializado con la seed de la partida:
//
// const random = new Random(gameState.seed);
//
// generateMap(random, act, biome);
//
// ============================================================


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

        boss: null

    };


    // --------------------------------------------------------
    // 1. Crear Grid 7 x 15
    // --------------------------------------------------------

    createGrid(map);


    // --------------------------------------------------------
    // 2. Generar las 6 rutas
    // --------------------------------------------------------

    generatePaths(
        map,
        random
    );


    // --------------------------------------------------------
    // 3. Eliminar habitaciones que no tienen caminos
    // --------------------------------------------------------

    removeDisconnectedNodes(map);


    // --------------------------------------------------------
    // 4. Asignar localizaciones
    // --------------------------------------------------------

    assignNodeTypes(
        map,
        random
    );


    // --------------------------------------------------------
    // 5. Crear Boss
    // --------------------------------------------------------

    createBoss(
        map,
        random
    );


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

            const node =
                new MapNode(

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
// GENERAR LAS 6 RUTAS
// ============================================================

function generatePaths(
    map,
    random
) {

    const firstFloor =
        getNodesOnFloor(
            map,
            1
        );


    const generationCount =
        Math.min(
            mapConfig.startingRooms,
            firstFloor.length
        );


    // ========================================================
    // ELEGIR HABITACIONES INICIALES
    // ========================================================

    const startingNodes = [];


    while (
        startingNodes.length <
        generationCount
    ) {

        const node =
            random.pick(
                firstFloor
            );


        // Las habitaciones iniciales
        // son diferentes.

        if (
            !startingNodes.includes(
                node
            )
        ) {

            startingNodes.push(
                node
            );

        }

    }


    // ========================================================
    // CADA HABITACIÓN INICIAL CREA UNA GENERACIÓN
    // ========================================================

    for (
        const startNode
        of startingNodes
    ) {

        generatePathFromStart(
            map,
            startNode,
            random
        );

    }

}


// ============================================================
// GENERAR UNA RUTA COMPLETA
// ============================================================

function generatePathFromStart(
    map,
    startNode,
    random
) {

    let currentNode =
        startNode;


    for (
        let floor = 1;
        floor < map.rows;
        floor++
    ) {

        const candidates =
            getClosestNodes(
                map,
                currentNode
            );


        const validCandidates =
            candidates.filter(
                candidate =>
                    canCreatePath(
                        map,
                        currentNode,
                        candidate
                    )
            );


        // ----------------------------------------------------
        // Si no encontramos camino directo,
        // buscamos cualquier candidato válido del siguiente piso.
        // ----------------------------------------------------

        let destination;


        if (
            validCandidates.length > 0
        ) {

            destination =
                random.pick(
                    validCandidates
                );

        }

        else {

            const fallbackCandidates =
                getNodesOnFloor(
                    map,
                    floor + 1
                ).filter(
                    candidate =>
                        canCreatePath(
                            map,
                            currentNode,
                            candidate
                        )
                );


            if (
                fallbackCandidates.length === 0
            ) {

                // Esta generación no puede continuar.

                return;

            }


            destination =
                random.pick(
                    fallbackCandidates
                );

        }


        createPath(
            currentNode,
            destination
        );


        currentNode =
            destination;

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
// COMPROBAR SI SE PUEDE CREAR CAMINO
// ============================================================

function canCreatePath(
    map,
    from,
    to
) {

    // No conectarse consigo mismo.

    if (
        from.id === to.id
    ) {

        return false;

    }


    // No duplicar conexión.

    if (
        from.connections.includes(
            to.id
        )
    ) {

        return false;

    }


    // Los caminos no pueden cruzarse.

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
    from,
    to
) {

    from.addConnection(
        to.id
    );


    to.addIncomingConnection(
        from.id
    );

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
        const node
        of map.nodes
    ) {

        for (
            const destinationId
            of node.connections
        ) {

            if (
                destinationId === "boss"
            ) {

                continue;

            }


            const pathFrom =
                node;


            const pathTo =
                getNodeById(
                    map,
                    destinationId
                );


            if (!pathTo) {

                continue;

            }


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

    // Compartir un nodo NO cuenta como cruce.

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
        (
            b.column -
            a.column
        ) *
        (
            c.row -
            a.row
        )
        -
        (
            b.row -
            a.row
        ) *
        (
            c.column -
            a.column
        );


    if (
        value === 0
    ) {

        return 0;

    }


    return value > 0
        ? 1
        : 2;

}


// ============================================================
// BUSCAR NODO
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

}


// ============================================================
// ASIGNAR TIPOS
// ============================================================

function assignNodeTypes(
    map,
    random
) {

    // --------------------------------------------------------
    // Primero asignamos las posiciones obligatorias.
    // --------------------------------------------------------

    for (
        const node
        of map.nodes
    ) {

        // Piso 1 = combate

        if (
            node.row ===
            mapConfig.specialFloors.combat
        ) {

            node.type =
                "combat";

            continue;

        }


        // Piso 9 = tesoro

        if (
            node.row ===
            mapConfig.specialFloors.treasure
        ) {

            node.type =
                "treasure";

            continue;

        }


        // Piso 15 = descanso

        if (
            node.row ===
            mapConfig.specialFloors.rest
        ) {

            node.type =
                "rest";

        }

    }


    // --------------------------------------------------------
    // Después asignamos el resto.
    // --------------------------------------------------------

    for (
        const node
        of map.nodes
    ) {

        if (
            node.type !== null
        ) {

            continue;

        }


        node.type =
            generateRandomLocation(
                map,
                node,
                random
            );

    }

}


// ============================================================
// GENERAR LOCALIZACIÓN
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


    // Si después de 100 intentos no
    // encontramos una opción válida,
    // usamos combate.

    return "combat";

}


// ============================================================
// TIRADA DE LOCALIZACIÓN
// ============================================================

function rollLocation(
    random
) {

    const roll =
        random.nextInt(
            1,
            100
        );


    let total = 0;


    // Combat 45%

    total +=
        mapConfig.locationOdds.combat;


    if (
        roll <= total
    ) {

        return "combat";

    }


    // Event 22%

    total +=
        mapConfig.locationOdds.event;


    if (
        roll <= total
    ) {

        return "event";

    }


    // Elite 16%

    total +=
        mapConfig.locationOdds.elite;


    if (
        roll <= total
    ) {

        return "elite";

    }


    // Rest 12%

    total +=
        mapConfig.locationOdds.rest;


    if (
        roll <= total
    ) {

        return "rest";

    }


    // Shop 5%

    total +=
        mapConfig.locationOdds.shop;


    if (
        roll <= total
    ) {

        return "shop";

    }


    // Chest 0%

    return "chest";

}


// ============================================================
// COMPROBAR RESTRICCIONES
// ============================================================

function isLocationAllowed(
    map,
    node,
    type
) {

    const restrictions =
        mapConfig.restrictions;


    // --------------------------------------------------------
    // ELITE NO PUEDE ESTAR ANTES DEL PISO 6
    // --------------------------------------------------------

    if (
        type === "elite" &&
        node.row <
        restrictions.eliteFromFloor
    ) {

        return false;

    }


    // --------------------------------------------------------
    // REST NO PUEDE ESTAR ANTES DEL PISO 6
    // --------------------------------------------------------

    if (
        type === "rest"
    ) {

        if (
            node.row <
            restrictions.restFromFloor
        ) {

            return false;

        }


        // Rest prohibido en piso 14.

        if (
            node.row ===
            restrictions.restForbiddenFloor
        ) {

            return false;

        }

    }


    // --------------------------------------------------------
    // ELITE / SHOP / REST
    // NO PUEDEN SER CONSECUTIVOS
    // --------------------------------------------------------

    const restrictedTypes = [

        "elite",
        "shop",
        "rest"

    ];


    if (
        restrictedTypes.includes(
            type
        )
    ) {

        for (
            const previousId
            of node.incomingConnections
        ) {

            const previous =
                getNodeById(
                    map,
                    previousId
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

    }


    // --------------------------------------------------------
    // DESTINOS ÚNICOS
    // --------------------------------------------------------
    //
    // Si el nodo tiene varias salidas,
    // los destinos no pueden compartir
    // la misma localización.
    //
    // En este punto algunos destinos
    // todavía pueden no tener tipo,
    // por eso solo comprobamos los
    // que ya están asignados.
    //

    if (
        node.connections.length >= 2
    ) {

        const usedTypes = [];


        for (
            const destinationId
            of node.connections
        ) {

            const destination =
                getNodeById(
                    map,
                    destinationId
                );


            if (
                !destination ||
                !destination.type
            ) {

                continue;

            }


            if (
                usedTypes.includes(
                    destination.type
                )
            ) {

                return false;

            }


            usedTypes.push(
                destination.type
            );

        }


        // El propio tipo elegido no puede
        // coincidir con un destino.

        if (
            usedTypes.includes(
                type
            )
        ) {

            return false;

        }

    }


    return true;

}


// ============================================================
// CREAR BOSS
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
    // Todos los nodos del piso 15
    // conectan con el Boss.
    // --------------------------------------------------------

    const finalNodes =
        map.nodes.filter(
            node =>
                node.row === 15
        );


    for (
        const node
        of finalNodes
    ) {

        node.addConnection(
            "boss"
        );


        map.boss.connections.push(
            node.id
        );

    }

}