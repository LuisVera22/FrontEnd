import type { IGradoSeccion } from "./IGradoSeccion";

export interface IHorarios {
    id: number;
    horaInicio: string;
    horaFin: string;
    diaSemana: string;
    gradoSeccionId: number;
    gradoSeccion?: IGradoSeccion;
}