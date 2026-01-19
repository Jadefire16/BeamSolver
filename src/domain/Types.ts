// Defining the domain here should simplify actually rendering it.
// Should keep the solver and UI on the same path


// General
export interface Sample {
    x: number; // Position along the beam
    value: number; // Value at position
}

// Support Types
export enum SupportType{
    Pinned = "Pinned",
    Fixed = "Fixed",
}

export interface Support {
    type: SupportType;
    position: number; // x-position along beam
}

// Load Types
export enum LoadType {
    Point = "Point",
}

export interface Load {
    type: LoadType;
    magnitude: number;
    position: number; // x-position along beam
}

// Beam
export interface Beam {
    length: number;
    support: Support[];
    loads: Load[];
}

// Define output result, will constrain UI and Solver to follow

export interface BeamSampleResult {
    reactions: {
        support: Support;
        force: number;
    }[];

    shearDiagram: Sample[];
    momentDiagram: Sample[];
    deflectionCurve: Sample[];
}