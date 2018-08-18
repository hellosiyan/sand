import Drawable from './Drawable';

export default class Circle extends Drawable {
    draw (ctx) {
        ctx.fillStyle = this.style.color;
        ctx.globalAlpha = this.style.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.style.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return this;
    }
}
