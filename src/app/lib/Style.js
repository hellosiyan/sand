import Settable from './Settable';

export default class Style extends Settable() {
    constructor () {
        super();

        this.color = '#999';
        this.radius = 3;
        this.opacity = 1;

        this.lineColor = '#999';
        this.lineWidth = 0;
    }
}
