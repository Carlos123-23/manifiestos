import { inject, injectable } from 'tsyringe';
import {
  CustomerAccessFlowInput,
  CustomerAccessFlowInputPort
} from '../ports/input/customerAccessFlowInputPort';
import { AuthenticateUserInputPort } from '../ports/input/authenticateUserInputPort';
import { RoleSelectionInputPort, RoleSelectionRequest } from '../ports/input/roleSelectionInputPort';
import { FindByIdentificationInputPort } from '../ports/input/findByIdentificationInputPort';
import { BadRequestException } from '../exceptions/BadRequest.exception';
import { ExternalServiceException } from '../exceptions/ExternalService.exception';
import { CobisRequestHeaders } from '../types/cobisRequestHeaders';

type CodeValue = {
  code: number;
};

type AuthenticationFlowResponse = {
  session?: string;
  subsidiaries?: CodeValue[];
  branches?: CodeValue[];
  roles?: CodeValue[];
};

type RoleSelectionFlowResponse = {
  authenticationResult?: {
    authorization?: string;
    accessToken?: string;
  };
};

const CUSTOMER_ACCESS_FLOW_LOGIN = process.env.CUSTOMER_ACCESS_FLOW_LOGIN ?? '';
const CUSTOMER_ACCESS_FLOW_PASSWORD = process.env.CUSTOMER_ACCESS_FLOW_PASSWORD ?? '';

@injectable()
export class CustomerAccessFlowUseCase implements CustomerAccessFlowInputPort {
  constructor(
    @inject('AuthenticateUserInputPort')
    private readonly authenticateUserUseCase: AuthenticateUserInputPort,
    @inject('RoleSelectionUserInputPort')
    private readonly roleSelectionUseCase: RoleSelectionInputPort,
    @inject('FindByIdentificationInputPort')
    private readonly findByIdentificationUseCase: FindByIdentificationInputPort
  ) {}

  private ensureInput(input: CustomerAccessFlowInput): void {
    if (!input.identificationNumber?.trim()) {
      throw new BadRequestException('identification.number is required');
    }

    if (!input.identificationType?.trim()) {
      throw new BadRequestException('identification.type is required');
    }

    if (!CUSTOMER_ACCESS_FLOW_LOGIN) {
      throw new ExternalServiceException('CUSTOMER_ACCESS_FLOW_LOGIN is not configured', 500);
    }

    if (!CUSTOMER_ACCESS_FLOW_PASSWORD) {
      throw new ExternalServiceException('CUSTOMER_ACCESS_FLOW_PASSWORD is not configured', 500);
    }
  }

  private withAccessToken(headers: CobisRequestHeaders, token: string): CobisRequestHeaders {
    return {
      ...headers,
      authorization: this.normalizeAuthorization(token)
    };
  }

  private normalizeAuthorization(token: string): string {
    return /^Bearer\s+/i.test(token) ? token : `Bearer ${token}`;
  }

  private asObject(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object') {
      throw new ExternalServiceException('External service returned an invalid object payload', 502);
    }
    return value as Record<string, unknown>;
  }

  private extractCodeArray(source: Record<string, unknown>, key: string): CodeValue[] {
    const value = source[key];
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((item): item is CodeValue => {
      return !!item && typeof item === 'object' && typeof (item as CodeValue).code === 'number';
    });
  }

  private extractAuthenticationPayload(response: unknown): AuthenticationFlowResponse {
    const payload = this.asObject(response);
    const nestedData = payload.data && typeof payload.data === 'object'
      ? (payload.data as Record<string, unknown>)
      : undefined;
    const root = nestedData ?? payload;

    const session = typeof root.session === 'string' ? root.session : undefined;
    const official = root.official && typeof root.official === 'object'
      ? (root.official as Record<string, unknown>)
      : undefined;

    const source = official ?? root;

    return {
      session,
      subsidiaries: this.extractCodeArray(source, 'subsidiaries'),
      branches: this.extractCodeArray(source, 'branches'),
      roles: this.extractCodeArray(source, 'roles')
    };
  }

  private extractRoleSelectionPayload(response: unknown): RoleSelectionFlowResponse {
    const payload = this.asObject(response);
    const nestedData = payload.data && typeof payload.data === 'object'
      ? (payload.data as Record<string, unknown>)
      : undefined;
    const source = nestedData ?? payload;

    return {
      authenticationResult:
        source.authenticationResult && typeof source.authenticationResult === 'object'
          ? (source.authenticationResult as { authorization?: string; accessToken?: string })
          : undefined
    };
  }

  private buildRoleSelectionRequest(
    authentication: AuthenticationFlowResponse,
    login: string
  ): RoleSelectionRequest {
    const subsidiaryCode = authentication.subsidiaries?.[0]?.code;
    const branchCode = authentication.branches?.[0]?.code;
    const roleCode = authentication.roles?.[0]?.code;

    if (!authentication.session) {
      throw new ExternalServiceException('Authentication response did not include session', 502);
    }

    if (subsidiaryCode === undefined || branchCode === undefined || roleCode === undefined) {
      throw new ExternalServiceException(
        'Authentication response did not include subsidiaries, branches, or roles',
        502
      );
    }

    return {
      session: authentication.session,
      authentication: {
        login
      },
      subsidiary: {
        code: subsidiaryCode
      },
      branch: {
        code: branchCode
      },
      role: {
        code: roleCode
      }
    };
  }

  async execute(input: CustomerAccessFlowInput) {
    this.ensureInput(input);
    const login = CUSTOMER_ACCESS_FLOW_LOGIN;
    const password = CUSTOMER_ACCESS_FLOW_PASSWORD;

    const sessionHeaders = {
      ...input.cobisHeaders,
      endUserLogin: login
    };

    let authentication: unknown;
    try {
      authentication = await this.authenticateUserUseCase.execute({
        request: {
          authentication: {
            login,
            password
          }
        },
        cobisHeaders: sessionHeaders
      });
    } catch (error) {
      throw new ExternalServiceException(
        'Customer access flow failed during authentication step',
        502,
        error
      );
    }

    const authenticationPayload = this.extractAuthenticationPayload(authentication);
    const roleSelectionRequest = this.buildRoleSelectionRequest(authenticationPayload, login);

    let roleSelection: unknown;
    try {
      roleSelection = await this.roleSelectionUseCase.execute({
        request: roleSelectionRequest,
        cobisHeaders: sessionHeaders
      });
    } catch (error) {
      throw new ExternalServiceException(
        'Customer access flow failed during role selection step',
        502,
        error
      );
    }

    const roleSelectionPayload = this.extractRoleSelectionPayload(roleSelection);
    const authorization = roleSelectionPayload.authenticationResult?.authorization;

    if (!authorization) {
      throw new ExternalServiceException(
        'Role selection response did not include authenticationResult.authorization',
        502,
        roleSelection
      );
    }

    let naturalPerson;
    try {
      const naturalPersonHeaders = this.withAccessToken(sessionHeaders, authorization);

      naturalPerson = await this.findByIdentificationUseCase.execute({
        identificationNumber: input.identificationNumber,
        identificationType: input.identificationType,
        cobisHeaders: naturalPersonHeaders
      });
    } catch (error) {
      throw new ExternalServiceException(
        'Customer access flow failed during find by identification step',
        502,
        error
      );
    }

    return naturalPerson;
  }
}