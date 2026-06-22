const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

export default class Genome {
    constructor({
        speed = 2,
        vision = 90,
        fertility = 140,
        efficiency = 1,
        growthRate = 0.7
    } = {}) {
        this.speed = speed;
        this.vision = vision;
        this.fertility = fertility;
        this.efficiency = efficiency;
        this.growthRate = growthRate;
    }

    mutate() {
        const m = (v, a) =>
            v + (Math.random() - 0.5) * a;

        return new Genome({
            speed: clamp(m(this.speed, 0.4), 0.6, 4.5),
            vision: clamp(m(this.vision, 12), 30, 180),
            fertility: clamp(m(this.fertility, 18), 90, 260),
            efficiency: clamp(m(this.efficiency, 0.15), 0.4, 1.8),
            growthRate: clamp(m(this.growthRate, 0.18), 0.2, 1.8)
        });
    }

    combineWith(other) {
        const mix = (a, b, spread = 0.15) =>
            clamp(
                (a + b) / 2 + (Math.random() - 0.5) * spread * (Math.abs(a - b) + 1),
                0,
                Infinity
            );

        return new Genome({
            speed: clamp(mix(this.speed, other.speed, 0.3), 0.6, 4.5),
            vision: clamp(mix(this.vision, other.vision, 12), 30, 180),
            fertility: clamp(mix(this.fertility, other.fertility, 18), 90, 260),
            efficiency: clamp(mix(this.efficiency, other.efficiency, 0.2), 0.4, 1.8),
            growthRate: clamp(mix(this.growthRate, other.growthRate, 0.2), 0.2, 1.8)
        });
    }
}