import Container from './lib/Container';
import Collidable from './lib/Collidable';
import Rune from './elements/Rune';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';
import state from './State';

export default class MessagePort extends Collidable(Container) {
    constructor() {
        super();

        this.width = inGridTiles(3);
        this.height = inGridTiles(1);

        this.letters = '';
        this.runes = [];

        state.events.on('messagePortPlate.stepOn', () => {
            this.runes.forEach(rune => rune.style.opacity = 1);
        });

        state.events.on('messagePortPlate.stepOff', () => {
            this.runes.forEach(rune => rune.style.opacity = 0);
        });
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
            }).setStyle({opacity: 0});

            this.runes.push(rune);
            this.addChild(rune);
        }

        return this;
    }

    getLetters() {
        return this.letters;
    }

}
