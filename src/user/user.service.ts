import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {


  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // private authService : AuthService
    private jwtService:JwtService,
    private configService:ConfigService
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<Object> {
    try{
      const existingUsers = await this.userRepository.find({ where: { email: createUserDto.email} });
      if(existingUsers.length > 3){
        throw new HttpException("Too Many Accounts Linked With Email",HttpStatus.CONFLICT)
      }
      for(let i=0;i<existingUsers.length ;i++){
        if(existingUsers[i].name === createUserDto.name){
          throw new HttpException("User Already Exist",HttpStatus.CONFLICT)
        }
      }
    
      let user: User = new User()
      user.name = createUserDto.name
      user.email = createUserDto.email
      user.age = createUserDto.age
      user.roles = createUserDto.roles
      const payload = {id:user.id, name:user.name, roles:createUserDto.roles}
      const access_Token = await this.jwtService.sign(payload,{
          expiresIn : 60*60,
          secret:this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
      })
      const refresh_token = await this.jwtService.sign({payload},{
          expiresIn: 60*60*24,
          secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET")
      })
      user.accessToken = access_Token
      user.refreshToken = refresh_token

      const res = await this.userRepository.save(user);
      // console.log(res)
      // await this.userRepository.findOne({where:{name:user.name}})
      
      // const tokens = this.authService.generateTokens(payload)

      return {
        statusCode: HttpStatus.OK,
        message:"User Created SuccessFully",
        accessToken : access_Token,
        refreshToken : refresh_token
      } 
    }
    catch(error){
      if(error.status){
        throw new HttpException(error.message,error.status)
      }
      throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAllUser(): Promise<Object> {
    // console.log("findall user service")
    try{
      const res = await this.userRepository.find();
      // console.log("res----->",res)
      return {
        statusCode: HttpStatus.OK,
        message:"Get Users SuccessFully",
        data: res
      }
    }
    catch(error){
      // console.log("uuuuuuuuu->")
      throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOneUser(Id: number): Promise<object> {
    try{
      const user = await this.userRepository.findOne({ where: { id: Id } });
      return {
        statusCode: HttpStatus.OK,
        message:"Get User SuccessFully",
        data: user
      }
    }
    catch(error){
      throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByUserName(username:string):Promise<any>{
    try{
      const user = await this.userRepository.findOne({where:{name:username}})
      return {
        statusCode: HttpStatus.OK,
        message:"Get User SuccessFully",
        data: {user}
      }
    }
    catch(error){
      throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
   
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try{
      const existingUser = await this.userRepository.findOne({ where: { id: id } });
      if(!existingUser){
        throw new HttpException("User Doesn't Exist",HttpStatus.NOT_FOUND)
      }
      let user: User = new User()
      user.name = updateUserDto.name
      user.email = updateUserDto.email
      user.age = updateUserDto.age
      user.id = id
      await this.userRepository.save(user);
      return {
        statusCode: HttpStatus.OK,
        message:"User Updated SuccessFully"
      }
    }
    catch(error){
      if(error.status){
        throw new HttpException(error.message,error.status)
      }
      throw new HttpException("Internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteUser(id: number) {
    try{
      const existingUser = await this.userRepository.findOne({ where: { id: id } });
      if(!existingUser){
        throw new HttpException("User Doesn't Exist",HttpStatus.NOT_FOUND)
      }
      await this.userRepository.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message:"User Deleted SuccessFully"
      }
    }
    catch(error){
      if(error.status){
        throw new HttpException(error.message,error.status)
      }
      throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
