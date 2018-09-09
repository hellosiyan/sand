import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import state from '../State';
import { config } from '../config';

const pixmaps = {
    front: Pixmap.load(`
000000000000100000001100000000
000000000000111111111100000000
000000000000111222221100000000
000000000000112233322100000000
000000000000124444444100000000
000000000000554674474500000000
000000000005558698894500000000
000000000001128888888100000000
0000000000011a223332a110000000
00000000001111a2222aa110000000
00000000001111aaaaaaa110000000
000000000011111111111111000000
000000000111111111111111000000
000000000111111111111111000000
000000011111111111111111000000
000000011111111111111111100000
000004411111111111111111140000
000000444411111111111111444000
000000044444111111111114440000
000000011144444444444444100000
000000111111111111111111100000
000000111111111111111111100000
000001111111111111111111100000
000001111111111111111111100000
000001111111111111111111110000
000011111111111111111111110000
0000111111111111a11a11111a0000
0001111a111a111aa1aa111a1aa000
000111aa11aaa11aa1aaa11a1aa000
000111aa11aaa1aaa1444444444000
004444aa11aaa1444411411aa11000
00411144444444aaaa14441a441000
00411aa41aaaa44a44444444444000
004144444444114aa144a144aa1400
044114aa14aaa444a1a4a14aaa1400
04114a4a444aa4a4a1444444444440
0411444a4a4a144444444444444444
044444444444444444111111111114
044444444441111111111111444440
444444444444400000a10000000000
00000000001a100000aa0000000000
0000000000aaa000001a0000000000
0000000000aa000000a00000000000
00000000000a000000000000000000
`, {
    '0': 'rgba(0,0,0,0)',
    '1': 'rgba(0,177,227,255)',
    '2': 'rgba(255,183,77,255)',
    '3': 'rgba(255,204,128,255)',
    '4': 'rgba(251,192,45,255)',
    '5': 'rgba(245,127,23,255)',
    '6': 'rgba(77,208,225,255)',
    '7': 'rgba(128,222,234,255)',
    '8': 'rgba(249,168,37,255)',
    '9': 'rgba(0,172,193,255)',
    'a': 'rgba(0,134,201,255)'
}).toDrawable().cache(),
};

export default class Player extends Drawable {
    constructor() {
        super();

        this.width = pixmaps.front.width;
        this.height = pixmaps.front.height;

        this.levitationTimeInterval = 0;

        this.direction = {
            x: 'left', // (left|right)
            y: 'down', // (up|down)
        };
    }

    setDirection(direction) {
        if (direction.x) {
            this.direction.x = direction.x;
        }

        if (direction.y) {
            this.direction.y = direction.y;
        }

        return this;
    }

    draw(ctx) {
        const spriteName = 'front';

        this.levitationTimeInterval = (this.levitationTimeInterval + state.loop.dt/2) % 2;
        const levitationHeightRatio = Math.abs(this.levitationTimeInterval - 1) * 0.1;
        const levitationY = Math.round(levitationHeightRatio * this.height);

        let x = this.x;
        let y = this.y - levitationY;

        if (this.direction.x == 'left') {
            ctx.scale(-1, 1);
            x = -1 * this.x - this.width;
        }

        let drawable = pixmaps[spriteName];
        drawable.x = x;
        drawable.y = y;
        drawable.draw(ctx);
    }
}
