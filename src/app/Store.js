import SortedContainer from './lib/SortedContainer';
import TileGrid from './lib/TileGrid';
import AisleBuilder from './AisleBuilder';
import Section from './Section';
import game from './Game';
import { inGridTiles } from './utils';

import TileFloor from './elements/TileFloor';
import WallBuilder from './WallBuilder';

const borderTile = 99;
const emptyTile = 0;

export default class Store {
    constructor(difficulty) {
        let minimumSize = 6;
        let difficultyToSizeRatio = 4;

        this.difficulty = difficulty;
        this.width = this.height = minimumSize + this.difficulty * difficultyToSizeRatio;

        this.tileGrid = new TileGrid();
        this.drawable = new SortedContainer().set({
            width: inGridTiles(this.width),
            height: inGridTiles(this.height),
        });

        this.sections = [];

        this.generateSections();
        this.constructTileGrid();
        this.createDrawables();

        this.floor = false;
    }

    placePeople(player, mom) {
        let emptyTileGrid = this.tileGrid.filter(emptyTile);
        let playerTile = game.prngs.pcg.pick(emptyTileGrid);
        const radius = 4;

        const possibleTileGrid = this.tileGrid.floodSelectOutsideRadius(playerTile, radius);

        let momTile = game.prngs.pcg.pick(possibleTileGrid);

        player.x = inGridTiles(playerTile.x);
        player.y = inGridTiles(playerTile.y);
        mom.x = inGridTiles(momTile.x);
        mom.y = inGridTiles(momTile.y);
    }

    createDrawables() {
        this.drawable.addChild(this.createFloor());
        this.drawable.addChild(this.createWalls());
        this.drawable.addChild(this.createAisles());
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

    createAisles() {
        const aisles = [];
        const grid = this.tileGrid.copy();
        const skipTiles = [emptyTile, borderTile];

        grid.each((x, y, tile) => {
            if (skipTiles.includes(tile)) return;

            const area = grid.continuousSelect(x, y);

            grid.fill(x, y, x + area.width, y + area.height, emptyTile);

            aisles.push(AisleBuilder.newAisle({
                x: inGridTiles(x),
                y: inGridTiles(y),
                width: inGridTiles(area.width),
                height: inGridTiles(area.height),
            }));
        });

        return aisles;
    }

    constructTileGrid() {
        this.tileGrid
            .resize(this.width, this.height)
            .fillBorder(borderTile);

        this.sections.forEach((section, sectionKey) =>
            this.tileGrid.overlayWith(
                section.getTileGrid(), section.x, section.y, sectionKey
            )
        );
    }

    generateSections() {
        // 1 block for borders + 1 block for aisles around the store
        let padding = 2;

        this.sections[1] = new Section().set({
            x: padding,
            y: padding,
            w: this.width - padding * 2,
            h: this.height - padding * 2,
            color: game.prngs.pcg.color(),
        });

        let isSectionDivisible = true;

        while (isSectionDivisible) {
            isSectionDivisible = false;

            this.sections.forEach(section => {
                let newSection = section.divide();

                if (!newSection) return;

                isSectionDivisible = true;
                this.sections.push(newSection);
            });
        }

        return this.sections;
    }
}
