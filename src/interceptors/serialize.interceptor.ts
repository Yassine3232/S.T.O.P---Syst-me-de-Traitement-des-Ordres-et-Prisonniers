import { NestInterceptor, UseInterceptors, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";
import { plainToClass } from "class-transformer";
//import { UserDto } from "src/users/dtos/user.dto";

interface ClassConstructor{
    new (...args : any[]) : {};
}

export function Serialize(dto : ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{
    constructor (private dto : any){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Avant que le callhandler s'occupe de la request
        // console.log('before', context);

        return next.handle().pipe(
            map((data : any) => {
                // Avant que la réponse soit envoyé
                // console.log('after...', data)
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues : true
                });
            })
        )
    }
}