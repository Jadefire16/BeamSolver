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

    return (
        <div style={{ marginBottom: 24 }}>
            <h2>Beam Editor</h2>

            <div>
                <label>
                    Beam Length:
                    <input
                        type="number"
                        value={beam.length}
                        min={1}
                        step={1}
                        onChange={(e) => updateLength(Number(e.target.value))}
                    />
                </label>
            </div>

            <div>
                <label>
                    Load Position:
                    <input
                        type="range"
                        min={0}
                        max={beam.length}
                        step={0.1}
                        value={load.position}
                        onChange={(e) => updateLoadPosition(Number(e.target.value))}
                    />
                    {load.position.toFixed(2)}
                </label>
            </div>

            <div>
                <label>
                    Load Magnitude:
                    <input
                        type="number"
                        value={load.magnitude}
                        step={1}
                        onChange={(e) => updateLoadMagnitude(Number(e.target.value))}
                    />
                </label>
            </div>
        </div>
    );
}