import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import ManagerMetadata from 'src/entity/manager-metadata.entity';
import BaseEntityWithValidation from 'src/entity/helper/baseEntityWithValidation';

@Entity()
export default class Manager extends BaseEntityWithValidation {
  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToOne(() => ManagerMetadata, (metadata) => metadata.id, {
    cascade: ['insert'],
  })
  @JoinColumn()
  metadata: ManagerMetadata;
}
