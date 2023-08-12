import { IsArray, IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator"


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name:string

    @IsEmail()
    email:string

    @IsInt()
    age:number

    @IsString()
    @IsNotEmpty()
    password:string

    @IsArray()
    roles:string[]
}
