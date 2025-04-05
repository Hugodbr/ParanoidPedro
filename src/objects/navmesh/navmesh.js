export default class NavMesh {
    constructor(tilemap, tileSize) {
        this.tilemap = tilemap;
        this.tileSize = tileSize;
    }

    isWalkable(x, y) {
        // Your logic to check if the tile is walkable
        // Example:
        const tile = this.tilemap.getTileAt(x, y);
        return tile && tile.index !== -1;  // Adjust based on your map's walkable criteria
    }

    createNode(x, y, parent = null) {
        return {
            x,
            y,
            parent,
            g: 0,
            h: 0,
            f: 0
        };
    }

    generarCamino(origen, destino) {
        let camino = []; // Genera el camino aquí
        return camino.filter(nodo => esCaminable(nodo)); // Filtra nodos no caminables
    }


    heuristic(nodeA, nodeB) {
        return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
    }

    findPath(startX, startY, endX, endY) {
        if (!this.isWalkable(startX, startY) || !this.isWalkable(endX, endY)) {
            console.error("Invalid start or end position.");
            return [];
        }

        let openSet = [];
        let closedSet = [];
        const startNode = this.createNode(startX, startY);
        const endNode = this.createNode(endX, endY);
        openSet.push(startNode);

        while (openSet.length > 0) {
            let currentNode = openSet.reduce((lowest, node) => (node.f < lowest.f ? node : lowest));

            if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
                let path = [];
                while (currentNode) {
                    path.push({ x: currentNode.x, y: currentNode.y });
                    currentNode = currentNode.parent;
                }
                return path.reverse();
            }

            openSet = openSet.filter(node => node !== currentNode);
            closedSet.push(currentNode);

            const neighbors = [
                { x: 0, y: -1 },  // Up
                { x: 1, y: 0 },   // Right
                { x: 0, y: 1 },   // Down
                { x: -1, y: 0 }   // Left
            ];

            for (const { x: dx, y: dy } of neighbors) {
               

                const nx = currentNode.x + dx;
                const ny = currentNode.y + dy;

                if (nx < 0 || ny < 0 || nx >= this.tilemap.width || ny >= this.tilemap.height) {
                    continue; // Ignora si está fuera de los límites
                }

                if (!this.isWalkable(nx, ny) || closedSet.some(node => node.x === nx && node.y === ny)) {
                    continue;
                }


                const g = currentNode.g + 1;
                let neighborNode = openSet.find(node => node.x === nx && node.y === ny);

                if (!neighborNode) {
                    console.log("No caminable");

                    neighborNode = this.createNode(nx, ny, currentNode);
                    neighborNode.g = g;
                    neighborNode.h = this.heuristic(neighborNode, endNode);
                    neighborNode.f = neighborNode.g + neighborNode.h;
                    openSet.push(neighborNode);
                } else if (g < neighborNode.g) {
                    console.log("Caminable:", nx, ny);

                    neighborNode.g = g;
                    neighborNode.parent = currentNode;
                    neighborNode.f = neighborNode.g + neighborNode.h;
                }
            }
        }
        return [];
    }
}
