import Rectangle from './lib/Rectangle';
import Collidable from './lib/Collidable';
import { inGridTiles } from './utils';

export default class Obstacle extends Collidable(Rectangle) {
    constructor() {
        super();

        this.width = inGridTiles(1);
        this.height = inGridTiles(1);
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(255,0,0,0.2)';
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
