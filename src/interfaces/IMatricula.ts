import type { IGradoSeccion } from "./IGradoSeccion";
import { IStudent } from "./IStudent";
import { ILegalGuardian } from "./ILegalGuardian";
import { IDocente } from "./IDocente";
import { IHorarios } from "./IHorarios";

export interface IMatricula {
    id: number;
    fechaMatricula: string; 
    estado: boolean; 
    docente : IDocente;
    student: IStudent; 
    legalGuardian : ILegalGuardian;
    gradoSeccion: IGradoSeccion;
    horario: IHorarios;
}
