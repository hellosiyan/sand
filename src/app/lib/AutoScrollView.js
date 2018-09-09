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

        this.lastMove = {
            x: 0,
            y: 0
        }
    }

    addChild (child) {
        super.addChild(child);
    }

    draw (ctx) {
        this.moveTargetIntoView();

        return super.draw(ctx);
    }

    moveTargetIntoView() {
        const coords = this.target.positionAtAncestor(this);
        const child = this.children[0];

        this.lastMove.x = this.lastMove.y = 0;

        if (this.target.width < this.boundries.right - this.boundries.left ) {
            if (coords.x < this.boundries.left) {
                this.lastMove.x = this.boundries.left - coords.x;
                child.x += this.lastMove.x;
            } else if (coords.x + this.target.width > this.boundries.right) {
                this.lastMove.x = -1 * (coords.x + this.target.width - this.boundries.right);
                child.x += this.lastMove.x;
            }
        } else {
            // Target is wider than allowed zone - default to left align
            this.lastMove.x = this.boundries.left - coords.x;
            child.x += this.lastMove.x;
        }

        if (this.target.height < this.boundries.bottom - this.boundries.top ) {
            if (coords.y < this.boundries.top) {
                this.lastMove.y = this.boundries.top - coords.y;
                child.y += this.lastMove.y;
            } else if (coords.y + this.target.height > this.boundries.bottom) {
                this.lastMove.y = -1 * (coords.y + this.target.height - this.boundries.bottom);
                child.y += this.lastMove.y;
            }
        } else {
            // Target is higher than allowed zone - default to top align
            this.lastMove.y = this.boundries.top - coords.y;
            child.y += this.lastMove.y;
        }
    }
}
