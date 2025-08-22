import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Users } from './Entyties/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDbDto, UpdateUserDbDto } from './Dtos/CreateUserDto';
import { UserSearchQueryDto } from './Dtos/PaginationQueryDto';
import { paginate } from 'src/common/pagination/paginate';
import { IPaginatedResult } from 'src/module/users/interface/IPaginatedResult';
import { AuthValidations } from '../auths/validate/auth.validate';
import { ConfigService } from '@nestjs/config';
import { UpdateRoleDto } from './Dtos/UpdateRoleDto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(searchQuery: UserSearchQueryDto): Promise<IPaginatedResult<Users>> {
    const { username, EmployeeNumber, ...pagination } = searchQuery;

    if (!username && !EmployeeNumber) {
      return await paginate(this.usersRepository, pagination, {
        order: { createdAt: 'DESC' },
        withDeleted: true,
        select: ['id', 'username', 'EmployeeNumber', 'isReceptionist', 'isManager', 'createdAt', 'deletedAt'],
      });
    }

    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder.withDeleted();
    queryBuilder.select([
      'user.id',
      'user.username',
      'user.EmployeeNumber',
      'user.isReceptionist',
      'user.isManager',
      'user.createdAt',
      'user.deletedAt',
    ]);
    queryBuilder.where('1 = 1');

    if (username) {
      queryBuilder.andWhere('LOWER(user.username) LIKE LOWER(:username)', {
        username: `%${username}%`,
      });
    }

    if (EmployeeNumber) {
      queryBuilder.andWhere('CAST(user.EmployeeNumber AS VARCHAR) LIKE :EmployeeNumber', {
        EmployeeNumber: `%${EmployeeNumber}%`,
      });
    }

    queryBuilder.orderBy('user.createdAt', 'DESC');

    const skip = (pagination.page - 1) * pagination.limit;
    queryBuilder.skip(skip).take(pagination.limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const pages = Math.ceil(total / pagination.limit);

    return {
      items,
      total,
      pages,
    };
  }

  async getUserById(id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado.`);
    }

    return user;
  }

  async findByEmployeeNumber(EmployeeNumber: number): Promise<Users | null> {
    return await this.usersRepository.findOne({
      where: { EmployeeNumber },
      select: ['id', 'username', 'EmployeeNumber', 'password', 'isSuperAdmin', 'isManager', 'isReceptionist'],
    });
  }

  async createUserService(dto: CreateUserDbDto): Promise<Users> {
    const camposRestringidos = ['isReceptionist', 'isManager', 'isSuperAdmin'];

    for (const campo of camposRestringidos) {
      if (Object.prototype.hasOwnProperty.call(dto, campo)) {
        delete dto[campo];
      }
    }

    try {
      const user = this.usersRepository.create(dto);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error creating user:', error);
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async updateUserService(id: string, dto: UpdateUserDbDto): Promise<Users> {
    const camposRestringidos = ['isReceptionist', 'isManager', 'isSuperAdmin'];

    for (const campo of camposRestringidos) {
      if (Object.prototype.hasOwnProperty.call(dto, campo)) {
        delete dto[campo];
      }
    }

    if (dto.password) {
      dto.password = await AuthValidations.hashPassword(dto.password);
    }

    const result = await this.usersRepository.update({ id }, dto);

    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const updatedUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        `Error inesperado: Usuario con id ${id} no encontrado tras la actualización final`,
      );
    }

    return updatedUser;
  }

  async rollChange(userId: string, dto: UpdateRoleDto): Promise<void> {
    const camposRestringidos = ['isSuperAdmin'];

    for (const campo of camposRestringidos) {
      if (Object.prototype.hasOwnProperty.call(dto, campo)) {
        delete dto[campo];
      }
    }

    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
      }

      await this.usersRepository.update(user.id, dto);
    } catch (error) {
      this.logger.error('Error changing user role:', error);
      throw new InternalServerErrorException('Error changing user role');
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User: ${id} not found`);
      }
      const result = await this.usersRepository.softDelete(id);

      if (!result.affected) {
        throw new NotFoundException(`User: ${id} not found`);
      }

      return { message: `User ${id} successfully removed.` };
    } catch (error) {
      this.logger.error('Error: Al eliminar la cuenta intente mas tarde', error);
      throw new InternalServerErrorException(`Error deleting User ${id}`);
    }
  }

  async restoreUser(id: string): Promise<Users> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        withDeleted: true,
        select: ['id', 'deletedAt'],
      });

      if (!user) {
        throw new NotFoundException(`User: ${id} not found`);
      }

      if (!user.deletedAt) {
        throw new BadRequestException(`User: ${id} is not deleted`);
      }

      const result = await this.usersRepository.restore(id);

      if (!result.affected) {
        throw new NotFoundException(`User: ${id} could not be restored`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        `Error interno al restaurar usuario ${id}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException(`Error restoring User ${id}`);
    }
  }
}
