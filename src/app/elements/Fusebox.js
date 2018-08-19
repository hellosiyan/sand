import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import game from '../Game';
import { config } from '../config';

const pixmaps = {
    stone: Pixmap.load(`
000000001111111111111100000000
000001111111111111111111100000
000111111111111111111111111000
011111111111111111111111111110
111111111111111111111111111111
111111111111111111111111111111
111111111100000001111111111111
111111111111111111111111111111
111111111111111111111111111111
111111111111111111111111111111
111111111111111000000000001111
111100011111111111111111111111
111111111111111111111111111111
111111100000000011111111111111
111111111111111111111111111111
111111111111100001111111111111
111111111111111111111111111111
111110011111111110000000000111
111111111111111111111111111111
111111111111111111111111111111
110001110000000111111111111111
111111111111111110000000011111
111111111111111111111111111111
111111111100000000011111111111
111111111111111111111111111111
111111111111111111111111111111
011111111111111111111111111110
000111111111111111111111111000
000001111111111111111111100000
000000001111111111111100000000`, config.palettes.fusebox).toDrawable().cache(),
};

export default class Fusebox extends Drawable {
    constructor() {
        super();

        this.width = pixmaps.stone.width;
        this.height = pixmaps.stone.height;
    }

    draw(ctx) {
        const drawable = pixmaps.stone;
        drawable.x = this.x;
        drawable.y = this.y;
        drawable.draw(ctx);
    }
}
