import Settable from './Settable';

export default class Style extends Settable() {
    constructor () {
        super();

        this.color = '#999';
        this.opacity = 1;
    }
}
