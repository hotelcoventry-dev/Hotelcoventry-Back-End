export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    EmployeeNumber: number;
    isReceptionist: boolean;
    isManager: boolean;
  };
}

export interface IUserAuthResponse {
  id: string;
  username: string;
  EmployeeNumber: number;
  isReceptionist: boolean;
  isManager: boolean;
  createdAt: Date;
  deletedAt: Date | null;
}
