import Rectangle from '../lib/Rectangle';
import Pixmap from '../Pixmap';
import { inGridTiles } from '../utils';
import { config } from '../config';

const pixmaps = {
    left: Pixmap.load(`
3699999a3`, config.palette),
    right: Pixmap.load(`
3a9999963`, config.palette),
    leftTop: Pixmap.load(`
333333333
366666666
369999999
3699999aa
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3`, config.palette),
    rightTop: Pixmap.load(`
333333333
666666663
999999963
aa9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963`, config.palette),
    leftBottom: Pixmap.load(`
3699999a3
3699999aa
369999999
369999999
366666666
333333333`, config.palette),
    rightBottom: Pixmap.load(`
3a9999963
aa9999963
999999963
999999963
666666663
333333333`, config.palette),
};

export default class Corner extends Rectangle {
    constructor() {
        super();

        this.setType('leftTop'); // (leftTop|rightTop|leftBottom|rightBottom)

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
            case 'leftTop':
                this.x = point.x - this.width;
                this.y = point.y - this.height;
                break;
            case 'rightTop':
                this.x = point.x;
                this.y = point.y - this.height;
                break;
            case 'leftBottom':
                this.x = point.x - this.width;
                this.y = point.y;
                break;
            case 'rightBottom':
                this.x = point.x;
                this.y = point.y;
                break;
        }

        return this;
    }

    draw(ctx) {
        ctx.translate(this.x, this.y);
        this.graphic.draw(ctx);
    }

    assemble() {
        this.graphic = pixmaps[this.type].toDrawable().cache();

        // Align drawable to bottom
        if (this.type.toLowerCase().includes('top')) {
            this.graphic.alignWith(this).bottomEdges();
        }

        // Align drawable to right
        if (this.type.toLowerCase().includes('left')) {
            this.graphic.alignWith(this).rightEdges();
        }

        return this;
    }
}
