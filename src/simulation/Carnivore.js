import Organism from "./Organism";
import Genome from "./Genome";
import Herbivore from "./Herbivore";

export default class Carnivore extends Organism {

    constructor(x, y, genome = new Genome({
        speed: 2.0,
        vision: 110,
        fertility: 210,
        efficiency: 1.0,
        growthRate: 0.8
    })) {
        super(x, y, genome);

        this.color = "#ef4444";
        this.baseRadius = 6;
        this.radius = this.baseRadius + genome.speed * 0.25;
    }

    update(world) {

        if (!this.alive) return;

        this.updateBase();

        const edibleTargets = world.organisms.filter(o =>
            o.alive && o instanceof Herbivore
        );

        const prey = this.findClosest(edibleTargets);

        this.target = prey;

        if (prey) {

            this.seek(prey);

            if (this.distanceTo(prey) < 7) {
                prey.kill();

                const mealGain = 30 + this.genome.growthRate * 14;
                const sizeGain = this.genome.growthRate * 0.18;

                this.size = Math.min(5.4, this.size + sizeGain);
                this.radius = this.baseRadius + (this.size - 1) * 3.0;

                this.energy = Math.min(
                    this.maxEnergy,
                    this.energy + mealGain
                );
            }

        } else {
            this.direction += (Math.random() - 0.5) * 0.25;
        }

        this.move(world);

        this.energy -= 0.004;

        if (this.canReproduce()) {
            const mate = this.findClosest(
                world.organisms.filter(o =>
                    o instanceof Carnivore &&
                    o !== this &&
                    o.alive &&
                    this.distanceTo(o) < 22 &&
                    Math.abs(this.radius - o.radius) < 2.2
                )
            );

            if (mate) {
                this.energy *= 0.76;
                mate.energy *= 0.72;
                this.reproductionCooldown = this.getReproductionDelay() * 1.5;

                const childGenome = this.genome.combineWith(mate.genome);
                const child = new Carnivore(
                    this.x,
                    this.y,
                    childGenome
                );

                child.generation = Math.max(this.generation, mate.generation) + 1;
                world.addOrganism(child);
            }
        }
    }
}