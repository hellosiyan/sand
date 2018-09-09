const pixelSize = 3;

export const config = {
    size: {
        pixel: pixelSize,
        gridPixels: 30 * pixelSize,
    },
    speed: {
        initial: 7 * pixelSize,
        max: 100 * pixelSize,
        acceleration: 550 * pixelSize,
    },
    palette: {
        0: 'rgba(0,0,0,0)',
        '1': '#000',
        '.': '#fff',
        '+': '#666',
        '-': '#eee',
        '=': '#ccc',
        'b': '#133354',
        '3': '#0A0507',
        '6': '#1D1833',
        '9': '#463E60',
        'a': '#585072',
        'c': '#6A628E',
        'f': '#9084BC',
        'A': '#132339',
        'B': '#162c44',
        'C': '#17314a',
    },
    palettes: {
        flat: {
            '0': 'rgba(0,0,0,0)',
            '1': '#fbd649', // yellow
            '2': '#a56b01', // dark yellow
            '3': '#00b1e3', // blue
            '4': '#005d7b', // dark blue
            '5': '#fe5c27', // red
            '6': '#bc2a01', // dark red
            '7': '#f07287', // pink
            '8': '#ea6176', // dark pink
            '9': '#0c923d', // green
            'a': '#006a1b', // dark green
            'b': '#004601', // darker green
            'c': '#ffffff', // white
            'd': '#b6b2b3' // grey
        },
        sand: {
            '0': '#f8d95a',
            '1': '#876701',
        },
        fusebox: {
            '0': 'rgba(0,0,0,0)',
            '1': '#060f19',
            '2': '#183c66',
            '3': '#04b7e9',
        },
        controlBoard: {
            '0': 'rgba(0,0,0,0)',
            '1': '#555',
            '2': '#444',
        },
        runes: {
            '0': 'rgba(0,0,0,0)',
            '1': '#000',
            '2': 'rgba(0,0,0,0)',
        },
        outlinedRunes: {
            '0': 'rgba(0,0,0,0)',
            '1': '#000',
            '2': '#fff',
        },
        glowingRunes: {
            '0': 'rgba(0,0,0,0)',
            '1': '#000',
            '2': '#0f0',
        },
        timer: {
            '0': '#000',
            '1': '#183c66',
            '2': '#04b7e9',
        },
    }
};
