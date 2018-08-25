import Container from './lib/Container';
import Collidable from './lib/Collidable';
import state from './State';
import { inGridTiles, inPixels } from './utils';
import FuseboxElement from './elements/Fusebox';
import { config } from './config';

export default class Fusebox extends Collidable(Container) {
    constructor() {
        super();

        this.element = (new FuseboxElement()).addTo(this);

        this.width = this.element.width;
        this.height = inPixels(5);

        this.element.alignWith(this).bottomEdges();

        this.isActive = false;
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

        state.events.emit('fusebox.activated', this.element.rune.letter);

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
