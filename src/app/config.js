const pixelSize = 3;

export const config = {
    size: {
        pixel: pixelSize,
        gridPixels: 30 * pixelSize,
        aisleHeight: 36 * pixelSize,
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
    }
};
