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
    palettes: {
        // flat: {
        //     '0': 'rgba(0,0,0,0)',
        //     '1': '#fbd649', // yellow
        //     '2': '#a56b01', // dark yellow
        //     '3': '#00b1e3', // blue
        //     '4': '#005d7b', // dark blue
        //     '5': '#fe5c27', // red
        //     '6': '#bc2a01', // dark red
        //     '7': '#f07287', // pink
        //     '8': '#ea6176', // dark pink
        //     '9': '#0c923d', // green
        //     'a': '#006a1b', // dark green
        //     'b': '#004601', // darker green
        //     'c': '#ffffff', // white
        //     'd': '#b6b2b3' // grey
        // },
        sand: {
            // '0': '#f8d95a',
            // '0': 'rgb(248,217,90,0.7)',
            '0': '#fbe58c',
            '1': '#876701',
        },
        fusebox: {
            '0': 'rgba(0,0,0,0)',
            '1': '#060f19',
            '2': '#183c66',
            '3': '#04b7e9',
        },
        runes: {
            '0': 'rgba(0,0,0,0)',
            '1': '#000',
            '2': 'rgba(0,0,0,0)',
        },
        glowingRunes: {
            '0': 'rgba(0,0,0,0)',
            '1': '#000',
            '2': '#00b1e3',
        },
        glowingRunesCorrect: {
            '0': 'rgba(0,0,0,0)',
            '1': '#000',
            '2': '#0c923d',
        },
        glowingRunesIncorrect: {
            '0': 'rgba(0,0,0,0)',
            '1': '#000',
            '2': '#bc2a01',
        },
        timer: {
            // '0': '#000',
            // '1': '#183c66',
            // '2': '#04b7e9',
            '0': '#876701',
            '1': '#fbd649',
            '2': '#fff',
        },
        plants: {
            '0': 'rgba(0,0,0,0)',
            '1': 'rgba(229,115,136,255)',
            '2': 'rgba(0,177,227,255)',
            '3': 'rgba(0,134,201,255)',
        },
        playerHut: {
            '0': 'rgba(0,0,0,0)',
            '1': 'rgba(0,134,201,255)',
            '2': 'rgba(0,177,227,255)',
            '3': 'rgba(2,136,209,255)',
            '4': 'rgba(249,168,37,255)',
            '5': 'rgba(251,192,45,255)',
            '6': 'rgba(48,63,159,255)',
            '7': 'rgba(255,255,255,255)',
            '8': 'rgba(255,202,40,255)',
            '9': 'rgba(3,169,244,255)',
            'a': 'rgba(2,119,189,255)',
            'b': 'rgba(63,81,181,255)',
            'c': 'rgba(255,183,77,255)',
            'd': 'rgba(255,204,128,255)',
            'e': 'rgba(245,127,23,255)',
            'f': 'rgba(77,208,225,255)',
            'g': 'rgba(128,222,234,255)',
            'h': 'rgba(0,172,193,255)',
        }
    }
};
