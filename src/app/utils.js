import { config } from './config';

export function inPixels(value) {
    return value * config.size.pixel;
}

export function fromPixels(value) {
    return Math.floor(value / config.size.pixel);
}

export function inGridTiles(value) {
    return value * config.size.gridPixels;
}

export default { inPixels };
