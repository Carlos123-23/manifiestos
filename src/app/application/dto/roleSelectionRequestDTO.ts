/**
 * DTO for role selection request
 */
export class RoleSelectionRequestDTO {
  userId!: string;
  roleId!: string;
  additionalData?: Record<string, unknown>;
}
