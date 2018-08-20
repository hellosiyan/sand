import Container from './lib/Container';
import Collidable from './lib/Collidable';
import Rune from './elements/Rune';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';

export default class MessagePort extends Collidable(Container) {
    constructor() {
        super();

        this.width = inGridTiles(3);
        this.height = inGridTiles(1);

        this.letters = '';
        this.runes = [];
    }

    draw(ctx) {
        ctx.fillStyle = config.palettes.controlBoard['1'];

        ctx.fillRect(this.x, this.y, this.width, this.height);

        super.draw(ctx);
    }

    setLetters(letters) {
        this.letters = letters;

        this.empty();
        this.runes = [];

        for (let letter of letters) {
            const rune = new Rune();
            rune.set({
                x: inPixels(8 + 12 * this.runes.length),
                y: inPixels(11),
                letter: letter
            });

            this.runes.push(rune);
            this.addChild(rune);
        }

        return this;
    }

    getLetters() {
        return this.letters;
    }

}
