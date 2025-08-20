export interface JwtPayload {
  sub: string;
  name: string;
  isConserge?: boolean;
  isEncargado?: boolean;
  exp: number;
  iat?: number;
}
