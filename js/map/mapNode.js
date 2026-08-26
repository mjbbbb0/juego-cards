export class MapNode {

    constructor(id, floor, column) {

        this.id = id;

        this.floor = floor;

        this.column = column;

        this.type = null;

        this.connections = [];

        this.visited = false;

        this.available = false;

    }


    addConnection(nodeId) {

        if (!this.connections.includes(nodeId)) {

            this.connections.push(nodeId);

        }

    }

}