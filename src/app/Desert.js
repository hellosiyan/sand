import SortedContainer from './lib/SortedContainer';
import Container from './lib/Container';
import { inGridTiles, inPixels, fromGridTiles } from './utils';

import SandTexture from './elements/SandTexture';
import Plant from './elements/Plant';
import FuseboxPlate from './FuseboxPlate';
import Obstacle from './Obstacle';
import Fusebox from './Fusebox';
import Hut from './Hut';
import state from './State';

let cachedGround = false;

export default class Desert {
    constructor() {
        this.width = inGridTiles(30);
        this.height = inGridTiles(30);

        this.drawable = new SortedContainer().set({
            width: inGridTiles(this.width),
            height: inGridTiles(this.height),
        });

        if (! cachedGround) {
            cachedGround = this.createGround();
        }

        this.ground = cachedGround.addTo(this.drawable);

        this.drawable.addChild(this.createWalls());
        this.drawable.addChild(this.createHut());
    }

    placeActors(player) {
        const hutBox = this.hut.getCollisionBox();

        player.x = hutBox.right + inGridTiles(1);
        player.y = hutBox.bottom + inGridTiles(1);

        this.drawable.addChild(player);
    }

    createGround() {
        const topPadding = inGridTiles(7);
        const bottomPadding = inGridTiles(2);
        const sidePadding = inGridTiles(2);

        let ground = (new Container())
            .set({
                x: -1 * sidePadding,
                y: -1 * topPadding,
                width: this.width + 2 * sidePadding,
                height: this.height + topPadding + bottomPadding,
            });

        (new SandTexture())
            .set({
                x: 0,
                y: 0,
                width: ground.width,
                height: ground.height,
            })
            .addTo(ground);

        const areaInGridTiles = fromGridTiles(this.width) * fromGridTiles(this.height);
        let numPlants = Math.floor(areaInGridTiles / 2);

        while(numPlants--) {
            const kind = 1 + (numPlants % 6);
            (new Plant())
                .setKind(kind)
                .set({
                    x: state.pcg.randomBetween(0, ground.width, true),
                    y: state.pcg.randomBetween(0, ground.height, true),
                })
                .addTo(ground);
        }

        ground.cache();

        return ground;
    }

    createWalls() {
        const thickness = inPixels(1);

        return [
            [0, 0, this.width, thickness],
            [0, this.height - thickness, this.width, thickness],
            [0, 0, thickness, this.height],
            [this.width - thickness, 0, thickness, this.height]
        ].map(opt => (new Obstacle()).set({
            isWall: true,
            x: opt[0],
            y: opt[1],
            width: opt[2],
            height: opt[3],
        }));
    }

    createHut() {
        this.hut = new Hut();

        this.hut.set({
            x: (this.width - this.hut.width) / 2,
            y: this.height / 2 - this.hut.height
        });

        state.hut = this.hut;

        return this.hut;
    }

    placeStones(stones) {
        this.fuseboxes = [];
        this.fuseboxPlates = [];
        for(let letter in stones) {
            const position = stones[letter];
            this.fuseboxes.push(
                (new Fusebox())
                    .setLetter(letter)
                    .set({
                        x: inGridTiles(position.x),
                        y: inGridTiles(position.y),
                    })
                    .addTo(this.drawable)
            );
        }

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
}
