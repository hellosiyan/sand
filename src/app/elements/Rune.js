import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import { config } from '../config';

const pixmaps = {
    '0': Pixmap.load(`
000000000
000000000
000000000
000000000
000010000
000000000
000000000
000000000
000000000`, config.palettes.runes).toDrawable().cache(),
    'a': Pixmap.load(`
000000000
001111100
000010000
001111100
000010000
000010000
000010000
000010000
000000000`, config.palettes.runes).toDrawable().cache(),
    'b': Pixmap.load(`
000000000
000100000
000100000
011110000
000101000
000100100
000100010
000100010
000000000`, config.palettes.runes).toDrawable().cache(),
    'c': Pixmap.load(`
000000000
000000100
000011100
000000100
001001000
001010000
001100100
001000100
000000000`, config.palettes.runes).toDrawable().cache(),
};

export default class Rune extends Drawable {
    constructor() {
        super();

        this.width = pixmaps['0'].width;
        this.height = pixmaps['0'].height;
        this.letter = '0';
    }

    draw(ctx) {
        const drawable = pixmaps[this.letter];
        drawable.x = this.x;
        drawable.y = this.y;
        drawable.draw(ctx);
    }
}
