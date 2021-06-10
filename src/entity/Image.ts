import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Image {

    @PrimaryGeneratedColumn({ type: "int4", zerofill: true, unsigned: true})
    id: number;
	
	@Column("int4", {nullable: false})
	id_user: number;

    @Column("varchar", { length: 60, unique: true })
    key_image: string;

    @CreateDateColumn({nullable: true})
    create_at: number;

}
