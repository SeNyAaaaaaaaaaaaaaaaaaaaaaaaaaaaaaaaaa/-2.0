import { useEffect, useMemo, useRef, useState } from "react";
import World from "../simulation/World";
import CanvasRenderer from "../rendering/CanvasRenderer";

const defaultSettings = {
    herbivores: 25,
    carnivores: 6,
    food: 60,
    reproductionSpeed: 1
};

export default function SimulationView() {
    const ref = useRef(null);
    const [settings, setSettings] = useState(defaultSettings);

    const settingLabels = useMemo(() => ({
        herbivores: "Травоядные",
        carnivores: "Хищники",
        food: "Еда",
        reproductionSpeed: "Скорость размножения"
    }), []);

    useEffect(() => {
        const world = new World(1000, 700, settings);
        world.initialize();

        const renderer = new CanvasRenderer(ref.current, world);

        let animationFrame = 0;

        const loop = () => {
            world.update();
            renderer.draw();
            animationFrame = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
                background: "#0f172a",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #1e293b"
            }}>
                {Object.entries(settings).map(([key, value]) => (
                    <label key={key} style={{ color: "white", fontSize: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span>{settingLabels[key]}</span>
                            <strong>{key === "reproductionSpeed" ? value.toFixed(1) : value}</strong>
                        </div>
                        <input
                            type="range"
                            min={key === "reproductionSpeed" ? 0.5 : key === "food" ? 20 : key === "herbivores" ? 5 : 1}
                            max={key === "reproductionSpeed" ? 2.5 : key === "food" ? 150 : key === "herbivores" ? 80 : 20}
                            step={key === "reproductionSpeed" ? 0.1 : 1}
                            value={value}
                            onChange={(e) => updateSetting(key, key === "reproductionSpeed" ? Number(e.target.value) : Number(e.target.value))}
                            style={{ width: "100%" }}
                        />
                    </label>
                ))}
            </div>

            <button
                onClick={resetSettings}
                style={{
                    width: 140,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer"
                }}
            >
                Сбросить
            </button>

            <canvas ref={ref} width={1000} height={700} />
        </div>
    );
}