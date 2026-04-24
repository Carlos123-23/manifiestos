export interface IdentificationType {
  code: string;
}

export interface CodeDescriptionNumber {
  code: number;
  description: string;
}

export interface CodeDescriptionString {
  code: string;
}

export interface Identification {
  number: string;
  type: IdentificationType;
  dueDate?: string;
}

export interface NumberReference {
  number: string;
}

export interface NaturalPersonData {
  code?: string;
  identification: Identification;
  fullName?: string;
  name?: string;
  otherName?: string;
  lastName?: string;
  otherLastName?: string;
  status?: CodeDescriptionString;
  subsidiary?: CodeDescriptionNumber;
  branch?: CodeDescriptionNumber;
  enrollmentDate?: string;
  lastUpdateDate?: string;
  economicGroup?: CodeDescriptionNumber;
  officer?: CodeDescriptionNumber;
  retention?: boolean;
  sex?: CodeDescriptionString;
  gender?: CodeDescriptionString;
  birthDate?: string;
  profession?: CodeDescriptionString;
  maritalStatus?: CodeDescriptionString;
  dependants?: number;
  degreeLevel?: CodeDescriptionString;
  clientQuality?: CodeDescriptionString;
  relationship?: CodeDescriptionString;
  currentOperationsWithFinancialEntity?: boolean;
  externalCode?: string;
  countryBirth?: CodeDescriptionNumber;
  foreignerNaturalised?: boolean;
  imigration?: string;
  foreignIdentification?: NumberReference;
  originAddress?: NumberReference;
  homeTown?: string;
  heritageType?: CodeDescriptionString;
  heritageValue?: string;
  isSpouse?: boolean;
  spouseIdentification?: NumberReference;
}

export interface NaturalPersonResponse {
  naturalPerson: NaturalPersonData;
}
