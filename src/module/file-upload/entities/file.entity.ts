import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  url: string;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  publicId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_Id' })
  product: Product;
}
