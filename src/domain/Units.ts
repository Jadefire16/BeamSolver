export enum LengthUnit {
    Meters = "m",
    Millimeters = "mm"
}

export enum ForceUnit {
    KiloNewtons = "kN",
    Newtons = "N"
}

export interface UnitSettings {
    length: LengthUnit;
    force: ForceUnit;
}

export const CONVERSIONS = {
    [LengthUnit.Meters]: 1,
    [LengthUnit.Millimeters]: 1000,
    [ForceUnit.KiloNewtons]: 1,
    [ForceUnit.Newtons]: 1000,
};

export function convertValue(value: number, unit: LengthUnit | ForceUnit): number {
    return value * CONVERSIONS[unit];
}

export function fromUnitToInternal(value: number, unit: LengthUnit | ForceUnit): number {
    return value / CONVERSIONS[unit];
}
