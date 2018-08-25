import SortedContainer from './lib/SortedContainer';
import { inGridTiles, inPixels } from './utils';

import SandTexture from './elements/SandTexture';
import FuseboxPlate from './FuseboxPlate';
import Obstacle from './Obstacle';
import Fusebox from './Fusebox';
import ControlBoard from './ControlBoard';
import ControlBoardPlate from './ControlBoardPlate';
import MessagePort from './MessagePort';
import MessagePortPlate from './MessagePortPlate';
import state from './State';

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
        player.x = this.ground.x + inGridTiles(10);
        player.y = this.ground.y + inGridTiles(13);

        this.drawable.addChild(player);
    }

    createDrawables() {
        this.drawable.addChild(this.createGround());
        this.drawable.addChild(this.createWalls());
        this.drawable.addChild(this.createFuseboxes());
        this.drawable.addChild(this.createControlBoard());
        this.drawable.addChild(this.createMessagePort());
    }

    createGround() {
        this.ground = new SandTexture();

        this.ground.set({
            x: inGridTiles(1),
            y: inGridTiles(1),
            width: inGridTiles(this.width - 2),
            height: inGridTiles(this.height - 2),
        });

        this.ground.cache();

        return this.ground;
    }

    createWalls() {
        return [
            (new Obstacle()).set({
                x: this.ground.x + inGridTiles(2),
                y: this.ground.y + inGridTiles(7),
                width: this.ground.width - inGridTiles(4),
                height: inGridTiles(1),
            }),
            (new Obstacle()).set({
                x: this.ground.x + inGridTiles(2),
                y: this.ground.y + this.ground.height - inGridTiles(2),
                width: this.ground.width - inGridTiles(4),
                height: inGridTiles(1),
            }),
            (new Obstacle()).set({
                x: this.ground.x + inGridTiles(2),
                y: this.ground.y + inGridTiles(7),
                width: inGridTiles(1),
                height: this.ground.height - inGridTiles(8),
            }),
            (new Obstacle()).set({
                x: this.ground.x + this.ground.width - inGridTiles(3),
                y: this.ground.y + inGridTiles(7),
                width: inGridTiles(1),
                height: this.ground.height - inGridTiles(8),
            }),
        ];
    }

    createFuseboxes() {
        this.fuseboxes = [
            (new Fusebox()).setLetter('a').set({
                x: this.ground.x + inGridTiles(4),
                y: this.ground.y + inGridTiles(10),
            }),
            (new Fusebox()).setLetter('b').set({
                x: this.ground.x + inGridTiles(6),
                y: this.ground.y + inGridTiles(10),
            }),
            (new Fusebox()).setLetter('c').set({
                x: this.ground.x + inGridTiles(4),
                y: this.ground.y + inGridTiles(12),
            }),
        ];

        this.fuseboxPlates = [];
        this.fuseboxes.forEach(fusebox => {
            this.fuseboxPlates.push(
                (new FuseboxPlate()).set({
                    x: fusebox.x,
                    y: fusebox.y + fusebox.height + inPixels(1),
                }).addTo(this.drawable)
            );
        });

        state.fuseboxes = this.fuseboxes;
        state.fuseboxPlates = this.fuseboxPlates;

        return this.fuseboxes;
    }

    createControlBoard() {
        state.controlBoard = (new ControlBoard()).set({
            x: this.ground.x + inGridTiles(8),
            y: this.ground.y + inGridTiles(9),
        });

        state.controlBoardPlate = (new ControlBoardPlate()).set({
            x: state.controlBoard.x + inPixels(13),
            y: state.controlBoard.y + state.controlBoard.height,
            width: state.controlBoard.width - inPixels(17)
        });

        return [
            state.controlBoard,
            state.controlBoardPlate,
        ];
    }

    createMessagePort() {
        if (state.messagePort) {
            return state.messagePort;
        }

        state.messagePort = (new MessagePort()).set({
            x: this.ground.x + inGridTiles(11),
            y: this.ground.y + inGridTiles(10),
        }).setLetters('a');

        state.messagePortPlate = (new MessagePortPlate()).set({
            x: state.messagePort.x,
            y: state.messagePort.y + state.messagePort.height,
            width: state.messagePort.width,
            height: inGridTiles(0.5),
        });

        return [
            state.messagePort,
            state.messagePortPlate
        ];
    }
}
