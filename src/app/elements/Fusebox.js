import Container from '../lib/Container';
import Pixmap from '../Pixmap';
import Rune from './Rune';
import { config } from '../config';
import { inPixels } from '../utils';

const pixmaps = {
    stone: Pixmap.load(`
0000000111110000000
0000011122222200000
0000112333333330000
0001123333333333000
0011233333333333300
0112333333333333330
0123333333333333330
1133333333333333333
1233333333333333333
1233333333333333333
1233333333333333333
1233333333333333333
1233333333333333333
1233333333333333333
1233333333333333333
1233333333333333333
1233434333333333333
1235333433333333333
1233453333343334333
1233355004330354333
6230350000500053303
`, {
    '0': 'rgba(0,0,0,0)',
    '1': 'rgba(182,178,179,255)',
    '2': 'rgba(210,208,209,255)',
    '3': 'rgba(255,255,255,255)',
    '4': 'rgba(0,177,227,255)',
    '5': 'rgba(0,134,201,255)',
    '6': 'rgba(255,213,79,255)'
}).toDrawable().cache()
};

export default class Fusebox extends Container {
    constructor() {
        super();

        this.width = pixmaps.stone.width;
        this.height = pixmaps.stone.height;

        this.rune = new Rune();
        this.rune.y = inPixels(5);
        this.rune.letter = 'a';
        this.rune.format = 'outlined';
        this.rune.alignWith(this).center();

        this.addChild(this.rune);
    }

    draw(ctx) {
        const drawable = pixmaps.stone;
        drawable.x = this.x;
        drawable.y = this.y;
        drawable.draw(ctx);

        super.draw(ctx);
    }
}
