export interface JwtPayload {
  sub: string;
  name: string;
  isReceptionist?: boolean;
  isManager?: boolean;
  exp: number;
  iat?: number;
}
