import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import { config } from '../config';

const pixmaps = {
    '1': Pixmap.load(`
0000100
0101200
0210210
2202122
0303023
0032032
0002220
0003300
`, config.palettes.plants).toDrawable().cache(),
    '2': Pixmap.load(`
00300
00230
03220
02220
02220
03223
02322
32232
22222
`, config.palettes.plants).toDrawable().cache(),
    '3': Pixmap.load(`
0001000000
0002000000
0002010000
0002020001
1000200012
0200300020
0300300030
`, config.palettes.plants).toDrawable().cache(),
    '4': Pixmap.load(`
000030000
003030003
302020002
200020302
200020202
003020200
002000000
`, config.palettes.plants).toDrawable().cache(),
    '5': Pixmap.load(`
000010000
000120000
100002010
020202021
020030020
002300300
000023000
`, config.palettes.plants).toDrawable().cache(),
    '6': Pixmap.load(`
021
120
020
021
130
030
`, config.palettes.plants).toDrawable().cache()
};

export default class Plamt extends Drawable {
    constructor() {
        super();

        this.kind = '1';
        this.width = pixmaps[this.kind].width;
        this.height = pixmaps[this.kind].height;
    }

    draw(ctx) {
        const drawable = pixmaps[this.kind];
        drawable.x = this.x;
        drawable.y = this.y;

        ctx.globalAlpha = this.style.opacity;

        drawable.draw(ctx);
    }

    setKind(kind) {
        this.kind = kind;

        return this;
    }
}
