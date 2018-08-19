    import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import { config } from '../config';

const pixmap = Pixmap.load(`
000000000000000
000100000000000
000000000001000
000000010000000
000000000000000
000000000000000
000000000000000
000100000000000
000000000000000
000000000000000
000000000000000
100000000000000
000000000010000
000000000000001
000100000000000`, config.palettes.sand);

export default class SandTexture extends Drawable {
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
