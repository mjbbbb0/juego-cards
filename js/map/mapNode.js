export class MapNode {

    constructor(id, floor, type) {

        this.id = id;

        this.floor = floor;

        this.type = type;

        this.connections = [];

    }


    addConnection(nodeId) {

        if (!this.connections.includes(nodeId)) {

            this.connections.push(nodeId);

        }

    }

}