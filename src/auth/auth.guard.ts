import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtServices: JwtService, private configService: ConfigService) {

    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("auth")
        const request = context.switchToHttp().getRequest()
        // console.log("request----->",request)
        const token = this.extractTokenFromRequest(request)
        // console.log("token------->",token)
        if (!token) {
            // console.log("!token------->")
            throw new UnauthorizedException();
        }
        try {
            // console.log("Working--------->")
            const payload = this.jwtServices.verify(
                token,{
                    secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET")
                }
            )
            // console.log('payload-------->', payload)
            request["user"] = payload
            console.log("request-------->",request.user)
            return true;
        } catch {
            // console.log("errro")
            throw new UnauthorizedException();
        }
        
    }
    private extractTokenFromRequest(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}