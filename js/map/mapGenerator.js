import { mapConfig } from "./mapConfig.js";
import { MapNode } from "./mapNode.js";


// ========================================
// GENERAR MAPA
// ========================================

export function generateMap() {

    const floors = [];


    let nodeId = 0;


    // ========================================
    // CREAR NODOS
    // ========================================

    for (
        let floor = 0;
        floor < mapConfig.floors;
        floor++
    ) {

        const nodes = [];


        const nodeCount =
            randomInt(
                mapConfig.minNodesPerFloor,
                mapConfig.maxNodesPerFloor
            );


        for (
            let i = 0;
            i < nodeCount;
            i++
        ) {

            const type =
                getRandomNodeType();


            const node =
                new MapNode(
                    `node_${nodeId}`,
                    floor,
                    type
                );


            nodes.push(node);

            nodeId++;

        }


        floors.push(nodes);

    }


    // ========================================
    // CONECTAR NODOS
    // ========================================

    connectFloors(floors);


    return floors;
}


// ========================================
// CONECTAR PISOS
// ========================================

function connectFloors(floors) {

    for (
        let floor = 0;
        floor < floors.length - 1;
        floor++
    ) {

        const currentFloor =
            floors[floor];

        const nextFloor =
            floors[floor + 1];


        currentFloor.forEach(node => {

            const target =
                nextFloor[
                    randomInt(
                        0,
                        nextFloor.length - 1
                    )
                ];


            node.addConnection(
                target.id
            );

        });

    }

}


// ========================================
// TIPO DE NODO ALEATORIO
// ========================================

function getRandomNodeType() {

    const types =
        mapConfig.nodeTypes;


    return types[
        randomInt(
            0,
            types.length - 1
        )
    ];

}


// ========================================
// NÚMERO ALEATORIO
// ========================================

function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}