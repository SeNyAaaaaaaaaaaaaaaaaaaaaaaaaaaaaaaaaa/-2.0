import SimulationView from "./ui/SimulationView";

export default function App() {

    return (
        <div style={{ background: "#0f172a", minHeight: "100vh", padding: 20 }}>
            <h2 style={{ color: "white" }}>
                Natural Selection Simulation
            </h2>

            <SimulationView />
        </div>
    );
}