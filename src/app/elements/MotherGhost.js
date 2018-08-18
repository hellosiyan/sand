import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import game from '../Game';
import { config } from '../config';

const pixmaps = {
    front: Pixmap.load(`
000000+++++++0000000
00000+.......+000000
000++..........++000
00+..............+00
0+................+0
0+................+0
+.................-+
+....++-..++-.....-+
+....+++..+++.....-+
+.................-+
+.................-+
+.....++++++......-+
+-......---......-=+
0+...............-+0
0+...............-+0
0+...............-+0
+...+.........+..-+0
+..-+.......+..-+-+0
+--+........+---+-+0
0+++-.......+++.-+00
00+--..........--+00
00+--.........--+000
00+............-+000
0+=...........-+0000
0+-..........-+00000
+=..........-+000000
+-..........+0000000
+=-........-+0000000
0+=-........=+000000
00+==---....-=+00000
000++===------+00000
00000++++======+0000
000000000++++++00000`, config.palette).toDrawable().cache(),
};

export default class MotherGhost extends Drawable {
    constructor() {
        super();

        this.width = pixmaps.front.width;
        this.height = pixmaps.front.height;

        this.levitationTimeInterval = 1;
    }

    draw(ctx) {
        const spriteName = 'front';

        this.levitationTimeInterval = (this.levitationTimeInterval + game.loop.dt) % 2;
        const levitationHeightRatio = Math.abs(this.levitationTimeInterval - 1) * 0.2;
        const levitationY = Math.round(levitationHeightRatio * this.height);

        let x = this.x;
        let y = this.y - levitationY;

        let drawable = pixmaps[spriteName];
        drawable.x = x;
        drawable.y = y;
        drawable.draw(ctx);
    }
}
