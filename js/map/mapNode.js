export class MapNode {

    constructor(id, row, column) {

        this.id = id;

        this.row = row;

        this.column = column;

        this.type = null;

        this.connections = [];

        this.incomingConnections = [];

        this.visited = false;

        this.available = false;

    }


    addConnection(nodeId) {

        if (!this.connections.includes(nodeId)) {

            this.connections.push(nodeId);

        }

    }


    addIncomingConnection(nodeId) {

        if (!this.incomingConnections.includes(nodeId)) {

            this.incomingConnections.push(nodeId);

        }

    }

}