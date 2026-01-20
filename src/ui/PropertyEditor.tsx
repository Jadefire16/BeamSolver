import React from "react";
import { Beam } from "../domain/Types";
import {ForceUnit, LengthUnit, UnitSettings} from "../domain/Units";

interface PropertyEditorProps {
    beam: Beam;
    onChange: (beam: Beam) => void;
    units: UnitSettings;
    onUnitChange: (units: UnitSettings) => void;
}

export function PropertyEditor({ beam, onChange, units, onUnitChange }: PropertyEditorProps) {
    function updateSampleCount(sampleCount: number) {
        onChange({
            ...beam,
            sampleCount: Math.max(1, Math.min(1000, sampleCount)),
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
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Property Editor</h2>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={groupStyle}>
                    <label style={labelStyle}>
                        Sample Count (Accuracy):
                        <input
                            type="number"
                            style={inputStyle}
                            value={beam.sampleCount}
                            min={1}
                            max={1000}
                            step={1}
                            onChange={(e) => updateSampleCount(Number(e.target.value))}
                        />
                    </label>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "8px" }}>
                        Higher values increase calculation accuracy but may affect performance.
                    </div>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Display Units:</label>
                    <div style={{ display: "flex", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "8px", padding: "4px", width: "fit-content" }}>
                        <button
                            onClick={() => onUnitChange({ ...units, length: units.length === LengthUnit.Meters ? LengthUnit.Millimeters : LengthUnit.Meters })}
                            style={{
                                padding: "4px 12px",
                                cursor: "pointer",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--text-color)",
                                fontWeight: "bold",
                                fontSize: "0.85rem"
                            }}
                        >
                            {units.length}
                        </button>
                        <div style={{ width: "1px", backgroundColor: "var(--text-color)", opacity: 0.2, margin: "4px 0" }} />
                        <button
                            onClick={() => onUnitChange({ ...units, force: units.force === ForceUnit.KiloNewtons ? ForceUnit.Newtons : ForceUnit.KiloNewtons })}
                            style={{
                                padding: "4px 12px",
                                cursor: "pointer",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--text-color)",
                                fontWeight: "bold",
                                fontSize: "0.85rem"
                            }}
                        >
                            {units.force}
                        </button>
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "8px" }}>
                        Toggle between Metric units (m/mm, kN/N).
                    </div>
                </div>
            </div>
        </div>
    );
}
