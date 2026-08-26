import { MapNode } from "./mapNode.js";
import { mapConfig } from "./mapConfig.js";


// ============================================================
// GENERAR MAPA
// ============================================================

export function generateMap(random, act, biome) {

    const map = {

        act: act,

        biome: biome,

        rows: mapConfig.rows,

        columns: mapConfig.columns,

        nodes: [],

        boss: null

    };


    createGrid(map);

    generatePaths(map, random);

    removeDisconnectedNodes(map);

    assignNodeTypes(map, random);

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
// GENERAR CAMINOS
// ============================================================

function generatePaths(map, random) {

    const firstFloor =
        getNodesOnFloor(map, 1);


    // Elegimos dos puntos iniciales diferentes

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


    let activeNodes = [
        startA,
        startB
    ];


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


            const destination =
                random.pick(
                    validCandidates
                );


            createPath(
                node,
                destination
            );


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


        if (
            activeNodes.length === 0
        ) {

            break;

        }

    }

}


// ============================================================
// NODOS DE UN PISO
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
// OBTENER LOS 3 MÁS CERCANOS
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
// COMPROBAR CAMINO
// ============================================================

function canCreatePath(
    map,
    from,
    to
) {

    if (
        from.id === to.id
    ) {

        return false;

    }


    if (
        from.connections.includes(
            to.id
        )
    ) {

        return false;

    }


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
        const node of map.nodes
    ) {

        for (
            const destinationId
            of node.connections
        ) {

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
// INTERSECCIÓN
// ============================================================

function segmentsCross(
    a,
    b,
    c,
    d
) {

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

    for (
        const node of map.nodes
    ) {

        if (
            node.row ===
            mapConfig.specialFloors.combat
        ) {

            node.type =
                "combat";

            continue;

        }


        if (
            node.row ===
            mapConfig.specialFloors.treasure
        ) {

            node.type =
                "treasure";

            continue;

        }


        if (
            node.row ===
            mapConfig.specialFloors.rest
        ) {

            node.type =
                "rest";

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
// GENERAR UBICACIÓN
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


    return "combat";

}


// ============================================================
// TIRADA
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


    total +=
        mapConfig.locationOdds.combat;


    if (
        roll <= total
    ) {

        return "combat";

    }


    total +=
        mapConfig.locationOdds.event;


    if (
        roll <= total
    ) {

        return "event";

    }


    total +=
        mapConfig.locationOdds.elite;


    if (
        roll <= total
    ) {

        return "elite";

    }


    total +=
        mapConfig.locationOdds.rest;


    if (
        roll <= total
    ) {

        return "rest";

    }


    total +=
        mapConfig.locationOdds.shop;


    if (
        roll <= total
    ) {

        return "shop";

    }


    return "chest";

}


// ============================================================
// RESTRICCIONES
// ============================================================

function isLocationAllowed(
    map,
    node,
    type
) {

    const restrictions =
        mapConfig.restrictions;


    // Elite

    if (
        type === "elite" &&
        node.row <
        restrictions.eliteFromFloor
    ) {

        return false;

    }


    // Rest

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


    // Elite / Shop / Rest
    // no pueden ser consecutivos

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


    return true;

}


// ============================================================
// JEFE
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


    map.boss = {

        id:
            random.pick(
                bosses
            ),

        connections: []

    };


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