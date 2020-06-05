import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable , of} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Message } from '../_models/Message';

//Basically, a Resolver acts like middleware, which can be executed before a component is loaded.
//Interface that classes can implement to be a data provider. A data provider class can be used with the router to resolve data during navigation. 
//The interface defines a resolve() method that will be invoked when the navigation starts. The router will then wait for the data to be resolved before the route is finally activated.

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private userService: UserService, private authService: AuthService,
        private router: Router,private alertify: AlertifyService)
    {}

    resolve(route: ActivatedRouteSnapshot):Observable<Message[]>{
        return this.userService.getMessages(this.authService.decodeToken.nameid,this.pageNumber, this.pageSize, this.messageContainer).pipe(           
            catchError(error => {
            this.alertify.error("Problem retrieving Messages");
            this.router.navigate(['/home']);
            return of(null);
        }));
    }
}
