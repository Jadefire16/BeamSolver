import { Beam, Support, Load } from "./Types";

// Beam length must be positive.
// Supports must be between 0-length
// Loads must be between 0 - length
// At least one support must exist


// Ensure beam is within proper constraints before attempting to solve
export function validateBeam(beam: Beam):  string[]
{
    const errors: string[] = [];

    if(beam.length <= 0){
        errors.push("Beam length must be greater than zero");
    }

    if(beam.supports.length === 0){
        errors.push("Beam must have at least one support");
    }

    beam.supports.forEach((support : Support, index : number) => {
        if(support.position < 0 || support.position > beam.length) {
            errors.push(`Support ${index} is outside the beam length.`);
        }
    });

    beam.loads.forEach((load: Load, index : number) => {
       if(load.position < 0 || load.position > beam.length) {
           errors.push(`Load ${index} is outside the beam length.`);
       }
    });

    return errors; // Accumulate errors and return all, instead of just returning a single error
}