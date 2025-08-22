export interface JwtPayload {
  sub: string;
  username: string;
  EmployeeNumber: number;
  isReceptionist?: boolean;
  isManager?: boolean;
  isSuperAdmin?: boolean;
  exp: number;
  iat?: number;
}
