import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {

    constructor(private userservice : UserService){}

    async signup(email : string, password : string) {
        // 1. Check if email is in the database
        const users = await this.userservice.findByEmail(email)
            if(users.length){
                throw new BadRequestException("Email déjà utilisé")
            }
        // 2. Hash the apssword
        // 2.1 Generate salt
        const salt  = randomBytes(8).toString('hex'); // 16 caractère de salt
        // 2.2 Hash password and salt together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // 2.3 Join the hashe dresult and salt together in bd
        const result = salt + '.' + hash.toString('hex');
        // 3. Create new user
        const user = await this.userservice.create(email,result)
        // 4. Return User
        return user;
    }

    async signin(email : string, password : string){

        // 1. Find user by email
        const [user] = await this.userservice.findByEmail(email);
        // 1.2 If user not found, throw error
        if(!user){
            throw new NotFoundException("User not found");
        }
        // 2. Retrieve the salth and ahsh from stored password
        const [salt,storedHash] = user.password.split('.');
        // 3. Hash the supplied password with the salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // 4. Compare the hashed result with stored hash, if they match, return user
        if(hash.toString('hex') !== storedHash){
            throw new BadRequestException("Bad Password");
        }

        return user;
    }

    /*whoAmI(userId : number){
        if (userId == null){
            return console.log("Aucun utilisateur connecté");
        }
        else{
            return this.userservice.findById(userId);
        }
    }*/
}
