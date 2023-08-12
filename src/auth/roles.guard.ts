import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from "./decorators/roles.decorator";
import { Role } from "./enum/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){

    }

    canActivate(context: ExecutionContext): boolean {
        console.log("roles")
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,
        [
            context.getHandler(),
            context.getClass()
        ])
        console.log("requiredRoles------>",requiredRoles)
        if(!requiredRoles){
            console.log("hhhhhhhh")
            return true
        }

        const {body} = context.switchToHttp().getRequest()
        console.log("user---->", body.roles)
        const res = requiredRoles.some(role=>body.roles?.includes(role))
        console.log(res)
        return res
            // console.log("role---->",role)
            // console.log(body.roles?.includes(role))
            
    }
}