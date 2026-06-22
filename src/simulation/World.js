import Food from "./Food";
import Herbivore from "./Herbivore";
import Carnivore from "./Carnivore";

export default class World {

    constructor(width = 1000, height = 700, settings = {}) {
        this.width = width;
        this.height = height;

        this.settings = {
            foodSpawnChance: 0.06,
            herbivoreSpawnChance: 0.03,
            carnivoreSpawnChance: 0.007,
            reproductionSpeed: 1,
            ...settings
        };

        this.organisms = [];
        this.foods = [];

        this.tick = 0;
        this.time = 0;
    }

    initialize() {
        this.organisms = [];
        this.foods = [];
        this.tick = 0;
        this.time = 0;

        for (let i = 0; i < 12; i++) {
            this.foods.push(new Food(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }

        for (let i = 0; i < 8; i++) {
            const herbivore = new Herbivore(
                Math.random() * this.width,
                Math.random() * this.height
            );
            herbivore.worldSettings = this.settings;
            this.organisms.push(herbivore);
        }

        for (let i = 0; i < 2; i++) {
            const carnivore = new Carnivore(
                Math.random() * this.width,
                Math.random() * this.height
            );
            carnivore.worldSettings = this.settings;
            this.organisms.push(carnivore);
        }
    }

    addOrganism(o) {
        o.worldSettings = this.settings;
        this.organisms.push(o);
    }

    removeFood(food) {
        this.foods = this.foods.filter(f => f !== food);
    }

    spawnFood() {
        if (this.foods.length >= 90) return;

        if (Math.random() < this.settings.foodSpawnChance) {
            this.foods.push(new Food(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }
    }

    spawnOrganisms() {
        if (this.organisms.length >= 140) return;

        if (Math.random() < this.settings.herbivoreSpawnChance) {
            const herbivore = new Herbivore(
                Math.random() * this.width,
                Math.random() * this.height
            );
            herbivore.worldSettings = this.settings;
            this.addOrganism(herbivore);
        }

        if (Math.random() < this.settings.carnivoreSpawnChance) {
            const carnivore = new Carnivore(
                Math.random() * this.width,
                Math.random() * this.height
            );
            carnivore.worldSettings = this.settings;
            this.addOrganism(carnivore);
        }
    }

    update() {

        this.tick++;
        this.time++;

        this.spawnFood();
        this.spawnOrganisms();

        for (const o of this.organisms) {
            o.update(this);
        }

        this.organisms = this.organisms.filter(o => o.alive);
    }

    getStats() {
        return {
            herbivores: this.organisms.filter(o => o instanceof Herbivore).length,
            carnivores: this.organisms.filter(o => o instanceof Carnivore).length,
            foods: this.foods.length,
            total: this.organisms.length,
            time: this.time
        };
    }
}