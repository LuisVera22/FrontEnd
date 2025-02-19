import type { IAsignacionDocente } from "./IAsignacionDocente";
import type { IHorarios } from "./IHorarios";
import type { IStudent } from "./IStudent";

export interface IGradoSeccion {
    id: number;
    nombre: string; 
    estudiantes : IStudent[];
    asignaciones : IAsignacionDocente[];
    horarios : IHorarios[];
}