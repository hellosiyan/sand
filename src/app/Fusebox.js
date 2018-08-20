import Container from './lib/Container';
import eventBus from './lib/EventBus';
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

    setLetter(letter) {
        this.element.rune.letter = letter;

        return this;
    }

    activate() {
        if (this.isActive) {
            return;
        }

        this.isActive = true;

        eventBus.emit('fusebox.activated', this.element.rune.letter);

        return this;
    }

    dectivate() {
        if (! this.isActive) {
            return;
        }

        this.isActive = false;

        return this;
    }
}
