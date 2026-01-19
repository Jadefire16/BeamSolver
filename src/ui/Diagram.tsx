import  { Sample} from "../domain/Types";

// Generic SVG plotting utils

interface DiagramProps {
    data: Sample[];
    width?: number;
    height?: number;
    title?: string;
    yRange?: number;
    xUnit?: string;
    yUnit?: string;
}

// generic plotting component so all diagrams can share the same scaling and rendering logic.
export function Diagram({
    data,
    width = 600,
    height = 200,
    title,
    yRange,
    xUnit,
    yUnit,
}: DiagramProps) {
    if (data.length === 0)
        return null;

    const paddingL = 60;
    const paddingR = 20;
    const paddingT = 20;
    const paddingB = 40;

    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.value);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const computedMax = Math.max(...ys.map(y => Math.abs(y)));
    const maxAbsY = Math.max(yRange ?? 0, computedMax) || 1;

    const minY = -maxAbsY;
    const maxY = maxAbsY;

    const xTicks = 5;
    const yTicks = 4; // 2 on each side of zero

    const xTickValues = Array.from({ length: xTicks + 1 }, (_, i) => minX + (i / xTicks) * (maxX - minX));
    const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minY + (i / yTicks) * (maxY - minY));

    const scaleX = (x: number) =>
        paddingL +
        ((x - minX) / (maxX - minX || 1)) * (width - paddingL - paddingR);

    const scaleY = (y: number) =>
        height -
        paddingB -
        ((y - minY) / (maxY - minY || 1)) * (height - paddingT - paddingB);

    const hasZeroLine = minY < 0 && maxY > 0;
    const zeroY = hasZeroLine ? scaleY(0) : null;

    const points = data
        .map((d) => `${scaleX(d.x)},${scaleY(d.value)}`)
        .join(" ");

    return (
        <div style={{ color: "var(--text-color)" }}>
            {title && (
                <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem" }}>
                    {title} {yUnit ? `(${yUnit})` : ""}
                </h3>
            )}
            <svg width={width} height={height}>
                {/* Gridlines & Labels */}
                {xTickValues.map((val, i) => (
                    <g key={`x-${i}`}>
                        <line
                            x1={scaleX(val)}
                            y1={paddingT}
                            x2={scaleX(val)}
                            y2={height - paddingB}
                            stroke="var(--border-color)"
                            strokeDasharray="2"
                            opacity={0.3}
                        />
                        <text
                            x={scaleX(val)}
                            y={height - paddingB + 15}
                            fontSize="10"
                            textAnchor="middle"
                            fill="var(--text-color)"
                        >
                            {parseFloat(val.toFixed(2))}
                        </text>
                    </g>
                ))}

                {yTickValues.map((val, i) => (
                    <g key={`y-${i}`}>
                        <line
                            x1={paddingL}
                            y1={scaleY(val)}
                            x2={width - paddingR}
                            y2={scaleY(val)}
                            stroke="var(--border-color)"
                            strokeDasharray="2"
                            opacity={0.3}
                        />
                        <text
                            x={paddingL - 5}
                            y={scaleY(val) + 4}
                            fontSize="10"
                            textAnchor="end"
                            fill="var(--text-color)"
                        >
                            {parseFloat(val.toFixed(2))}
                        </text>
                    </g>
                ))}

                {/* Zero reference line (thicker) */}
                {hasZeroLine && zeroY !== null && (
                    <line
                        x1={paddingL}
                        y1={zeroY}
                        x2={width - paddingR}
                        y2={zeroY}
                        stroke="var(--border-color)"
                        strokeWidth={1}
                        opacity={0.8}
                    />
                )}

                {/* Left vertical axis */}
                <line
                    x1={paddingL}
                    y1={paddingT}
                    x2={paddingL}
                    y2={height - paddingB}
                    stroke="var(--border-color)"
                    strokeWidth={1}
                />

                {/* Data line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="var(--graph-stroke)"
                    strokeWidth={2}
                />

                {xUnit && (
                    <text
                        x={width - paddingR}
                        y={height - 5}
                        fontSize="10"
                        textAnchor="end"
                        fill="var(--text-color)"
                        opacity={0.7}
                    >
                        Position ({xUnit})
                    </text>
                )}
            </svg>
        </div>
    );
}
