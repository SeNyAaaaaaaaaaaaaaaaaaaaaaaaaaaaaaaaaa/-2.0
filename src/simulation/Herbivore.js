import Organism from "./Organism";
import Genome from "./Genome";

export default class Herbivore extends Organism {
    constructor(x, y, genome = new Genome({
        speed: 2.3,
        vision: 100,
        fertility: 160,
        efficiency: 1.3,
        growthRate: 0.7
    })) {
        super(x, y, genome);
        this.baseRadius = 5;
        this.radius = this.baseRadius + genome.speed * 0.3;
        this.stamina = 1;
        this.color = this.computeColor(180, 30);
    }

    getHerdBonus(world) {
        const herdRadius = 70;
        const neighbors = world.organisms.filter(o =>
            o !== this && o.alive && o instanceof Herbivore &&
            this.distanceTo(o) < herdRadius
        ).length;
        return Math.min(0.3 + neighbors * 0.2, 1.0);
    }

    update(world) {
        if (!this.alive) return;
        this.updateBase();

        const predator = this.findClosest(
            world.organisms.filter(o =>
                o !== this && o.alive && o.constructor.name === "Carnivore"
            )
        );

        const food = this.findClosest(world.foods);
        this.target = food || predator;

        const herdBonus = this.getHerdBonus(world);

        if (predator && this.distanceTo(predator) < predator.genome.vision * 0.55) {
            const staminaDrain = 0.035 * (1 - herdBonus * 0.5);
            this.stamina = Math.max(0, this.stamina - staminaDrain);
            this.staminaTimer = 14;

            const fleeAngle = Math.atan2(
                this.y - predator.y,
                this.x - predator.x
            ) + (Math.random() - 0.5) * 0.6;

            this.seek({
                x: this.x + Math.cos(fleeAngle) * 12,
                y: this.y + Math.sin(fleeAngle) * 12
            });
        } else {
            if (this.staminaTimer > 0) {
                this.staminaTimer--;
            } else {
                this.stamina = Math.min(1, this.stamina + 0.02);
            }

            if (food) {
                this.seek(food);
                if (this.distanceTo(food) < 6) {
                    this.energy = Math.min(this.maxEnergy, this.energy + food.energy);
                    world.removeFood(food);
                }
            } else {
                this.direction += (Math.random() - 0.5) * 0.2;
            }
        }

        this._herdSpeedMultiplier = 1 + herdBonus * 0.4;
        this.move(world);
        this._herdSpeedMultiplier = 1;

        if (this.canReproduce()) {
            const mate = this.findClosest(
                world.organisms.filter(o =>
                    o instanceof Herbivore && o !== this && o.alive
                )
            );
            if (mate && Math.abs(this.radius - mate.radius) < 2.5) {
                this.energy *= 0.76;
                mate.energy *= 0.76;
                this.reproductionCooldown = this.getReproductionDelay() * 1.4;

                const childGenome = this.genome.combineWith(mate.genome);
                const child = new Herbivore(this.x, this.y, childGenome);
                child.generation = Math.max(this.generation, mate.generation) + 1;
                world.addOrganism(child);
                world.addParticle(this.x, this.y, this.color, 3); // частицы рождения
            }
        }
    }

    getCurrentSpeed() {
        let speed = super.getCurrentSpeed();
        if (this._herdSpeedMultiplier) {
            speed *= this._herdSpeedMultiplier;
        }
        return speed;
    }
}