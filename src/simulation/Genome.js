export default class Genome {
    constructor({
        speed = 2,
        vision = 80,
        fertility = 150,
        efficiency = 1
    } = {}) {

        this.speed = speed;
        this.vision = vision;
        this.fertility = fertility;
        this.efficiency = efficiency;
    }

    clone() {
        return new Genome({
            speed: this.speed,
            vision: this.vision,
            fertility: this.fertility,
            efficiency: this.efficiency
        });
    }

    mutate() {

        const m = (v, a) =>
            v + (Math.random() - 0.5) * a;

        return new Genome({
            speed: Math.max(0.5, m(this.speed, 0.5)),
            vision: Math.max(20, m(this.vision, 15)),
            fertility: Math.max(80, m(this.fertility, 20)),
            efficiency: Math.max(0.4, m(this.efficiency, 0.2))
        });
    }
}