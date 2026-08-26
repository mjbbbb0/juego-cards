import { mapConfig } from "../mapConfig.js";


// ============================================================
// GENERAR LOCATIONS
// ============================================================

export function generateLocations(
    map,
    random
) {

    // ========================================================
    // Primero dejamos todos los nodos sin tipo
    // ========================================================

    for (
        const node of map.nodes
    ) {

        node.type = null;

    }


    // ========================================================
    // PASO 1
    // PISO 1 = COMBATE
    // ========================================================

    assignSpecialFloor(
        map,
        mapConfig.specialFloors.combat,
        "combat"
    );


    // ========================================================
    // PASO 2
    // PISO 9 = TESORO
    // ========================================================

    assignSpecialFloor(
        map,
        mapConfig.specialFloors.treasure,
        "treasure"
    );


    // ========================================================
    // PASO 3
    // PISO 15 = DESCANSO
    // ========================================================

    assignSpecialFloor(
        map,
        mapConfig.specialFloors.rest,
        "rest"
    );


    // ========================================================
    // PASO 4
    // RESTO DE LOCATIONS
    // ========================================================

    const unassignedNodes =
        map.nodes.filter(
            node =>
                node.type === null
        );


    for (
        const node of unassignedNodes
    ) {

        node.type =
            generateLocation(
                map,
                node,
                random
            );

    }


    return map;

}


// ============================================================
// ASIGNAR UN PISO ESPECIAL
// ============================================================

function assignSpecialFloor(
    map,
    floor,
    type
) {

    const nodes =
        getNodesOnFloor(
            map,
            floor
        );


    for (
        const node of nodes
    ) {

        node.type =
            type;

    }

}


// ============================================================
// GENERAR LOCATION ALEATORIA
// ============================================================

function generateLocation(
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


    // ========================================================
    // Si después de muchos intentos no encontramos una
    // ubicación válida, usamos combate como fallback.
    // ========================================================

    return "combat";

}


// ============================================================
// TIRAR LOCATION SEGÚN LOS ODDS
// ============================================================

function rollLocation(
    random
) {

    const odds =
        mapConfig.locationOdds;


    const roll =
        random.int(
            1,
            100
        );


    let accumulated = 0;


    accumulated +=
        odds.combat;


    if (
        roll <= accumulated
    ) {

        return "combat";

    }


    accumulated +=
        odds.event;


    if (
        roll <= accumulated
    ) {

        return "event";

    }


    accumulated +=
        odds.elite;


    if (
        roll <= accumulated
    ) {

        return "elite";

    }


    accumulated +=
        odds.rest;


    if (
        roll <= accumulated
    ) {

        return "rest";

    }


    accumulated +=
        odds.shop;


    if (
        roll <= accumulated
    ) {

        return "shop";

    }


    // ========================================================
    // Fallback
    // ========================================================

    return "combat";

}


// ============================================================
// COMPROBAR SI UNA LOCATION ESTÁ PERMITIDA
// ============================================================

function isLocationAllowed(
    map,
    node,
    type
) {

    // ========================================================
    // ELITE
    // ========================================================

    if (
        type === "elite" &&
        node.row <
            mapConfig.restrictions.eliteFromFloor
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
                mapConfig.restrictions.restFromFloor
        ) {

            return false;

        }


        if (
            node.row ===
                mapConfig.restrictions.restForbiddenFloor
        ) {

            return false;

        }

    }


    // ========================================================
    // ELITE / SHOP / REST
    //
    // No pueden estar conectados consecutivamente.
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

        // ----------------------------------------------------
        // Comprobar nodos anteriores
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // Comprobar nodos posteriores
        // ----------------------------------------------------

        for (
            const nextId
            of node.connections
        ) {

            const next =
                getNodeById(
                    map,
                    nextId
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


    // ========================================================
    // DESTINOS DE UN MISMO NODO
    //
    // Si un nodo tiene varias salidas, no pueden compartir
    // la misma Location.
    // ========================================================

    if (
        hasDuplicateDestinationType(
            map,
            node,
            type
        )
    ) {

        return false;

    }


    return true;

}


// ============================================================
// COMPROBAR DESTINOS DUPLICADOS
// ============================================================

function hasDuplicateDestinationType(
    map,
    node,
    type
) {

    // --------------------------------------------------------
    // Combat/Event/etc. todavía no tienen problema si no hay
    // más de una salida.
    // --------------------------------------------------------

    if (
        node.connections.length < 2
    ) {

        return false;

    }


    for (
        const connectionId
        of node.connections
    ) {

        const destination =
            getNodeById(
                map,
                connectionId
            );


        if (
            destination &&
            destination.type === type
        ) {

            return true;

        }

    }


    return false;

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
