import BasePngReader from './lib/PngReader';
import Pixmap from './Pixmap';

export default class PngReader extends BasePngReader {
    createPixmap(pixmapDefinition) {
        return Pixmap.load(pixmapDefinition.literal, pixmapDefinition.palette).toDrawable();
    }
};
