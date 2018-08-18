export default class Canvas {
    constructor() {
        this.width = 1;
        this.height = 1;
        this.autoClear = true;
        this.scene = null;

        this.node = this._createCanvas();
        this.ctx = this.node.getContext('2d');
    }

    setSize(width, height, adjustForHiDPI = true) {
        this.node.width = this.node.style.width = this.width = width;
        this.node.height = this.node.style.height = this.height = height;

        if (adjustForHiDPI) {
            this.fixPixelRatio();
        }

        return this;
    }

    fixPixelRatio() {
        let devicePixelRatio = window.devicePixelRatio || 1;
        let backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
            this.ctx.mozBackingStorePixelRatio ||
            this.ctx.msBackingStorePixelRatio ||
            this.ctx.oBackingStorePixelRatio ||
            this.ctx.backingStorePixelRatio || 1;

        if (devicePixelRatio === backingStoreRatio) {
            return;
        }

        let ratio = devicePixelRatio / backingStoreRatio;

        let oldWidth = this.node.width;
        let oldHeight = this.node.height;

        this.node.width = oldWidth * ratio;
        this.node.height = oldHeight * ratio;

        this.node.style.width = oldWidth + 'px';
        this.node.style.height = oldHeight + 'px';

        this.ctx.scale(ratio, ratio);
    }

    appendTo(container) {
        container.appendChild(this.node);

        return this;
    }

    setScene (scene) {
        this.scene = scene;

        return this;
    }

    draw () {
        if (this.autoClear) this.clear();

        this.ctx.save();
        this.scene.draw(this.ctx);
        this.ctx.restore();
    }

    clear () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        return this;
    }

    getImageDataArray() {
        const maxCanvasArea = 50000000;
        const canvasArea = this.width * this.height;

        if (canvasArea > maxCanvasArea) {
            throw `Cannot get imageData for canvas area bigger than ${maxCanvasArea}`;
        }

        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);

        return imageData.data;
    }

    _createCanvas() {
        let canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        return canvas;
    }
}
