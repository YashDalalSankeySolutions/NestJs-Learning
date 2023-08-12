import { Controller,Post,Body, Get, UseGuards, Request, Param, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enum/roles.enum';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { RolesGuard } from './roles.guard';
import { promises } from 'dns';
import { Router } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ){
    }

    @Post('signin')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin,Role.User)
    async signin(@Body() createUserDto: CreateUserDto){
        return this.userService.createUser(createUserDto)
    }

    @Post('login')
    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin,Role.User)
    login(@Body() signInDto:SignInDto){
        return this.authService.login(signInDto.username,signInDto.password)
    }

    @Post('refreshToken')
    // @UseGuards(RolesGuard)
    // @Roles(Role.User)
    async refreshToken(@Body() body:object):Promise<object>{
        console.log("refereshtoken",typeof body)
        return await this.authService.refreshAccessToken(body["refreshToken"])
    }

    @Post('allusers')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async findAllUser(@Body() body:object) : Promise<object>{
        console.log("body")
        return await this.userService.findAllUser();
    }

    @Post(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.User)
    async getprofile(@Param('id') id:number) :Promise<object>{
        return await this.userService.findOneUser(id)
    }

    

    @Patch(':id')
    // @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.User)
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.User)
    async remove(@Param('id') id: number) {
        return await this.userService.deleteUser(id);
    }
}
