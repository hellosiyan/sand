import PriorityQueue from './PriorityQueue';

const tileKey = (tile) => `${tile.x}.${tile.y}`;

export default class TileGrid {
    constructor () {
        this.data = [];
        this.width = 0;
        this.height = 0;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.fill(0, 0, width, height, 0);

        return this;
    }

    set(x, y, value) {
        this.data[this.width * y + x] = value;
    }

    get(x, y) {
        return this.data[this.width * y + x];
    }

    fill (xMin, yMin, xMax, yMax, value) {
        for (let x = xMin; x < xMax; x++) {
            for (let y = yMin; y < yMax; y++) {
                this.data[this.width * y + x] = value;
            }
        }

        return this;
    }

    fillRow (row, value) {
        for (let x = 0; x < this.width; x++) {
            this.data[this.width * row + x] = value;
        }

        return this;
    }

    fillCol (col, value) {
        for (let y = 0; y < this.height; y++) {
            this.data[this.width * y + col] = value;
        }

        return this;
    }

    fillBorder(value) {
        this.fillRow(0, value)
            .fillRow(this.width - 1, value)
            .fillCol(0, value)
            .fillCol(this.height - 1, value);

        return this;
    }

    bucketFill(x, y, value) {
        let area = this.continuousSelect(x, y);

        this.fill(x, y, x + area.width, y + area.height, value);

        return this;
    }

    // TODO: Extend selection upwards and leftwards
    continuousSelect(x, y) {
        let targetValue = this.get(x, y);

        let area = {
            x,
            y,
            width: 0,
            height: 0,
        };

        while (this.get(x + area.width, y) === targetValue) {
            area.width++;
        }

        while (this.get(x, y + area.height) === targetValue) {
            area.height++;
        }

        return area;
    }

    toString () {
        let string = '';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                string += (this.data[this.width * y + x]) + '\t';
            }

            string += '\n';
        }

        return string;
    }

    each(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(x, y, this.data[this.width * y + x]);
            }
        }
    }

    filter(value) {
        let filtered = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.data[this.width * y + x] == value)
                    filtered.push({ x, y });
            }
        }

        return filtered;
    }

    overlayWith(tiles, destX, destY, value) {
        for (let x = 0; x < tiles.width; x++) {
            for (let y = 0; y < tiles.height; y++) {
                if (tiles.get(x, y)) {
                    this.data[this.width * (y + destY) + (x + destX)] = value;
                }
            }
        }
    }

    copy() {
        let copy = new TileGrid();

        copy.data = [...this.data];
        copy.width = this.width;
        copy.height = this.height;

        return copy;
    }

    neighbors(x, y) {
        return [
            { x: x, y: y - 1 },
            { x: x - 1, y: y },
            { x: x, y: y + 1 },
            { x: x + 1, y: y },
        ].filter(tile => {
            if (tile.x < 0 || tile.y < 0) {
                return false;
            }

            if (tile.x >= this.width || tile.y >= this.height) {
                return false;
            }

            return true;
        });
    }

    mapWalkableTilesFrom(source, walkableValues = [0]) {
        const walkableTiles = [];
        const frontier = new PriorityQueue();
        const visited = [];
        const costSoFar = {};

        frontier.put(source, 0);
        visited.push(tileKey(source));
        costSoFar[tileKey(source)] = 0;

        while (! frontier.empty()) {
            const current = frontier.get();
            const neighbors = this.neighbors(current.x, current.y)
                .filter(tile => walkableValues.includes(this.get(tile.x, tile.y)));

            neighbors.forEach((next) => {
                const newCost = costSoFar[tileKey(current)] + 1;

                if (! visited.includes(tileKey(next)) || newCost < costSoFar[tileKey(next)]) {
                    costSoFar[tileKey(next)] = newCost;
                    frontier.put(next, newCost);

                    visited.push(tileKey(next));
                    walkableTiles.push({
                        x: next.x,
                        y: next.y,
                        distance: newCost,
                        origin: current,
                    });
                }
            });
        }

        return walkableTiles;
    }

    floodSelectOutsideRadius(source, radius, walkableValues = [0]) {
        return this.mapWalkableTilesFrom(source, walkableValues)
            .filter(tile => tile.distance > radius)
            .map(tile => ({ x: tile.x, y: tile.y }));
    }

    static outsideRadius(coordinates, center, radius) {
        let result = [];
        let distance = 0;

        for (let i = 0; i < coordinates.length; i++) {
            distance = Math.abs(coordinates[i].x - center.x) + Math.abs(coordinates[i].y - center.y);
            if (distance > radius) {
                result.push(coordinates[i]);
            }
        }

        return result;
    }
}
