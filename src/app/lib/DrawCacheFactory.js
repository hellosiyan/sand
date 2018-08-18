import Canvas from './Canvas';
import Drawable from './Drawable';

const maxPadIterations = 20;
const padRestictions = {
    min: 1,
    max: 50
}

export default class DrawCacheFactory {
    static cache(drawable) {
        const factory = new DrawCacheFactory(drawable);

        factory.fitCanvasToDrawable();

        const overflowArea = factory.getOverflowArea();

        drawable.draw = function (ctx) {
            ctx.drawImage(factory.canvas.node, this.x - overflowArea.left, this.y - overflowArea.top);
        };

        return drawable;
    }

    constructor(drawable) {
        this.drawable = drawable;

        this.savedCoordinates = { x: 0, y: 0 };
        this.canvas = new Canvas();

        this.padding = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };

        /**
         * Making padSize a function of the drawable's longest dimension
         * ensures that the canvas can grow enough within maxPadIterations
         */
        this.padSize = Math.round(Math.min(
            padRestictions.max,
            padRestictions.min + Math.max(this.drawable.width, this.drawable.height) / 10
        ));

        this.discovered = {
            top: false,
            bottom: false,
            left: false,
            right: false,
        };
    }

    getOverflowArea() {
        if (! this.allOverflowDiscovered()) {
            throw 'Overflow area not discovered. Call fitCanvasToDrawable() first.';
        }

        return this.padding;
    }

    fitCanvasToDrawable() {
        this.saveDrawableCoordinates();

        let padIteration = 0;

        this.pad({
            top: this.padSize,
            bottom: this.padSize,
            left: this.padSize,
            right: this.padSize,
        });

        do {
            const { padBy, shrinkBy } = this.evaluateEmptyArea();

            this.shrink(shrinkBy);

            if (this.allOverflowDiscovered()) {
                break;
            }

            this.pad(padBy);

        } while (++padIteration <= maxPadIterations);

        this.restoreDrawableCoordinates();

        return this.padding;
    }

    evaluateEmptyArea() {
        const emptyArea = this.getEmptyArea();
        const shrinkBy = {};
        const padBy = {};

        Object.keys(emptyArea).forEach(direction => {
            if (this.discovered[direction]) {
                return;
            }

            if (emptyArea[direction] > 0) {
                shrinkBy[direction] = emptyArea[direction];
                this.discovered[direction] = true;
            } else {
                // no empty area - expand in that direction
                padBy[direction] = this.padSize;
            }
        });

        if (
            shrinkBy.top === this.canvas.height
            || shrinkBy.left === this.canvas.width
        ) {
            throw 'No graphics found within cache viewport';
        }

        return { padBy, shrinkBy };
    }

    allOverflowDiscovered() {
        return Object.values(this.discovered).every(value => value);
    }

    getEmptyArea() {
        const data = this.getAlphaChannelData();
        const emptyArea = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
        const height = this.canvas.height;
        const width = this.canvas.width;

        if (! this.discovered.top) {
            top:
            for (let ih = 0; ih < height; ih++) {
                for (let iw = 0; iw < width; iw++) {
                    if (data[iw + ih * width]) {
                        break top;
                    }
                }

                emptyArea.top++;
            }
        }

        if (! this.discovered.bottom) {
            bottom:
            for (let ih = height - 1; ih >= 0; ih--) {
                for (let iw = 0; iw < width; iw++) {
                    if (data[iw + ih * width]) {
                        break bottom;
                    }
                }

                emptyArea.bottom++;
            }
        }

        if (! this.discovered.left) {
            left:
            for (let iw = 0; iw < width; iw++) {
                for (let ih = 0; ih < height; ih++) {
                    if (data[iw + ih * width]) {
                        break left;
                    }
                }

                emptyArea.left++;
            }
        }

        if (! this.discovered.right) {
            right:
            for (let iw = width - 1; iw >= 0; iw--) {
                for (let ih = 0; ih < height; ih++) {
                    if (data[iw + ih * width]) {
                        break right;
                    }
                }

                emptyArea.right++;
            }
        }

        return emptyArea;
    }

    getAlphaChannelData() {
        const imageData = this.canvas.getImageDataArray();
        const alphaData = [];

        for (let i = 3; i < imageData.length; i += 4) {
            alphaData.push(imageData[i] !== 0);
        }

        return alphaData;
    }

    pad(size) {
        if (typeof size === 'number') {
            size = {
                top: size,
                bottom: size,
                left: size,
                right: size,
            };
        }

        size = Object.assign({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }, size);

        this.padding.top += size.top;
        this.padding.bottom += size.bottom;
        this.padding.left += size.left;
        this.padding.right += size.right;

        this.resizeCanvas();

        return this;
    }

    shrink(size) {
        if (typeof size === 'number') {
            size = {
                top: size,
                bottom: size,
                left: size,
                right: size,
            };
        }

        size = Object.assign({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }, size);

        this.padding.top = Math.max(0, this.padding.top - size.top);
        this.padding.bottom = Math.max(0, this.padding.bottom - size.bottom);
        this.padding.left = Math.max(0, this.padding.left - size.left);
        this.padding.right = Math.max(0, this.padding.right - size.right);

        this.resizeCanvas();

        return this;
    }

    resizeCanvas() {
        this.drawable.set({
            x: this.padding.left,
            y: this.padding.top,
        });

        this.canvas.clear().setSize(
            this.drawable.width + this.padding.left + this.padding.right,
            this.drawable.height + this.padding.top + this.padding.bottom,
            false
        );

        this.drawable.draw(this.canvas.ctx);

        return this;
    }

    saveDrawableCoordinates() {
        this.savedCoordinates = {
            x: this.drawable.x,
            y: this.drawable.y,
        };

        return this;
    }

    restoreDrawableCoordinates() {
        this.drawable.set(this.savedCoordinates);

        return this;
    }
}
