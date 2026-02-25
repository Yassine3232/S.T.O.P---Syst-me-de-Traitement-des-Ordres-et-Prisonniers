import { NestInterceptor, UseInterceptors, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";

export class SerializeInterceptor implements NestInterceptor{

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Avant que le callhandler s'occupe de la request
        console.log('before', context);

        return next.handle().pipe(
            map((data : any) => {
                // Avant que la réponse soit envoyé
                console.log('after...', data)
            })
        )
    }
}