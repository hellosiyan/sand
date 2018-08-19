import SortedContainer from './lib/SortedContainer';
import { inGridTiles } from './utils';

import TileFloor from './elements/TileFloor';
import WallBuilder from './WallBuilder';

export default class Desert {
    constructor() {
        this.width = 10;
        this.height = 10;

        this.drawable = new SortedContainer().set({
            width: inGridTiles(this.width),
            height: inGridTiles(this.height),
        });

        this.createDrawables();

        this.floor = false;
    }

    placeActors(player) {
        player.x = inGridTiles(5);
        player.y = inGridTiles(5);

        this.drawable.addChild(player);
    }

    createDrawables() {
        this.drawable.addChild(this.createFloor());
        this.drawable.addChild(this.createWalls());
    }

    createFloor() {
        this.floor = new TileFloor();

        this.floor.set({
            x: inGridTiles(1),
            y: inGridTiles(1),
            width: inGridTiles(this.width - 2),
            height: inGridTiles(this.height - 2),
        });

        this.floor.cache();

        return this.floor;
    }

    createWalls() {
        return WallBuilder.buildAround(this.floor);
    }
}
