import { IDocente } from "./IDocente";
import { IGradoSeccion } from "./IGradoSeccion";
import { IHorarios } from "./IHorarios";

export interface IAsignacionDocente{
    id: number;
    docente : IDocente;
    gradoSeccion : IGradoSeccion;
    horarios : IHorarios[];
}