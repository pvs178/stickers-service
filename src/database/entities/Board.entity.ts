import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
