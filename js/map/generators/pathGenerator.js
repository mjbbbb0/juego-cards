import { MapPath } from "../mapPath.js";
import { mapConfig } from "../mapConfig.js";


// ============================================================
// GENERAR CAMINOS
// ============================================================

export function generatePaths(
    map,
    random
) {

    // --------------------------------------------------------
    // Seleccionar entre 2 y 6 habitaciones iniciales
    // --------------------------------------------------------

    const startingRooms =
        selectStartingRooms(
            map,
            random
        );


    // --------------------------------------------------------
    // Las habitaciones iniciales quedan activas
    // --------------------------------------------------------

    let activeNodes = [
        ...startingRooms
    ];


    let pathId = 0;


    // ========================================================
    // AVANZAR PISO POR PISO
    // ========================================================

    for (
        let floor = 1;
        floor < map.rows;
        floor++
    ) {

        const nextActiveNodes = [];


        // ----------------------------------------------------
        // Procesar todas las habitaciones activas
        // ----------------------------------------------------

        for (
            const node of activeNodes
        ) {

            // -----------------------------------------------
            // Obtener hasta 3 destinos más cercanos
            // -----------------------------------------------

            const candidates =
                getClosestNodes(
                    map,
                    node
                );


            // -----------------------------------------------
            // Eliminar destinos que producirían cruces
            // -----------------------------------------------

            const validCandidates =
                candidates.filter(
                    candidate =>
                        canCreatePath(
                            map,
                            node,
                            candidate
                        )
                );


            // -----------------------------------------------
            // No hay destinos válidos
            // -----------------------------------------------

            if (
                validCandidates.length === 0
            ) {

                continue;

            }


            // -----------------------------------------------
            // Elegir destino utilizando la seed
            // -----------------------------------------------

            const destination =
                random.pick(
                    validCandidates
                );


            // -----------------------------------------------
            // Crear camino
            // -----------------------------------------------

            const path =
                createPath(
                    map,
                    node,
                    destination,
                    pathId
                );


            pathId++;


            map.paths.push(
                path
            );


            // -----------------------------------------------
            // El destino continúa activo
            // -----------------------------------------------

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


        // ----------------------------------------------------
        // Pasar al siguiente piso
        // ----------------------------------------------------

        activeNodes =
            nextActiveNodes;


        // ----------------------------------------------------
        // Si no quedan nodos activos, detener generación
        // ----------------------------------------------------

        if (
            activeNodes.length === 0
        ) {

            break;

        }

    }

}


// ============================================================
// SELECCIONAR HABITACIONES INICIALES
// ============================================================

function selectStartingRooms(
    map,
    random
) {

    const firstFloor =
        getNodesOnFloor(
            map,
            1
        );


    // --------------------------------------------------------
    // No hay nodos en el primer piso
    // --------------------------------------------------------

    if (
        firstFloor.length === 0
    ) {

        return [];

    }


    // --------------------------------------------------------
    // Máximo de habitaciones iniciales
    // --------------------------------------------------------

    const maxRooms =
        Math.min(
            mapConfig.startingRooms,
            firstFloor.length
        );


    // --------------------------------------------------------
    // Mínimo de habitaciones iniciales
    // --------------------------------------------------------

    const minRooms =
        Math.min(
            2,
            maxRooms
        );


    // --------------------------------------------------------
    // Elegir cantidad mediante la seed
    // --------------------------------------------------------

    const amount =
        random.int(
            minRooms,
            maxRooms
        );


    // --------------------------------------------------------
    // Copia de los nodos disponibles
    // --------------------------------------------------------

    const available =
        [
            ...firstFloor
        ];


    const selected = [];


    // ========================================================
    // SELECCIONAR NODOS SIN REPETIR
    // ========================================================

    while (
        selected.length < amount &&
        available.length > 0
    ) {

        const index =
            random.int(
                0,
                available.length - 1
            );


        const node =
            available.splice(
                index,
                1
            )[0];


        selected.push(
            node
        );

    }


    return selected;

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
// OBTENER LOS DESTINOS MÁS CERCANOS
// ============================================================

function getClosestNodes(
    map,
    node
) {

    const nextFloor =
        node.row + 1;


    // --------------------------------------------------------
    // No existe siguiente piso
    // --------------------------------------------------------

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


            return (
                distanceA -
                distanceB
            );

        }
    );


    // --------------------------------------------------------
    // Limitar a los destinos configurados
    // --------------------------------------------------------

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
    // No duplicar conexiones
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


    // --------------------------------------------------------
    // Añadir conexión de salida
    // --------------------------------------------------------

    from.addConnection(
        to.id
    );


    // --------------------------------------------------------
    // Añadir conexión de entrada
    // --------------------------------------------------------

    to.addIncomingConnection(
        from.id
    );


    return path;

}


// ============================================================
// COMPROBAR SI UN CAMINO CRUZA OTRO
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


        // ----------------------------------------------------
        // El camino contiene un nodo inexistente
        // ----------------------------------------------------

        if (
            !pathFrom ||
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


    return false;

}


// ============================================================
// COMPROBAR INTERSECCIÓN DE SEGMENTOS
// ============================================================

function segmentsCross(
    a,
    b,
    c,
    d
) {

    // --------------------------------------------------------
    // Compartir un extremo NO es cruzar
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
        (
            (b.column - a.column) *
            (c.row - a.row)
        )
        -
        (
            (b.row - a.row) *
            (c.column - a.column)
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
// BUSCAR NODO POR ID
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
