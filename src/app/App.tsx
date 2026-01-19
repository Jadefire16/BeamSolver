import {Beam, LoadType, SupportType} from "../domain/Types";
import {prepareBeam} from "../domain/Beam";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {solveBeam} from "../domain/Solver";
import {ShearDiagram} from "../ui/ShearDiagram";
import {MomentDiagram} from "../ui/MomentDiagram";
import {DeflectionPlot} from "../ui/DeflectionPlot";
import {BeamEditor} from "../ui/BeamEditor";

const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

export default function App() {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const [beamInput, setBeamInput] = useState<Beam>({
        length: 10,
        supports: [
            { type: SupportType.Pinned, position: 0 },
            { type: SupportType.Pinned, position: 10 },
        ],
        loads: [
            { type: LoadType.Point, magnitude: 10, position: 5 },
        ],
    });

    const { beam, errors } = prepareBeam(beamInput);

    const result = useMemo(() => {
        if (!beam)
            return null;
        return solveBeam(beam)
    }, [beam]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    const appStyle: React.CSSProperties = {
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        minHeight: "100vh",
        transition: "background-color 0.3s, color 0.3s",
        fontFamily: "system-ui, -apple-system, sans-serif"
    };

    const appBarStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        backgroundColor: "var(--appbar-bg)",
        color: "var(--appbar-text)",
        height: "64px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    };

    const mainStyle: React.CSSProperties = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px"
    };

    const graphContainerStyle: React.CSSProperties = {
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        backgroundColor: "var(--card-bg)"
    };

    const bottomGraphsStyle: React.CSSProperties = {
        display: "flex",
        gap: "16px",
        marginTop: "16px",
        flexWrap: "wrap"
    };

    const controlSectionStyle: React.CSSProperties = {
        backgroundColor: "var(--card-bg)",
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)"
    };

    return (
        <div style={appStyle}>
            <header style={appBarStyle}>
                <h1 style={{ margin: 0, fontSize: "1.5rem" }}>2D Beam Analysis</h1>
                <button 
                    onClick={toggleDarkMode}
                    style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderRadius: "8px",
                        border: "1px solid var(--appbar-text)",
                        backgroundColor: "transparent",
                        color: "var(--appbar-text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s"
                    }}
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                </button>
            </header>

            <main style={mainStyle}>
                <style>{`
                    :root {
                        --bg-color: #f0f2f5;
                        --text-color: #1c1e21;
                        --appbar-bg: #2563eb;
                        --appbar-text: #ffffff;
                        --border-color: #d1d5db;
                        --card-bg: #ffffff;
                        --graph-stroke: #2563eb;
                    }
                    .dark-mode {
                        --bg-color: #0f172a;
                        --text-color: #f1f5f9;
                        --appbar-bg: #1e293b;
                        --appbar-text: #f1f5f9;
                        --border-color: #334155;
                        --card-bg: #1e293b;
                        --graph-stroke: #38bdf8;
                    }
                    body { margin: 0; }
                `}</style>

                {errors.length > 0 ? (
                    <div style={{ color: "red", padding: "20px" }}>
                        <h2>Beam Errors</h2>
                        <ul>
                            {errors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                ) : !result ? (
                    <div>No result</div>
                ) : (
                    <>
                        <div style={graphContainerStyle}>
                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                <ShearDiagram data={result.shearDiagram} width={1100} />
                            </div>
                            <div style={bottomGraphsStyle}>
                                <div style={{ flex: 1, minWidth: "400px" }}>
                                    <MomentDiagram data={result.momentDiagram} width={540} />
                                </div>
                                <div style={{ flex: 1, minWidth: "400px" }}>
                                    <DeflectionPlot data={result.deflectionCurve} width={540} />
                                </div>
                            </div>
                        </div>

                        <section style={controlSectionStyle}>
                            <BeamEditor beam={beamInput} onChange={setBeamInput} />
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
