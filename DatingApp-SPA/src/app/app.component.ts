import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';
import { User } from './_models/user';
import { NgxFancyLoggerService, LogLevel } from 'ngx-fancy-logger';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DatingApp-SPA';
  jwtHelper = new JwtHelperService();

  constructor(private authService:AuthService, private logger: NgxFancyLoggerService) {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if(token)
    {
      this.authService.decodeToken =  this.jwtHelper.decodeToken(token);
    }
    if(user)
    {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }

    //Fancy Logger DefaultMigrationHost
    logger.header('This is a Ngx Fancy Logger Demo', { color: 'red', fontSize: 30 });
    logger.debug('This is a DEBUG Log', { a: 20, b: 30 });
    logger.info('This is a INFO log', 123, { a: 20, b: 30 });
    logger.warning('This is a WARNING Log', { a: 20, b: 30 });
    logger.error('This is an ERROR Log', { a: 20, b: 30 });

    logger.header('Observable Log Message using debugOperator() ');
    const source$ = of(Math.random(), { test: 'data' }, 123, 'This  is source observable data');
    source$.pipe(
      logger.debugOperator('Source Response : ', LogLevel.INFO),
      map(data => ({ key: Math.random(), response: data}) ),
      logger.debugOperator('Mapped Response : ')
    ).subscribe();
  }
}
