import { useEffect, useRef, useState } from "react";
import World from "../simulation/World";
import CanvasRenderer from "../rendering/CanvasRenderer";

const defaultSettings = {
    herbivores: 25,
    carnivores: 5,
    food: 65,
    reproductionSpeed: 1,
};

export default function SimulationView() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const worldRef = useRef(null);
    const rendererRef = useRef(null);
    const animationFrameRef = useRef(null);

    const [settings, setSettings] = useState(defaultSettings);
    const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 700 });
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [tooltip, setTooltip] = useState(null);

    const updateCanvasSize = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height - 80; // панель
            setCanvasSize({
                width: Math.max(300, Math.floor(width)),
                height: Math.max(200, Math.floor(height)),
            });
        }
    };

    useEffect(() => {
        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    useEffect(() => {
        if (!canvasRef.current || canvasSize.width === 0) return;

        const world = new World(canvasSize.width, canvasSize.height, {
            reproductionSpeed: settings.reproductionSpeed,
            foodSpawnChance: 0.06,
            herbivoreSpawnChance: 0.03,
            carnivoreSpawnChance: 0.007,
        });
        world.initialize(settings.herbivores, settings.carnivores, settings.food);
        world.setSpeed(speed);
        if (paused) world.togglePause();

        const renderer = new CanvasRenderer(canvasRef.current, world);
        worldRef.current = world;
        rendererRef.current = renderer;

        const loop = () => {
            if (worldRef.current) {
                worldRef.current.update();
                rendererRef.current.draw();
            }
            animationFrameRef.current = requestAnimationFrame(loop);
        };

        loop();

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [canvasSize, settings.herbivores, settings.carnivores, settings.food]);

    useEffect(() => {
        if (worldRef.current) {
            worldRef.current.settings.reproductionSpeed = settings.reproductionSpeed;
        }
    }, [settings.reproductionSpeed]);

    const togglePause = () => {
        if (worldRef.current) {
            worldRef.current.togglePause();
            setPaused(worldRef.current.paused);
        }
    };

    const changeSpeed = (newSpeed) => {
        if (worldRef.current) {
            worldRef.current.setSpeed(newSpeed);
            setSpeed(newSpeed);
        }
    };

    const resetSimulation = () => {
        setSettings((prev) => ({ ...prev }));
        setPaused(false);
        setSpeed(1);
    };

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        if (!canvas || !worldRef.current) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        const world = worldRef.current;
        for (const org of world.organisms) {
            if (org.distanceTo({ x: mouseX, y: mouseY }) < org.radius + 5) {
                setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    genes: org.genome,
                    type: org.constructor.name,
                    generation: org.generation,
                    energy: org.energy.toFixed(0),
                    age: org.age,
                });
                return;
            }
        }
        setTooltip(null);
    };

    const closeTooltip = () => setTooltip(null);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                height: "100vh",
                background: "#0b1120",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Заголовок — теперь в правом верхнем углу */}
            <div
                style={{
                    position: "absolute",
                    top: "16px",
                    right: "20px",
                    zIndex: 10,
                    pointerEvents: "none",
                    userSelect: "none",
                    textAlign: "right",
                    opacity: 0.9,
                }}
            >
                <h1
                    style={{
                        color: "#60a5fa",
                        margin: "0 0 4px 0",
                        fontSize: "26px",
                        fontWeight: "600",
                        letterSpacing: "-0.5px",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                >
                    🧬 Симуляция жизни
                </h1>
                <p
                    style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        margin: 0,
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                >
                    Изучайте эволюцию в реальном времени
                </p>
            </div>

            {/* Канвас */}
            <div style={{ flex: 1, background: "#0b1120", overflow: "hidden" }}>
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onClick={handleCanvasClick}
                    style={{
                        display: "block",
                        boxShadow: "0 0 30px rgba(0,0,0,0.5)",
                        borderRadius: "4px",
                    }}
                />
            </div>

            {/* Панель управления */}
            <div
                style={{
                    height: "80px",
                    background: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "14px",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    flexWrap: "wrap",
                    color: "white",
                    fontSize: "14px",
                    padding: "0 16px",
                }}
            >
                <button
                    onClick={togglePause}
                    style={buttonStyle}
                    onMouseEnter={(e) => (e.target.style.background = "#334155")}
                    onMouseLeave={(e) => (e.target.style.background = "#1e293b")}
                >
                    {paused ? "▶ Старт" : "⏸ Пауза"}
                </button>

                {[1, 2, 3].map((s) => (
                    <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        style={{
                            ...buttonStyle,
                            background: speed === s ? "#3b82f6" : "#1e293b",
                            fontWeight: speed === s ? "bold" : "normal",
                        }}
                    >
                        {s}x
                    </button>
                ))}

                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "8px" }}>
                    <label style={{ fontSize: "12px", color: "#cbd5e1" }}>⚡ Размножение:</label>
                    <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={settings.reproductionSpeed}
                        onChange={(e) =>
                            setSettings({ ...settings, reproductionSpeed: Number(e.target.value) })
                        }
                        style={{
                            width: "80px",
                            accentColor: "#60a5fa",
                        }}
                    />
                    <span style={{ fontSize: "12px", minWidth: "24px" }}>
                        {settings.reproductionSpeed.toFixed(1)}
                    </span>
                </div>

                <button
                    onClick={resetSimulation}
                    style={{ ...buttonStyle, background: "#b91c1c" }}
                    onMouseEnter={(e) => (e.target.style.background = "#dc2626")}
                    onMouseLeave={(e) => (e.target.style.background = "#b91c1c")}
                >
                    🔄 Сброс
                </button>
            </div>

            {tooltip && (
                <div
                    style={{
                        position: "fixed",
                        left: tooltip.x + 10,
                        top: tooltip.y + 10,
                        background: "rgba(0,0,0,0.85)",
                        backdropFilter: "blur(8px)",
                        color: "white",
                        padding: "10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        zIndex: 100,
                        maxWidth: "200px",
                        border: "1px solid #3b82f6",
                    }}
                    onClick={closeTooltip}
                >
                    <div>
                        <b>{tooltip.type}</b> (поколение {tooltip.generation})
                    </div>
                    <div>Энергия: {tooltip.energy}</div>
                    <div>Возраст: {tooltip.age}</div>
                    <hr style={{ margin: "4px 0" }} />
                    <div>Скорость: {tooltip.genes.speed.toFixed(2)}</div>
                    <div>Зрение: {tooltip.genes.vision.toFixed(1)}</div>
                    <div>Плодовитость: {tooltip.genes.fertility.toFixed(0)}</div>
                    <div>Эффективность: {tooltip.genes.efficiency.toFixed(2)}</div>
                    <div>Рост: {tooltip.genes.growthRate.toFixed(2)}</div>
                </div>
            )}
        </div>
    );
}

const buttonStyle = {
    background: "#1e293b",
    border: "none",
    color: "white",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s",
};