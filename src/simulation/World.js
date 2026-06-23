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
        this.particles = [];
        this.tick = 0;
        this.time = 0;
        this.speed = 1;
        this.paused = false;
    }

    initialize(startHerbivores = 25, startCarnivores = 5, startFood = 65) {
        this.organisms = [];
        this.foods = [];
        this.particles = [];
        this.tick = 0;
        this.time = 0;

        for (let i = 0; i < startFood; i++) {
            this.foods.push(new Food(Math.random() * this.width, Math.random() * this.height));
        }
        for (let i = 0; i < startHerbivores; i++) {
            const h = new Herbivore(Math.random() * this.width, Math.random() * this.height);
            h.worldSettings = this.settings;
            this.organisms.push(h);
        }
        for (let i = 0; i < startCarnivores; i++) {
            const c = new Carnivore(Math.random() * this.width, Math.random() * this.height);
            c.worldSettings = this.settings;
            this.organisms.push(c);
        }
    }

    addOrganism(o) {
        o.worldSettings = this.settings;
        this.organisms.push(o);
    }

    removeFood(food) {
        this.foods = this.foods.filter(f => f !== food);
    }

    addParticle(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.8 + Math.random() * 1.5;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color
            });
        }
    }

    updateParticles() {
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.04;
        }
        this.particles = this.particles.filter(p => p.life > 0);
    }

    spawnFood() {
        if (this.foods.length >= 95) return;
        if (Math.random() < this.settings.foodSpawnChance) {
            this.foods.push(new Food(Math.random() * this.width, Math.random() * this.height));
        }
    }

    spawnOrganisms() {
        const herbivores = this.organisms.filter(o => o instanceof Herbivore).length;
        const carnivores = this.organisms.filter(o => o instanceof Carnivore).length;

        if (herbivores < 70 && Math.random() < this.settings.herbivoreSpawnChance) {
            const h = new Herbivore(Math.random() * this.width, Math.random() * this.height);
            h.worldSettings = this.settings;
            this.addOrganism(h);
        }
        if (carnivores < 14 && Math.random() < this.settings.carnivoreSpawnChance * 0.9) {
            const c = new Carnivore(Math.random() * this.width, Math.random() * this.height);
            c.worldSettings = this.settings;
            this.addOrganism(c);
        }
    }

    update() {
        if (this.paused) return;

        const ticks = Math.min(this.speed, 5);
        for (let i = 0; i < ticks; i++) {
            this.tick++;
            this.time++;
            this.spawnFood();
            this.spawnOrganisms();
            for (const o of this.organisms) {
                o.update(this);
            }
            this.organisms = this.organisms.filter(o => o.alive);
            this.updateParticles();
        }
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

    setSpeed(speed) {
        this.speed = speed;
    }

    togglePause() {
        this.paused = !this.paused;
    }
}