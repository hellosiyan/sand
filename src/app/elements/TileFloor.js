import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import { config } from '../config';

const pixmap = Pixmap.load(`
AAAAAAAAAAAAAAC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
ABBBBBBBBBBBBBC
CCCCCCCCCCCCCCC`, config.palette);

export default class TileFloor extends Drawable {
    draw(ctx) {
        pixmap
            .toPatternedDrawable({ height: this.height, width: this.width }, 'repeat')
            .set({
                x: this.x,
                y: this.y,
            })
            .draw(ctx);
    }
}
