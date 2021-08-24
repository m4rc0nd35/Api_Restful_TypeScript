import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Users {

	@PrimaryGeneratedColumn({ type: "int4", zerofill: true, unsigned: true })
	id: number;

	@Column("varchar", { length: 10, unique: true })
	username: string;

	@Column("varchar", { length: 60 })
	password?: string;

	@Column("varchar", { length: 60 })
	name: string;

	@Column("varchar", { length: 60, unique: true })
	email: string;

	@Column("varchar", { length: 60 })
	address: string;

	@Column("varchar", { length: 11, unique: true })
	phone: number;

	@CreateDateColumn({ nullable: true })
	created_at: number;
}