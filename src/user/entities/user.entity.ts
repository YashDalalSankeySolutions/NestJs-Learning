import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    email:string

    @Column()
    age:number

    @Column({default:"123"})
    password:string

    @Column("text",{array:true,default:["user"]})
    roles:string[]

    @Column({default:"null"})
    accessToken:string

    @Column({default:"null"})
    refreshToken:string
}
