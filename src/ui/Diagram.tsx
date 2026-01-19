import  { Sample} from "../domain/Types";

// Generic SVG plotting utils

interface DiagramProps {
    data: Sample[];
    width?: number;
    height?: number;
    title?: string;
}

// generic plotting component so all diagrams can share the same scaling and rendering logic.
export function Diagram({
    data,
    width = 600,
    height = 200,
    title,
}: DiagramProps) {
    if (data.length === 0)
        return null;

    const padding = 30;

    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.value);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const scaleX = (x: number) =>
        padding +
        ((x - minX) / (maxX - minX)) * (width - 2 * padding);

    const scaleY = (y: number) =>
        height -
        padding -
        ((y - minY) / (maxY - minY || 1)) * (height - 2 * padding);

    const points = data
        .map((d) => `${scaleX(d.x)},${scaleY(d.value)}`)
        .join(" ");

    return (
        <div>
            {title && <h3>{title}</h3>}
            <svg width={width} height={height}>
                {/* Axes */}
                <line
                    x1={padding}
                    y1={height / 2}
                    x2={width - padding}
                    y2={height / 2}
                    stroke="#999"
                />
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={height - padding}
                    stroke="#999"
                />

                {/* Data line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="black"
                    strokeWidth={2}
                />
            </svg>
        </div>
    );
}
