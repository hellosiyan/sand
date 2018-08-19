import Container from './lib/Container';
import { inGridTiles, inPixels } from './utils';
import FuseboxElement from './elements/Fusebox';
import { config } from './config';

export default class Fusebox extends Container {
    constructor() {
        super();

        this.width = inGridTiles(1);
        this.height = inGridTiles(1);

        this.isActive = false;

        this.element = new FuseboxElement();
        this.addChild(this.element);
    }

    draw(ctx) {
        if (this.isActive) {
            ctx.fillStyle = config.palettes.fusebox['3'];
        } else {
            ctx.fillStyle = config.palettes.fusebox['2'];
        }

        ctx.fillRect(this.x, this.y + inPixels(4), this.width, this.height - inPixels(8));

        super.draw(ctx);
    }

    activate() {
        this.isActive = true;

        return this;
    }

    dectivate() {
        this.isActive = false;

        return this;
    }
}
