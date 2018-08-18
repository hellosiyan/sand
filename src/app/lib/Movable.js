const cos45 = 1 / Math.sqrt(2);

export default function Movable(baseClass) {
    if (! baseClass) {
        baseClass = class {};
    }

    class Movable extends baseClass {
        constructor() {
            super();

            this.direction = {
                x: '', // (left|right)
                y: '', // (up|down)
            };

            this.speed = 0;
        }

        move(deltaTime) {
            const movingDiagonally = (this.direction.x) && (this.direction.y);
            const speed = this.speed * deltaTime * (movingDiagonally ? cos45 : 1);

            if (this.direction.x == 'left') {
                this.x -= speed;
            } else if (this.direction.x == 'right') {
                this.x += speed;
            }

            if (this.direction.y == 'up') {
                this.y -= speed;
            } else if (this.direction.y == 'down') {
                this.y += speed;
            }
        }

        collisionResponseImpulse (target) {
            const impulse = {
                x: 0,
                y: 0,
            };

            // React only in the direction we are going
            if (this.direction.x === 'left') {
                impulse.x = target.x + target.width - this.x;
            } else if (this.direction.x === 'right') {
                impulse.x = -1 * (this.x + this.width - target.x);
            }

            if (this.direction.y === 'up') {
                impulse.y = target.y + target.height - this.y;
            } else if (this.direction.y === 'down') {
                impulse.y = -1 * (this.y + this.height - target.y);
            }

            // React only on one axis
            if (impulse.x !== 0 && impulse.y !== 0) {
                if (Math.abs(impulse.x) > Math.abs(impulse.y)) {
                    impulse.x = 0;
                } else {
                    impulse.y = 0;
                }
            }

            return impulse;
        }
    };

    return Movable;
}
