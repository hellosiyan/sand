import Rectangle from '../lib/Rectangle';
import Collidable from '../lib/Collidable';
import Pixmap from '../Pixmap';
import { inGridTiles } from '../utils';
import { config } from '../config';

const pixmaps = {
    top: Pixmap.load(`
33333333333333
66666666666666
99999999999999
aaaaaaaaaaaaaa
33333333333333
3c99999999999c
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fffffffffffff
33333333333333
36666666666666
3aaaaaaaaaaaaa
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
33333333333333
99999999999999
99999999999999
66666666666666
33333333333333`, config.palette),
    left: Pixmap.load(`
3699999a3`, config.palette),
    right: Pixmap.load(`
3a9999963`, config.palette),
    bottom: Pixmap.load(`
3
a
9
9
6
3`, config.palette),
};

export default class Wall extends Collidable(Rectangle) {
    constructor() {
        super();

        this.setType('top'); // (top|bottom|left|right)

        this.width = inGridTiles(1);
        this.height = inGridTiles(1);

        this.graphic = false;
    }

    setType(type) {
        this.type = type;

        return this;
    }

    getRenderSize() {
        return pixmaps[this.type].getRenderSize();
    }

    placeAt(point) {
        switch (this.type) {
            case 'top':
                this.x = point.x;
                this.y = point.y - this.height;
                break;
            case 'bottom':
                this.x = point.x;
                this.y = point.y;
                break;
            case 'left':
                this.x = point.x - this.width;
                this.y = point.y;
                break;
            case 'right':
                this.x = point.x;
                this.y = point.y;
                break;
        }

        return this;
    }

    resizeTo(size) {
        switch (this.type) {
            case 'top':
            case 'bottom':
                this.width = Math.abs(size);
                if (size < 0) this.x += size;
                break;
            case 'left':
            case 'right':
                this.height = Math.abs(size);
                if (size < 0) this.y += size;
                break;
        }

        return this;
    }

    getCollisionBox() {
        const cornerSize = inGridTiles(1);
        const collisionBox = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };

        if (this.type === 'top' || this.type === 'bottom') {
            collisionBox.left -= cornerSize;
            collisionBox.right += cornerSize;
        } else {
            collisionBox.top -= cornerSize;
            collisionBox.bottom += cornerSize;
        }

        return collisionBox;
    }

    draw(ctx) {
        ctx.translate(this.x, this.y);
        this.graphic.draw(ctx);
    }

    assemble() {
        const pixmap = pixmaps[this.type];

        if (this.type === 'top' || this.type === 'bottom') {
            this.graphic = pixmap.toPatternedDrawable({ width: this.width }, 'repeat-x');
        } else {
            this.graphic = pixmap.toPatternedDrawable({ height: this.height }, 'repeat-y');
        }

        // Align drawable to bottom
        if (this.type === 'top') {
            this.graphic.alignWith(this).bottomEdges();
        }

        // Align drawable to right
        if (this.type === 'left') {
            this.graphic.alignWith(this).rightEdges();
        }

        return this;
    }
}
