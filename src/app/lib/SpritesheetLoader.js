import Spritesheet from './Spritesheet';

const SpritesheetLoader = {
    create(url, spriteDefinitions) {
        return new Promise(resolve => {
            this.load(url)
                .then(image => this.drawSprites(image, spriteDefinitions))
                .then(sprites => resolve((new Spritesheet).set({ sprites })));
        });
    },

    load(url) {
        return new Promise(resolve => {
            let img = new Image();
            img.addEventListener('load', () => resolve(img), false);
            img.src = url;
        });
    },

    drawSprites(image, spriteDefinitions) {
        let sprites = {};

        Object.keys(spriteDefinitions).forEach(spriteName => {
            let sprite = spriteDefinitions[spriteName];
            let canvas = document.createElement('canvas');

            canvas.width = sprite.w;
            canvas.height = sprite.h;

            canvas.getContext('2d').drawImage(
                image,
                sprite.x, sprite.y,
                sprite.w, sprite.h,
                0, 0,
                sprite.w, sprite.h
            );

            sprites[spriteName] = {
                width: sprite.w,
                height: sprite.h,
                canvas: canvas,
            };
        });

        return Promise.resolve(sprites);
    },
};

export default SpritesheetLoader;
