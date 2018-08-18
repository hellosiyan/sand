import Drawable from './Drawable';

export default class Rectangle extends Drawable{
    draw (ctx) {
        ctx.fillStyle = this.style.color;
        ctx.globalAlpha = this.style.opacity;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.style.lineWidth) {
            ctx.lineWidth = this.style.lineWidth;
            ctx.strokeStyle = this.style.lineColor;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        return this;
    }
}
