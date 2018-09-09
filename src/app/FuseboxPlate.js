import Rectangle from './lib/Rectangle';
import Pixmap from './Pixmap';
import { config } from './config';
import { inPixels } from './utils';

const pixmaps = {
    stonePlate: Pixmap.load(`
0111111111111111110
1122222222222222222
1233333333333333332
1233333333333333332
1233333333333333332
1233333333333333322
0222222222222222220
`, {
    '0': 'rgba(0,0,0,0)',
    '1': 'rgba(182,178,179,255)',
    '2': 'rgba(210,208,209,255)',
    '3': 'rgba(255,255,255,255)'
}).toDrawable().cache()
};

export default class Fusebox extends Rectangle {
    constructor() {
        super();

        this.width = pixmaps.stonePlate.width;
        this.height = pixmaps.stonePlate.height;
    }

    draw(ctx) {
        let drawable = pixmaps.stonePlate;
        drawable.x = this.x;
        drawable.y = this.y;
        drawable.draw(ctx);
    }
}
