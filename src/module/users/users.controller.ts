import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  Body,
  UseGuards,
  UsePipes,
  ParseUUIDPipe,
  ValidationPipe,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { Roles, UserRole } from 'src/decorator/role.decorator';
import { AuthGuard } from 'src/guards/auth.guards';
import { RoleGuard } from 'src/guards/auth.guards.admin';
import {
  ResponseUserDto,
  ResponseUserWithAdminDto,
  IUserResponseDto,
  AuthenticatedRequest,
} from './interface/IUserResponseDto';
import { UpdateUserDbDto } from './Dtos/CreateUserDto';
import { UserSearchQueryDto } from './Dtos/PaginationQueryDto';
import { PaginatedUsersDto } from './Dtos/paginated-users.dto';
import { UpdateRoleDto } from './Dtos/UpdateRoleDto';
import { Users } from './Entyties/users.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'find all' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Find all',
  })
  @Get('all')
  async findAll(): Promise<Users[]> {
    return await this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve all users (paginated) with optional search filters',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
    description: 'Username to search for users',
  })
  @ApiResponse({ status: 200, description: 'OK', type: PaginatedUsersDto })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MANAGER)
  @Get()
  async getUsers(@Query() searchQuery: UserSearchQueryDto): Promise<PaginatedUsersDto> {
    const { items, ...meta } = await this.usersService.getUsers(searchQuery);
    return { ...meta, items: ResponseUserWithAdminDto.toDTOList(items) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'OK', type: ResponseUserDto })
  @UseGuards(AuthGuard)
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseUserDto> {
    return ResponseUserDto.toDTO(await this.usersService.getUserById(id));
  }

  @Patch('Roles/:id')
  @ApiOperation({ summary: 'Role change by ID' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MANAGER)
  async rollChangeUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<{
    message: string;
  }> {
    await this.usersService.rollChange(userId, dto);
    return { message: 'Los roles se actualizaron correctamente' };
  }

  @Put('update/user')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDbDto })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MANAGER)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUser(@Req() req: AuthenticatedRequest, @Body() updateData: UpdateUserDbDto): Promise<IUserResponseDto> {
    const user = await this.usersService.updateUserService(req.user.sub, updateData);
    return ResponseUserDto.toDTO(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID (soft delete)' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.usersService.deleteUser(id);
  }

  @Patch('restore/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Restore deleted user (soft delete)' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID to restore',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully restored',
    type: ResponseUserDto,
  })
  async restoreUser(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseUserDto> {
    const user = await this.usersService.restoreUser(id);
    return ResponseUserDto.toDTO(user);
  }
}
