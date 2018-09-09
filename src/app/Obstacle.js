import Rectangle from './lib/Rectangle';
import Collidable from './lib/Collidable';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';

export default class Obstacle extends Collidable(Rectangle) {
    constructor() {
        super();

        this.width = inGridTiles(1);
        this.height = inGridTiles(1);
    }

    draw(ctx) {
        ctx.fillStyle = config.palettes.sand['1'];
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    getCollisionBox() {
        return {
            left: this.x - inPixels(2),
            right: this.x + this.width + inPixels(2),
            top: this.y - inPixels(2),
            bottom: this.y + this.height + inPixels(2),
        };
    }
}
