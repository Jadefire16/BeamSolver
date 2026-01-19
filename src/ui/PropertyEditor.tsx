import React from "react";
import { Beam } from "../domain/Types";

interface PropertyEditorProps {
    beam: Beam;
    onChange: (beam: Beam) => void;
}

export function PropertyEditor({ beam, onChange }: PropertyEditorProps) {
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
            </div>
        </div>
    );
}
