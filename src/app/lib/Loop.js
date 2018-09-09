// import Stats from './Stats';

// const stats = Stats(0);

export default class Loop {

    constructor() {
        this.dt = 0;
        this.play = false;
        this.showStats = false;
        this.lastTime = this.timestamp();
        this.worker = () => {};

        // document.body.appendChild(stats.dom);
    }

    start (worker) {
        this.play = true;
        this.worker = worker;

        this.lastTime = this.timestamp();
        return this.raf();
    }

    stats (showStats) {
        this.showStats = showStats;
    }

    stop () {
        this.play = false;
    }

    tick(dt) {
        this.worker(dt);
        if (this.play) this.raf();
    }

    timestamp () {
        return window.performance.now();
    }

    raf () {
        return window.requestAnimationFrame(() => {
            if (! this.play) {
                return;
            }

            // this.showStats && stats.begin();

            let now = this.timestamp();
            let dt = now - this.lastTime;

            if (dt > 999) {
                dt = 1 / 60;
            } else {
                dt /= 1000;
            }

            this.dt = dt;
            this.lastTime = now;

            this.tick(dt);

            // this.showStats && stats.end();
        });
    }
}
