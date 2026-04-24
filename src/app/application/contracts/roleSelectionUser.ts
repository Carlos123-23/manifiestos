/**
 * Role selection use case contract
 */

export interface RoleSelectionInput {
  userId: string;
  availableRoles: string[];
  selectedRole: string;
}

export interface RoleSelectionResult {
  userId: string;
  selectedRole: string;
  selectionTimestamp: Date;
  confirmed: boolean;
}
