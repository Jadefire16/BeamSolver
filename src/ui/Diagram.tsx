import  { Sample} from "../domain/Types";

// Generic SVG plotting utils

interface DiagramProps {
    data: Sample[];
    width?: number;
    height?: number;
    title?: string;
    yRange?: number;
}

// generic plotting component so all diagrams can share the same scaling and rendering logic.
export function Diagram({
    data,
    width = 600,
    height = 200,
    title,
    yRange,
}: DiagramProps) {
    if (data.length === 0)
        return null;

    const padding = 30;

    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.value);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const computedMax = Math.max(...ys.map(y => Math.abs(y)));
    const maxAbsY = yRange ?? (computedMax === 0 ? 1 : computedMax);

    const minY = -maxAbsY;
    const maxY = maxAbsY;


    const scaleX = (x: number) =>
        padding +
        ((x - minX) / (maxX - minX)) * (width - 2 * padding);

    const scaleY = (y: number) =>
        height -
        padding -
        ((y - minY) / (maxY - minY || 1)) * (height - 2 * padding);

    const hasZeroLine = minY < 0 && maxY > 0;
    const zeroY = hasZeroLine ? scaleY(0) : null;

    const points = data
        .map((d) => `${scaleX(d.x)},${scaleY(d.value)}`)
        .join(" ");

    return (
        <div style={{ color: "var(--text-color)" }}>
            {title && <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem" }}>{title}</h3>}
            <svg width={width} height={height}>
                {/* Axes */}
                <line
                    x1={padding}
                    y1={height / 2}
                    x2={width - padding}
                    y2={height / 2}
                    stroke="var(--border-color)"
                />
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={height - padding}
                    stroke="var(--border-color)"
                />

                {/* Zero reference line */}
                {hasZeroLine && zeroY !== null && (
                    <line
                        x1={padding}
                        y1={zeroY}
                        x2={width - padding}
                        y2={zeroY}
                        stroke="var(--border-color)"
                        strokeDasharray="4"
                        opacity={0.5}
                    />
                )}

                {/* Data line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="var(--graph-stroke)"
                    strokeWidth={2}
                />
            </svg>
        </div>
    );
}
