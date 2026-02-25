import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {


    signin() {

        // 1. Check if email is in the database

        // 2. Hash the apssword

        // 3. Create new user

        // 4. Return User
        return 'this action will sign in a user'
    }

    signup(){
        return 'this action will sign up a user'
    }
}
