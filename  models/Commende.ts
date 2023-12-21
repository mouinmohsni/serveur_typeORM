import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Commende {
    @PrimaryGeneratedColumn()
    id_commende?: number

    @Column()
    nom_commende: string

    @ManyToOne(() => User, (user) => user.commendes)
    user: User

    constructor(nom_commende:string ,user:User){
        this.nom_commende=nom_commende
        this.user=user
    }
}