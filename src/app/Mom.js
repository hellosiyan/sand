import Container from './lib/Container';
import MotherGhost from './elements/MotherGhost';
import { inPixels } from './utils';

export default class Mom extends Container {
    constructor() {
        super();

        this.ghost = new MotherGhost();
        this.addChild(this.ghost);

        this.width = this.ghost.width;
        this.height = inPixels(3);

        this.ghost.alignWith(this.innerBox).bottomEdges();

        const ghostHoverHeight = inPixels(1);
        this.ghost.y -= ghostHoverHeight;
    }
}
