import Entity from "./Entity";

export default class Organism extends Entity {
    constructor(x, y, genome) {
        super(x, y);
        this.genome = genome;
        this.worldSettings = { reproductionSpeed: 1 };

        this.energy = 90;
        this.maxEnergy = 220;
        this.age = 0;
        this.maxAge = 2200;
        this.alive = true;
        this.direction = Math.random() * Math.PI * 2;
        this.target = null;
        this.generation = 1;
        this.reproductionCooldown = 0;
        this.stamina = 1;
        this.staminaTimer = 0;
        this.size = 1;
        this.baseRadius = 5;
        this.radius = this.baseRadius;
    }

    kill() {
        this.alive = false;
    }

    getCurrentSpeed() {
        const sizePenalty = Math.max(0, this.radius - this.baseRadius) * 0.18;
        const speedMultiplier = 1 + sizePenalty * 1.4;
        const staminaFactor = 1 + (this.stamina || 0) * 0.8;
        return Math.max(
            this.genome.speed * 0.45,
            (this.genome.speed / speedMultiplier) * staminaFactor
        );
    }

    updateBase() {
        this.age++;
        this.reproductionCooldown = Math.max(0, this.reproductionCooldown - 1);
        this.energy -= 0.01 / this.genome.efficiency;

        if (this.energy <= 0 || this.age > this.maxAge) {
            this.kill();
        }
    }

    canReproduce() {
        if (this.reproductionCooldown > 0) return false;
        const speed = Math.max(0.5, this.worldSettings?.reproductionSpeed || 1);
        const threshold = this.genome.fertility * (0.78 + 0.18 / speed);
        const chance = Math.min(0.012, 0.003 * speed);
        return this.energy > threshold && Math.random() < chance;
    }

    getReproductionDelay() {
        const speed = Math.max(0.5, this.worldSettings?.reproductionSpeed || 1);
        return Math.max(90, Math.round(240 / speed));
    }

    move(world) {
        const speed = this.getCurrentSpeed();
        this.x += Math.cos(this.direction) * speed;
        this.y += Math.sin(this.direction) * speed;

        if (this.x < 0) { this.x = 0; this.direction = Math.PI - this.direction; }
        if (this.x > world.width) { this.x = world.width; this.direction = Math.PI - this.direction; }
        if (this.y < 0) { this.y = 0; this.direction = -this.direction; }
        if (this.y > world.height) { this.y = world.height; this.direction = -this.direction; }
    }

    seek(target) {
        this.direction = Math.atan2(target.y - this.y, target.x - this.x);
    }

    findClosest(list) {
        let best = null;
        let dist = Infinity;
        for (const item of list) {
            const d = this.distanceTo(item);
            if (d < this.genome.vision && d < dist) {
                best = item;
                dist = d;
            }
        }
        return best;
    }

    updateRadius() {
        this.radius = this.baseRadius + (this.size - 1) * 3.0;
    }

    computeColor(baseHue, saturationRange) {
        const hue = (baseHue + this.genome.vision * 0.3) % 360;
        const sat = 50 + this.genome.speed * 15;
        const light = 40 + this.genome.fertility * 0.1;
        return `hsl(${hue}, ${sat}%, ${light}%)`;
    }
}