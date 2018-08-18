import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import game from '../Game';
import { config } from '../config';

const pixmaps = {
    front: Pixmap.load(`
0000000++++++0000000000000
00000++......++00000000000
0000+..........+0000000000
000+............+000000000
000+............+000000000
00+.............-+00000000
00+...+....+....-+00000000
00+..++...++....-+00000000
00+..++-..++-...-+00000000
00+.............-+00000000
00+.............-+00000000
00+....+++......-+00000000
00+.............-+00000000
00+.............-+00000000
0+.............--+00000000
+..+.......+..-++.+0000000
+.-+......+..-+....+++0000
+--+......+---+......-++00
0++0+-.....+++.....-----+0
0000+--..........--======+
00000+=--......--==+++++=+
000000+==------==++00000+0
0000000++======++000000000
000000000++++++00000000000`, config.palette).toDrawable().cache(),
    back: Pixmap.load(`
0000000++++++0000000000000
00000++......++00000000000
0000+..........+0000000000
000+............+000000000
000+............+000000000
00+.............-+00000000
00+.............-+00000000
00+.............-+00000000
00+.............-+00000000
00+.............-+00000000
00+.............-+00000000
00+.............-+00000000
00+.............-+00000000
00+.............-+00000000
0+............--=+00000000
+..+.........-....+0000000
+.-+...............+++0000
+--+.................-++00
0++0+-.............-----+0
0000+--..........--======+
00000+=--......--==+++++=+
000000+==------==++00000+0
0000000++======++000000000
000000000++++++00000000000`, config.palette).toDrawable().cache(),
};

export default class ChildGhost extends Drawable {
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
        const spriteName = this.direction.y == 'up' ? 'back' : 'front';

        this.levitationTimeInterval = (this.levitationTimeInterval + game.loop.dt) % 2;
        const levitationHeightRatio = Math.abs(this.levitationTimeInterval - 1) * 0.2;
        const levitationY = Math.round(levitationHeightRatio * this.height);

        let x = this.x;
        let y = this.y - levitationY;

        if (this.direction.x == 'right') {
            ctx.scale(-1, 1);
            x = -1 * this.x - this.width;
        }

        let drawable = pixmaps[spriteName];
        drawable.x = x;
        drawable.y = y;
        drawable.draw(ctx);
    }
}
