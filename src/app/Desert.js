import SortedContainer from './lib/SortedContainer';
import { inGridTiles } from './utils';

import SandTexture from './elements/SandTexture';
import Obstacle from './Obstacle';
import Fusebox from './Fusebox';
import ControlBoard from './ControlBoard';

export default class Desert {
    constructor() {
        this.width = 20;
        this.height = 20;

        this.drawable = new SortedContainer().set({
            width: inGridTiles(this.width),
            height: inGridTiles(this.height),
        });

        this.createDrawables();
    }

    placeActors(player) {
        player.x = this.sand.x + inGridTiles(6);
        player.y = this.sand.y + inGridTiles(11);

        this.drawable.addChild(player);
    }

    createDrawables() {
        this.drawable.addChild(this.createSand());
        this.drawable.addChild(this.createWalls());
        this.drawable.addChild(this.createFuseboxes());
        this.drawable.addChild(this.createControlBoard());
    }

    createSand() {
        this.sand = new SandTexture();

        this.sand.set({
            x: inGridTiles(1),
            y: inGridTiles(1),
            width: inGridTiles(this.width - 2),
            height: inGridTiles(this.height - 2),
        });

        this.sand.cache();

        return this.sand;
    }

    createWalls() {
        return [
            (new Obstacle()).set({
                x: this.sand.x + inGridTiles(2),
                y: this.sand.y + inGridTiles(7),
                width: this.sand.width - inGridTiles(4),
                height: inGridTiles(1),
            }),
            (new Obstacle()).set({
                x: this.sand.x + inGridTiles(2),
                y: this.sand.y + this.sand.height - inGridTiles(2),
                width: this.sand.width - inGridTiles(4),
                height: inGridTiles(1),
            }),
            (new Obstacle()).set({
                x: this.sand.x + inGridTiles(2),
                y: this.sand.y + inGridTiles(7),
                width: inGridTiles(1),
                height: this.sand.height - inGridTiles(8),
            }),
            (new Obstacle()).set({
                x: this.sand.x + this.sand.width - inGridTiles(3),
                y: this.sand.y + inGridTiles(7),
                width: inGridTiles(1),
                height: this.sand.height - inGridTiles(8),
            }),
        ];
    }

    createFuseboxes() {
        this.fuseboxes = [
            (new Fusebox()).set({
                x: this.sand.x + inGridTiles(4),
                y: this.sand.y + inGridTiles(9),
            }),
            (new Fusebox()).set({
                x: this.sand.x + inGridTiles(6),
                y: this.sand.y + inGridTiles(9),
            }),
        ];

        return this.fuseboxes;
    }

    createControlBoard() {
        this.controlBoard = (new ControlBoard()).set({
            x: this.sand.x + inGridTiles(8),
            y: this.sand.y + inGridTiles(9),
        });

        return this.controlBoard;
    }
}
