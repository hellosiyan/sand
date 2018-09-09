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

export function fromGridTiles(value) {
    return Math.floor(value / config.size.gridPixels);
}

export function lerp(v0, v1, t) {
    return v0 + t * (v1 - v0);
}

export function randomBetween(min, max, round) {
    let num = Math.random() * (max - min + 1) + min;

    if (round) {
        num = Math.floor(num);
    }

    return num;
}

export function later(task, ms = 1) {
    setTimeout(task, ms);
}

export default { inPixels };
