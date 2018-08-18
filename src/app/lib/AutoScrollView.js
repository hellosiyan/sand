import Container from './Container';

export default class AutoScrollView extends Container {
    constructor() {
        super();

        this.target = null;
        this.boundries = {
            left: 0,
            right: 1,
            top: 0,
            bottom: 1,
        };
    }

    addChild (child) {
        super.addChild(child);

        if (this.children.length > 1) {
            throw 'AutoScrollView cannot have more than one child';
        }
    }

    draw (ctx) {
        this.moveTargetIntoView();

        return super.draw(ctx);
    }

    moveTargetIntoView() {
        const coords = this.target.positionAtAncestor(this);

        if (this.target.width < this.boundries.right - this.boundries.left ) {
            if (coords.x < this.boundries.left) {
                this.children[0].x += this.boundries.left - coords.x;
            } else if (coords.x + this.target.width > this.boundries.right) {
                this.children[0].x -= coords.x + this.target.width - this.boundries.right;
            }
        } else {
            // Target is wider than allowed zone - default to left align
            this.children[0].x += this.boundries.left - coords.x;
        }

        if (this.target.height < this.boundries.bottom - this.boundries.top ) {
            if (coords.y < this.boundries.top) {
                this.children[0].y += this.boundries.top - coords.y;
            } else if (coords.y + this.target.height > this.boundries.bottom) {
                this.children[0].y -= coords.y + this.target.height - this.boundries.bottom;
            }
        } else {
            // Target is higher than allowed zone - default to top align
            this.children[0].y += this.boundries.top - coords.y;
        }
    }
}
