/**
 * DTO for role selection response
 */
export class RoleSelectionResponseDTO {
  userId!: string;
  roleId!: string;
  selectedRole!: string;
  timestamp!: Date;
  status!: 'success' | 'pending' | 'failed';
}
