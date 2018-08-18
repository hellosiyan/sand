import Container from './Container';

export default class SortedContainer extends Container {
    draw (ctx) {
        this.drawChildren(ctx);
    }

    drawChildren(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        this.children
            .sort((a, b) => a.y - b.y)
            .forEach(child => {
                ctx.save();
                child.draw(ctx);
                ctx.restore();
            });

        ctx.restore();
    }
}
