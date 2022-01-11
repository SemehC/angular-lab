import { Evenement } from "./evenement.model";

export interface Member {
  id: string;
  cin: string;
  nom: string;
  type: string;
  prenom: string;
  etablissement: string;
  grade: string;
  date_inscription: Date;
  diplome: string;
  sujet: string;
  dateNaissance: Date;
  cv: string;
  createdDate: string;
  email: string;
  photoURL: string;
  emailVerified: boolean;
  encadrant: Member;
  evenements: Evenement[];
}
