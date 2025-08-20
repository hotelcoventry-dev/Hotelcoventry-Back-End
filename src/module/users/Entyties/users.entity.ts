import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'Users',
})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  username: string;

  @Column({ type: 'bigint', nullable: false, unique: true })
  EmployeeNumber: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  isReceptionist: boolean;

  @Column({ type: 'boolean', default: false })
  isManager: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date | null;
}
