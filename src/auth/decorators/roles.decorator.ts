import { Role } from "../enum/roles.enum";
import { SetMetadata } from "@nestjs/common/decorators";

export const ROLES_KEY='roles'
export const Roles=(...roles:Role[])=> SetMetadata(ROLES_KEY,roles)