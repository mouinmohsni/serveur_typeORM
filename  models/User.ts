import {Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany} from "typeorm"
import { Commende } from "./Commende"



@Entity()
@Unique(["e_mail"])
export class User {

    @PrimaryGeneratedColumn()
    id_user?: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    e_mail: string;

    @Column()
    password: string;

    @OneToMany(() => Commende, (commende) => commende.user)
    commendes?: Commende[];
    constructor( first_name: string, last_name: string, e_mail: string, password: string, commendes:Commende[]) {

        this.first_name = first_name;
        this.last_name = last_name;
        this.e_mail = e_mail;
        this.password = password;
        this.commendes= commendes;
    }

}


