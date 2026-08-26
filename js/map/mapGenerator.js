import { MapNode } from "./mapNode.js";
import { mapConfig } from "./mapConfig.js";


// ============================================================
// MAP GENERATOR
// ============================================================
//
// IMPORTANTE:
//
// MapGenerator NO genera una seed.
//
// Recibe un Random que ya ha sido creado con la seed de la
// partida.
//
// Ejemplo:
//
// const random = new Random(gameState.seed);
//
// const map = generateMap(
//     random,
//     gameState.currentAct,
//     gameState.currentBiome
// );
//
// ============================================================


// ============================================================
// GENERAR MAPA
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
    // 1. Crear Grid
    // --------------------------------------------------------

    createGrid(map);


    // --------------------------------------------------------
    // 2. Generar las rutas
    // --------------------------------------------------------

    generatePaths(
        map,
        random
    );


    // --------------------------------------------------------
    // 3. Eliminar nodos que no forman parte de ninguna ruta
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


    // --------------------------------------------------------
    // 6. Validar mapa
    // --------------------------------------------------------

    const validation =
        validateMap(map);


    map.valid =
        validation.valid;


    map.validationErrors =
        validation.errors;


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
// GENERAR RUTAS
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


    // --------------------------------------------------------
    // Elegir habitaciones iniciales diferentes
    // --------------------------------------------------------

    const startingNodes = [];


    while (
        startingNodes.length <
        generationCount
    ) {

        const node =
            random.pick(
                firstFloor
            );


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


    // --------------------------------------------------------
    // Cada habitación inicial genera una ruta
    // --------------------------------------------------------

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


        let destination = null;


        // ----------------------------------------------------
        // Primero intentamos utilizar los 3 más cercanos.
        // ----------------------------------------------------

        if (
            validCandidates.length > 0
        ) {

            destination =
                random.pick(
                    validCandidates
                );

        }


        // ----------------------------------------------------
        // Si todos cruzan otro camino, intentamos cualquier
        // habitación disponible del siguiente piso.
        // ----------------------------------------------------

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
                fallbackCandidates.length > 0
            ) {

                destination =
                    random.pick(
                        fallbackCandidates
                    );

            }

        }


        // ----------------------------------------------------
        // Si no existe ningún camino posible, esta ruta muere.
        // ----------------------------------------------------

        if (
            !destination
        ) {

            return false;

        }


        createPath(
            currentNode,
            destination
        );


        currentNode =
            destination;

    }


    return true;

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


    // --------------------------------------------------------
    // Ordenar por distancia horizontal
    // --------------------------------------------------------

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

    // No conectar consigo mismo.

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


    // No cruzar caminos existentes.

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

            // El boss no es un camino normal.

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


            if (
                !pathTo
            ) {

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

    // Compartir un extremo no es un cruce.

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
// ASIGNAR LOCALIZACIONES
// ============================================================

function assignNodeTypes(
    map,
    random
) {

    // --------------------------------------------------------
    // Primero localizaciones obligatorias
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
    // Asignar el resto por pisos
    // --------------------------------------------------------

    for (
        let floor = 1;
        floor <= map.rows;
        floor++
    ) {

        const nodes =
            getNodesOnFloor(
                map,
                floor
            );


        for (
            const node
            of nodes
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

}


// ============================================================
// GENERAR LOCALIZACIÓN ALEATORIA
// ============================================================

function generateRandomLocation(
    map,
    node,
    random
) {

    const maxAttempts = 100;


    for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
    ) {

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

    const fallbackTypes = [

        "combat",
        "event",
        "elite",
        "rest",
        "shop",
        "chest"

    ];


    for (
        const type
        of fallbackTypes
    ) {

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
// COMPROBAR LOCALIZACIÓN
// ============================================================

function isLocationAllowed(
    map,
    node,
    type
) {

    const restrictions =
        mapConfig.restrictions;


    // ========================================================
    // ELITE
    // ========================================================

    if (
        type === "elite" &&
        node.row <
        restrictions.eliteFromFloor
    ) {

        return false;

    }


    // ========================================================
    // REST
    // ========================================================

    if (
        type === "rest"
    ) {

        if (
            node.row <
            restrictions.restFromFloor
        ) {

            return false;

        }


        if (
            node.row ===
            restrictions.restForbiddenFloor
        ) {

            return false;

        }

    }


    // ========================================================
    // ELITE / SHOP / REST CONSECUTIVOS
    // ========================================================

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


    // ========================================================
    // DESTINOS ÚNICOS
    // ========================================================
    //
    // Si el nodo tiene varias salidas:
    //
    //          NODE
    //          /  \
    //         /    \
    //      Elite  Event
    //
    // válido.
    //
    //          NODE
    //          /  \
    //         /    \
    //      Elite  Elite
    //
    // inválido.
    //
    // ========================================================

    if (
        node.connections.length >= 2
    ) {

        const destinationTypes = [];


        for (
            const destinationId
            of node.connections
        ) {

            if (
                destinationId === "boss"
            ) {

                continue;

            }


            const destination =
                getNodeById(
                    map,
                    destinationId
                );


            if (
                !destination
            ) {

                continue;

            }


            if (
                !destination.type
            ) {

                continue;

            }


            if (
                destinationTypes.includes(
                    destination.type
                )
            ) {

                return false;

            }


            destinationTypes.push(
                destination.type
            );

        }


        if (
            destinationTypes.includes(
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
    // Todos los nodos del piso 15 conectan con el Boss.
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


// ============================================================
// VALIDAR MAPA
// ============================================================

function validateMap(
    map
) {

    const errors = [];


    // ========================================================
    // Debe existir al menos 2 nodos en el piso 1
    // ========================================================

    const firstFloor =
        getNodesOnFloor(
            map,
            1
        );


    if (
        firstFloor.length < 2
    ) {

        errors.push(
            "El mapa tiene menos de 2 habitaciones iniciales."
        );

    }


    // ========================================================
    // Debe existir al menos un nodo en piso 15
    // ========================================================

    const finalFloor =
        getNodesOnFloor(
            map,
            15
        );


    if (
        finalFloor.length === 0
    ) {

        errors.push(
            "El mapa no tiene habitaciones en el piso 15."
        );

    }


    // ========================================================
    // Comprobar tipos obligatorios
    // ========================================================

    for (
        const node
        of getNodesOnFloor(map, 1)
    ) {

        if (
            node.type !== "combat"
        ) {

            errors.push(
                `${node.id}: el piso 1 debe ser combat.`
            );

        }

    }


    for (
        const node
        of getNodesOnFloor(map, 9)
    ) {

        if (
            node.type !== "treasure"
        ) {

            errors.push(
                `${node.id}: el piso 9 debe ser treasure.`
            );

        }

    }


    for (
        const node
        of getNodesOnFloor(map, 15)
    ) {

        if (
            node.type !== "rest"
        ) {

            errors.push(
                `${node.id}: el piso 15 debe ser rest.`
            );

        }

    }


    // ========================================================
    // Comprobar restricciones de cada nodo
    // ========================================================

    for (
        const node
        of map.nodes
    ) {

        if (
            !isLocationAllowed(
                map,
                node,
                node.type
            )
        ) {

            errors.push(
                `${node.id}: localización inválida (${node.type}).`
            );

        }

    }


    // ========================================================
    // Comprobar destinos duplicados
    // ========================================================

    for (
        const node
        of map.nodes
    ) {

        if (
            node.connections.length < 2
        ) {

            continue;

        }


        const destinationTypes = [];


        for (
            const destinationId
            of node.connections
        ) {

            if (
                destinationId === "boss"
            ) {

                continue;

            }


            const destination =
                getNodeById(
                    map,
                    destinationId
                );


            if (
                !destination
            ) {

                continue;

            }


            if (
                destinationTypes.includes(
                    destination.type
                )
            ) {

                errors.push(
                    `${node.id}: tiene dos destinos con el mismo tipo.`
                );

            }


            destinationTypes.push(
                destination.type
            );

        }

    }


    // ========================================================
    // Comprobar Boss
    // ========================================================

    if (
        !map.boss
    ) {

        errors.push(
            "El mapa no tiene Boss."
        );

    }


    else {

        for (
            const node
            of finalFloor
        ) {

            if (
                !node.connections.includes(
                    "boss"
                )
            ) {

                errors.push(
                    `${node.id}: no está conectado al Boss.`
                );

            }

        }

    }


    return {

        valid:
            errors.length === 0,

        errors:
            errors

    };

}