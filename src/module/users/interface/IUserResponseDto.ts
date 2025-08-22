import { Users } from '../Entyties/users.entity';

export interface IUserResponseDto {
  id: string;
  username: string;
  EmployeeNumber: number;
  isReceptionist: boolean;
  isManager: boolean;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface IUserResponseWithAdmin extends IUserResponseDto {
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    username: string;
    isReceptionist: boolean;
    isManager: boolean;
  };
}

export class ResponseUserDto {
  static toDTO(user: Users): IUserResponseDto {
    return {
      id: user.id,
      username: user.username,
      EmployeeNumber: user.EmployeeNumber,
      isReceptionist: user.isReceptionist,
      isManager: user.isManager,
      createdAt: user.createdAt ?? new Date(0),
      deletedAt: user.deletedAt,
    };
  }

  static toDTOList(users: Users[]): IUserResponseDto[] {
    return users.map((user) => this.toDTO(user));
  }
}

export class ResponseUserWithAdminDto {
  static toDTO(user: Users): IUserResponseWithAdmin {
    return {
      ...ResponseUserDto.toDTO(user),
      password: user.password,
    };
  }

  static toDTOList(users: Users[]): IUserResponseWithAdmin[] {
    return users.map((user) => this.toDTO(user));
  }
}
