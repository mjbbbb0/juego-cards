import { MapNode } from "../mapNode.js";
import { mapConfig } from "../mapConfig.js";


export function generateGrid(map) {

    let nodeId = 0;


    // ========================================================
    // CREAR GRID
    // ========================================================

    for (
        let row = 1;
        row <= mapConfig.rows;
        row++
    ) {

        for (
            let column = 0;
            column < mapConfig.columns;
            column++
        ) {

            const node =
                new MapNode(
                    `node_${nodeId}`,
                    row,
                    column
                );


            map.nodes.push(
                node
            );


            nodeId++;

        }

    }

}
