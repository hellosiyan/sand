import Settable from './Settable';
import Style from './Style';
import Canvas from './Canvas';
import DrawCacheFactory from './DrawCacheFactory';
import AlignOp from './ops/Align';

export default class Drawable extends Settable() {
    constructor() {
        super();

        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
        this.style = new Style();
        this.parent = null;
    }

    draw() {}

    getCollisionBox() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };
    }

    intersects (target) {
        const box = this.getCollisionBox();
        const targetBox = target.getCollisionBox();

        if (box.left < targetBox.right &&
            box.right > targetBox.left &&
            box.top < targetBox.bottom &&
            box.bottom > targetBox.top
        ) {
            return true;
        }

        return false;
    }

    addTo (container) {
        container.addChild(this);
    }

    setStyle(styles) {
        this.style.set(styles);
        return this;
    }

    cache() {
        DrawCacheFactory.cache(this);

        return this;
    }

    asCanvas() {
        const canvas = new Canvas()
            .setSize(this.width, this.height, false);

        canvas.ctx.save();
        canvas.ctx.translate(-1 * this.x, -1 * this.y);

        this.draw(canvas.ctx);

        canvas.ctx.restore();

        return canvas;
    }

    positionAtAncestor(ancestor) {
        let parent = this.parent;
        let position = {
            x: this.x,
            y: this.y,
        };

        while (parent !== null && ancestor !== parent) {
            position.x += parent.x;
            position.y += parent.y;

            parent = parent.parent;
        }

        return position;
    }

    distanceTo(target) {
        let thisCenter = this.center;
        let targetCenter = target.center;

        const distanceX = thisCenter.x - targetCenter.x;
        const distanceY = thisCenter.y - targetCenter.y;
        return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    }

    alignWith(base) {
        return new AlignOp(base, this);
    }

    get center() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
        };
    }
}
