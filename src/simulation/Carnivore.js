import Organism from "./Organism";
import Genome from "./Genome";
import Herbivore from "./Herbivore";

export default class Carnivore extends Organism {
    constructor(x, y, genome = new Genome({
        speed: 1.6,
        vision: 110,
        fertility: 175,
        efficiency: 0.85,
        growthRate: 0.7
    })) {
        super(x, y, genome);
        this.baseRadius = 6;
        this.size = 1;
        this.updateRadius();
        this.color = this.computeColor(0, 20);
    }

    updateRadius() {
        this.radius = this.baseRadius + (this.size - 1) * 3.0 + this.genome.speed * 0.25;
    }

    update(world) {
        if (!this.alive) return;
        this.updateBase();

        const edibleTargets = world.organisms.filter(o => o.alive && o instanceof Herbivore);
        const prey = this.findClosest(edibleTargets);
        this.target = prey;

        if (prey) {
            this.seek(prey);
            if (this.distanceTo(prey) < 5) {
                prey.kill();
                world.addParticle(prey.x, prey.y, prey.color, 6);

                const mealGain = 22 + this.genome.growthRate * 11;
                const sizeGain = this.genome.growthRate * 0.12;
                this.size = Math.min(5.0, this.size + sizeGain);
                this.updateRadius();
                this.energy = Math.min(this.maxEnergy, this.energy + mealGain);
            }
        } else {
            this.direction += (Math.random() - 0.5) * 0.3;
        }

        this.energy -= 0.007;

        this.move(world);

        if (this.canReproduce()) {
            const mate = this.findClosest(
                world.organisms.filter(o =>
                    o instanceof Carnivore && o !== this && o.alive
                )
            );
            if (mate && Math.abs(this.radius - mate.radius) < 2.2) {
                this.energy *= 0.83;
                mate.energy *= 0.78;
                this.reproductionCooldown = this.getReproductionDelay() * 1.9;

                const childGenome = this.genome.combineWith(mate.genome);
                const child = new Carnivore(this.x, this.y, childGenome);
                child.generation = Math.max(this.generation, mate.generation) + 1;
                world.addOrganism(child);
                world.addParticle(this.x, this.y, this.color, 3);
            }
        }
    }
}