import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {

    constructor(
        private userService: UserService, 
        private jwtService : JwtService,
        private configService : ConfigService
    ){}

    async generateTokens(payload){
        const access_Token = await this.jwtService.sign(payload,{
            expiresIn : 60*60,
            secret:this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
        })
        const refresh_token = await this.jwtService.sign({payload},{
            expiresIn: 60*60*24,
            secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET")
        })
        return {
            access_Token,
            refresh_token
        }
    }

    async login(username:string, pass:string):Promise<object>{
        try{
            const {data} = await this.userService.findByUserName(username)
            const user = data.user
            if(user?.password !== pass){
                throw new UnauthorizedException()
            }
            const payload = {id:user.id, name:user.name,roles:user.roles}
            const tokens = this.generateTokens(payload)
            
            return {
                statusCode: HttpStatus.OK,
                message:"AccessToken and RefreshToken Generated SuccessFully",
                access_Token : (await tokens).access_Token,
                refresh_token : (await tokens).refresh_token
            }
        }
        catch(error){
            if(error.status){
              throw new HttpException(error.message,error.status)
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async refreshAccessToken(refreshToken:string){
        try{
            const decodedRefreshToken = await this.jwtService.verify(refreshToken,{
                secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET")
            });
            if( decodedRefreshToken.exp <= Date.now()/1000 ){
                throw new HttpException("Refresh Token has been expired",403)
            }
            const newAccessToken = await this.jwtService.sign(decodedRefreshToken.payload,{
                expiresIn: 60,
                secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET")
            })
            return { 
                statusCode: HttpStatus.OK,
                message:"AccessToken Generated SuccessFully",
                accessToken:newAccessToken 
            }
        }
        catch(error){
            console.log(error)
            if(error.status){
              throw new HttpException(error.message,error.status)
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
