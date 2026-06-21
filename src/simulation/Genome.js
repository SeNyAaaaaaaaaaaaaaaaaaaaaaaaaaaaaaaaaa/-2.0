export default class Genome {
    constructor({
        speed = 2,
        vision = 90,
        fertility = 140,
        efficiency = 1
    } = {}) {
        this.speed = speed;
        this.vision = vision;
        this.fertility = fertility;
        this.efficiency = efficiency;
    }

    mutate() {
        const m = (v, a) =>
            v + (Math.random() - 0.5) * a;

        return new Genome({
            speed: Math.max(0.5, m(this.speed, 0.4)),
            vision: Math.max(30, m(this.vision, 12)),
            fertility: Math.max(90, m(this.fertility, 15)),
            efficiency: Math.max(0.4, m(this.efficiency, 0.15))
        });
    }
}