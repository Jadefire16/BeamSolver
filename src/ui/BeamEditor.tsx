import {Beam, SupportType} from "../domain/Types";
import {ForceUnit, LengthUnit, UnitSettings, convertValue, fromUnitToInternal} from "../domain/Units";

// Must ensure BeamEditor can't produce invalid data, clamp values?
// We'll keep it simple and predictable
// Immediate feedback needed, can use events

interface BeamEditorProps {
    beam: Beam;
    onChange: (beam: Beam) => void;
    units: UnitSettings;
}

export function BeamEditor({beam, onChange, units}: BeamEditorProps) {
    const load = beam.loads[0];

    function updateLength(length: number) {
        const internalLength = fromUnitToInternal(length, units.length);
        const clampedLength = Math.max(1, internalLength);

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
        const internalPosition = fromUnitToInternal(position, units.length);
        onChange({
            ...beam,
            loads: [
                { ...load, position: internalPosition }
            ],
        });
    }
    function updateLoadMagnitude(magnitude: number) {
        const internalMagnitude = fromUnitToInternal(magnitude, units.force);
        onChange({
            ...beam,
            loads: [{ ...load, magnitude: internalMagnitude }],
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

    const infoSectionStyle: React.CSSProperties = {
        marginTop: "32px",
        borderTop: "1px solid var(--border-color)",
        paddingTop: "24px",
    };

    const infoTitleStyle: React.CSSProperties = {
        marginTop: 0,
        marginBottom: "12px",
        fontSize: "1.1rem",
        color: "var(--text-color)",
    };

    const infoListStyle: React.CSSProperties = {
        fontSize: "0.85rem",
        lineHeight: "1.6",
        paddingLeft: "20px",
        margin: "0 0 16px 0",
        color: "var(--text-color)",
        opacity: 0.8,
    };

    return (
        <div>
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Beam Configuration</h2>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={groupStyle}>
                    <label style={labelStyle}>
                        Beam Length ({units.length}):
                        <input
                            type="number"
                            style={inputStyle}
                            value={convertValue(beam.length, units.length)}
                            min={convertValue(1, units.length)}
                            step={1}
                            onChange={(e) => updateLength(Number(e.target.value))}
                        />
                    </label>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>
                        Load Position (0 to {convertValue(beam.length, units.length)}{units.length}):
                        <input
                            type="range"
                            min={0}
                            max={convertValue(beam.length, units.length)}
                            step={0.01}
                            style={{ ...inputStyle, padding: "0" }}
                            value={convertValue(load.position, units.length)}
                            onChange={(e) => updateLoadPosition(Number(e.target.value))}
                        />
                        <div style={{ textAlign: "right", fontSize: "0.9rem" }}>{convertValue(load.position, units.length).toFixed(2)} {units.length}</div>
                    </label>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>
                        Load Magnitude ({units.force}):
                        <input
                            type="number"
                            style={inputStyle}
                            value={convertValue(load.magnitude, units.force)}
                            step={1}
                            onChange={(e) => updateLoadMagnitude(Number(e.target.value))}
                        />
                    </label>
                </div>
            </div>

            <div style={infoSectionStyle}>
                <h3 style={infoTitleStyle}>Mathematical Assumptions</h3>
                <ul style={infoListStyle}>
                    <li><strong>Linear Elasticity:</strong> Assumes the material operates within its elastic range and follows Hooke's Law.</li>
                    <li><strong>Small Deflection Theory:</strong> Uses Euler-Bernoulli theory, which assumes deflections are significantly smaller than the beam length.</li>
                    <li><strong>Constant Flexural Rigidity:</strong> EI is assumed to be 1.0 throughout the entire length of the beam.</li>
                    <li><strong>Statically Determinate:</strong> Currently optimized for systems with up to two pinned supports.</li>
                    <li><strong>Load Type Limitation:</strong> Assumes vertical loads only; no axial forces or torsion are modeled.</li>
                    <li><strong>Plane Geometry:</strong> Solves a 2D beam problem only; ignores out-of-plane bending, warping, and shear deformation (Euler-Bernoulli).</li>
                    <li><strong>Boundary Condition Simplification:</strong> Supports are treated as pinned only; no rotational stiffness or fixed-end moments are considered.</li>
                </ul>

                <h3 style={{ ...infoTitleStyle, marginTop: "16px" }}>Warnings</h3>
                <ul style={{ ...infoListStyle, marginBottom: 0 }}>
                    <li><strong>Numerical Accuracy:</strong> Results are derived from numerical integration using {beam.sampleCount} samples; minor inaccuracies may occur near concentrated loads.</li>
                    <li><strong>Support Limitations:</strong> Only the first two supports are considered in reaction calculations; additional supports are currently ignored.</li>
                </ul>
            </div>
        </div>
    );
}