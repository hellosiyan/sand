import Wall from './elements/Wall';

export default class WallBuilder {
    constructor() {
        this.builtDrawbles = [];
        this.pointer = { x: 0, y: 0 };
        this.direction = ''; // (left|right|top|bottom)
        this.currentWall = new Wall();
    }

    static newWall(type) {
        const builder = new WallBuilder();

        builder.currentWall.setType(type);

        return builder;
    }

    static buildAround(rectangle) {
        return WallBuilder.newWall('top')
            .from({ x: rectangle.x, y: rectangle.y })
            .to({ x: rectangle.x + rectangle.width, y: rectangle.y })
            .turnDown()
            .to({ x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height })
            .turnLeft()
            .to({ x: rectangle.x, y: rectangle.y + rectangle.height })
            .turnUp()
            .to({ x: rectangle.x, y: rectangle.y })
            .turnRight()
            .finish();
    }

    from(point) {
        this.pointer = point;
        this.currentWall.placeAt(point);

        return this;
    }

    to(point) {
        const diff = {
            width: point.x - this.pointer.x,
            height: point.y - this.pointer.y,
        };

        this.pointer = point;

        if (['top', 'bottom'].includes(this.currentWall.type)) {
            this.currentWall.resizeTo(diff.width);
            this.direction = diff.width > 0 ? 'right' : 'left';
        } else {
            this.currentWall.resizeTo(diff.height);
            this.direction = diff.height > 0 ? 'down' : 'up';
        }

        return this;
    }

    turnUp() {
        if (['left', 'right'].includes(this.currentWall.type)) {
            throw `Cannot turn up from ${this.currentWall.type}`;
        }

        if (this.currentWall.type === 'top') {
            throw `Outerward corners TBD`;
        }

        const nextWallType = this.direction == 'right' ? 'right' : 'left';

        this.nextWall(nextWallType);

        return this;
    }

    turnDown() {
        if (['left', 'right'].includes(this.currentWall.type)) {
            throw `Cannot turn down from ${this.currentWall.type}`;
        }

        if (this.currentWall.type === 'bottom') {
            throw `Outerward corners TBD`;
        }

        const nextWallType = this.direction == 'right' ? 'right' : 'left';

        this.nextWall(nextWallType);

        return this;
    }

    turnLeft() {
        if (['top', 'bottom'].includes(this.currentWall.type)) {
            throw `Cannot turn left from ${this.currentWall.type}`;
        }

        if (this.currentWall.type === 'left') {
            throw `Outerward corners TBD`;
        }

        const nextWallType = this.direction == 'up' ? 'top' : 'bottom';

        this.nextWall(nextWallType);

        return this;
    }

    turnRight() {
        if (['top', 'bottom'].includes(this.currentWall.type)) {
            throw `Cannot turn right from ${this.currentWall.type}`;
        }

        if (this.currentWall.type === 'right') {
            throw `Outerward corners TBD`;
        }

        const nextWallType = this.direction == 'up' ? 'top' : 'bottom';

        this.nextWall(nextWallType);

        return this;
    }

    finish() {
        return this.builtDrawbles;
    }

    nextWall(type) {
        this.builtDrawbles.push(this.currentWall);

        this.currentWall = new Wall()
            .setType(type)
            .placeAt(this.pointer);

        return this;
    }
}
