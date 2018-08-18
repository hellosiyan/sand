export default class Align {

    constructor(base, target) {
        this.base = base;
        this.target = target;
    }

    bottomEdges() {
        this.target.y = this.base.y + this.base.height - this.target.height;

        return this.target;
    }

    rightEdges() {
        this.target.x = this.base.x + this.base.width - this.target.width;

        return this.target;
    }

    centerBottomEdge() {
        this.target.y = Math.round(this.base.y + this.base.height / 2 - this.target.height);

        return this.target;
    }

    centerVertically() {
        this.target.x = Math.round(this.base.x + this.base.width / 2 - this.target.width / 2);

        return this.target;
    }

    do(...strategies) {
        strategies.forEach(strategy => this[strategy]());

        return this.target;
    }

}
