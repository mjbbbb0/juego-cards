// ============================================================
// NODE CLEANER
// ============================================================
//
// Elimina los nodos que no forman parte de ninguna ruta.
//
// Un nodo es válido si:
// - Tiene al menos una conexión de salida
// - O tiene al menos una conexión de entrada
//
// También elimina los paths que apunten a nodos que ya no
// existen.
//
// ============================================================


export function cleanNodes(map) {

    // ========================================================
    // 1. Obtener los IDs de los nodos que realmente están
    //    conectados
    // ========================================================

    const validNodes =
        map.nodes.filter(
            node => {

                const hasOutgoingConnections =
                    node.connections &&
                    node.connections.length > 0;


                const hasIncomingConnections =
                    node.incomingConnections &&
                    node.incomingConnections.length > 0;


                return (
                    hasOutgoingConnections ||
                    hasIncomingConnections
                );

            }
        );


    // ========================================================
    // 2. Sustituir los nodos originales
    // ========================================================

    map.nodes =
        validNodes;


    // ========================================================
    // 3. Crear un conjunto con los IDs válidos
    // ========================================================

    const validNodeIds =
        new Set(
            map.nodes.map(
                node =>
                    node.id
            )
        );


    // ========================================================
    // 4. Eliminar paths inválidos
    // ========================================================

    map.paths =
        map.paths.filter(
            path => {

                return (
                    validNodeIds.has(
                        path.from
                    ) &&
                    validNodeIds.has(
                        path.to
                    )
                );

            }
        );


    // ========================================================
    // 5. Limpiar conexiones de los nodos
    //
    // Esto evita que un nodo conserve una conexión hacia
    // otro nodo que haya sido eliminado.
    // ========================================================

    for (
        const node of map.nodes
    ) {

        node.connections =
            node.connections.filter(
                nodeId =>
                    validNodeIds.has(
                        nodeId
                    )
            );


        node.incomingConnections =
            node.incomingConnections.filter(
                nodeId =>
                    validNodeIds.has(
                        nodeId
                    )
            );

    }


    // ========================================================
    // 6. Devolver el mapa limpio
    // ========================================================

    return map;

}
