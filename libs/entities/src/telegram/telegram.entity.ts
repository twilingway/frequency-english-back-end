import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'telegram' })
export class TelegramEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn('uuid')
  id: number;

  @Column()
  is_bot: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  first_name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  last_name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  username: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  language_code: string;
}
