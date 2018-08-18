import Aisle from './elements/Aisle';
import VerticalAisle from './elements/VerticalAisle';
import { inGridTiles } from './utils';

export default class AisleBuilder {

    static newAisle(props) {
        let aisle;

        if (props.height >= props.width ) {
            aisle = new VerticalAisle();
        } else {
            aisle = new Aisle();
        }

        aisle.set(props);
        aisle.assemble();

        return aisle;
    }

}
