import { ILegalGuardian } from "./ILegalGuardian";

export interface IStudent {
    id: number;
    code: string;
    name: string;
    lastName: string;
    gender: string;
    direction: string;
    birthdate: string;
    legalGuardianId: number;
    legalGuardian: ILegalGuardian | null;
}