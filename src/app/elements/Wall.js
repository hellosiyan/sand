import Rectangle from '../lib/Rectangle';
import Collidable from '../lib/Collidable';
import Pixmap from '../Pixmap';
import { inGridTiles } from '../utils';
import { config } from '../config';

export default class Wall extends Collidable(Rectangle) {
    constructor() {
        super();

        this.setType('top'); // (top|bottom|left|right)

        this.width = inGridTiles(1);
        this.height = inGridTiles(1);

        this.graphic = false;
    }

    setType(type) {
        this.type = type;

        return this;
    }

    placeAt(point) {
        switch (this.type) {
            case 'top':
                this.x = point.x;
                this.y = point.y - this.height;
                break;
            case 'bottom':
                this.x = point.x;
                this.y = point.y;
                break;
            case 'left':
                this.x = point.x - this.width;
                this.y = point.y;
                break;
            case 'right':
                this.x = point.x;
                this.y = point.y;
                break;
        }

        return this;
    }

    resizeTo(size) {
        switch (this.type) {
            case 'top':
            case 'bottom':
                this.width = Math.abs(size);
                if (size < 0) this.x += size;
                break;
            case 'left':
            case 'right':
                this.height = Math.abs(size);
                if (size < 0) this.y += size;
                break;
        }

        return this;
    }

    getCollisionBox() {
        const cornerSize = inGridTiles(1);
        const collisionBox = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };

        if (this.type === 'top' || this.type === 'bottom') {
            collisionBox.left -= cornerSize;
            collisionBox.right += cornerSize;
        } else {
            collisionBox.top -= cornerSize;
            collisionBox.bottom += cornerSize;
        }

        return collisionBox;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(255,0,0,0.2)';
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
