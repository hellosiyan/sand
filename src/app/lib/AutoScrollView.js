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
        if (this.children.length >= 1) {
            throw 'AutoScrollView cannot have more than one child';
        }

        super.addChild(child);
    }

    draw (ctx) {
        this.moveTargetIntoView();

        return super.draw(ctx);
    }

    moveTargetIntoView() {
        const coords = this.target.positionAtAncestor(this);
        const child = this.children[0];

        if (this.target.width < this.boundries.right - this.boundries.left ) {
            if (coords.x < this.boundries.left) {
                child.x += this.boundries.left - coords.x;
            } else if (coords.x + this.target.width > this.boundries.right) {
                child.x -= coords.x + this.target.width - this.boundries.right;
            }
        } else {
            // Target is wider than allowed zone - default to left align
            child.x += this.boundries.left - coords.x;
        }

        if (this.target.height < this.boundries.bottom - this.boundries.top ) {
            if (coords.y < this.boundries.top) {
                child.y += this.boundries.top - coords.y;
            } else if (coords.y + this.target.height > this.boundries.bottom) {
                child.y -= coords.y + this.target.height - this.boundries.bottom;
            }
        } else {
            // Target is higher than allowed zone - default to top align
            child.y += this.boundries.top - coords.y;
        }
    }
}
