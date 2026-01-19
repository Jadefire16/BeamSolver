import {Beam, SupportType} from "../domain/Types";

// Must ensure BeamEditor can't produce invalid data, clamp values?
// We'll keep it simple and predictable
// Immediate feedback needed, can use events

interface BeamEditorProps {
    beam: Beam;
    onChange: (beam: Beam) => void;
}

export function BeamEditor({beam, onChange}: BeamEditorProps) {
    const load = beam.loads[0];

    function updateLength(length: number) {
        const clampedLength = Math.max(1, length);

        onChange({
            ...beam,
            length: clampedLength,
            supports: [
                { type: SupportType.Pinned, position: 0 },
                { type: SupportType.Pinned, position: clampedLength },
            ],
            loads: [
                {
                    ...load,
                    position: Math.min(load.position, clampedLength),
                },
            ],
        });
    }

    function updateLoadPosition(position: number) {
        onChange({
            ...beam,
            loads: [
                { ...load, position }
            ],
        });
    }
    function updateLoadMagnitude(magnitude: number) {
        onChange({
            ...beam,
            loads: [{ ...load, magnitude }],
        });
    }

    const labelStyle: React.CSSProperties = {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "8px",
        marginTop: "4px",
        borderRadius: "4px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        boxSizing: "border-box"
    };

    const groupStyle: React.CSSProperties = {
        flex: 1,
        minWidth: "200px",
        padding: "16px",
        border: "1px solid var(--border-color)",
        borderRadius: "8px"
    };

    return (
        <div>
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Beam Configuration</h2>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={groupStyle}>
                    <label style={labelStyle}>
                        Beam Length (m):
                        <input
                            type="number"
                            style={inputStyle}
                            value={beam.length}
                            min={1}
                            step={1}
                            onChange={(e) => updateLength(Number(e.target.value))}
                        />
                    </label>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>
                        Load Position (0 to {beam.length}m):
                        <input
                            type="range"
                            min={0}
                            max={beam.length}
                            step={0.1}
                            style={{ ...inputStyle, padding: "0" }}
                            value={load.position}
                            onChange={(e) => updateLoadPosition(Number(e.target.value))}
                        />
                        <div style={{ textAlign: "right", fontSize: "0.9rem" }}>{load.position.toFixed(2)} m</div>
                    </label>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>
                        Load Magnitude (kN):
                        <input
                            type="number"
                            style={inputStyle}
                            value={load.magnitude}
                            step={1}
                            onChange={(e) => updateLoadMagnitude(Number(e.target.value))}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}