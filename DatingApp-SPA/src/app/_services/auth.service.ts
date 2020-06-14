import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  baseUrl= environment.apiUrl + "auth/";
  jwtHelper = new JwtHelperService();
  decodeToken:any;
  currentUser:User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http:HttpClient) { }

changeMemberPhoto(photoUrl:string){
  this.photoUrl.next(photoUrl);
}

login(model: any)
{
 return this.http.post(this.baseUrl + 'login', model).pipe(
    map((response:any) =>{
        const user = response;
        if(user)
        {
          localStorage.setItem("token", user.token);
          localStorage.setItem("user", JSON.stringify(user.appUser));
          this.decodeToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.appUser;
          this.changeMemberPhoto(this.currentUser.photoUrl);
          debugger;
        }
    }
  ));
}

register(model: any) {

  return this.http.post(this.baseUrl +'register',model);

}

loggedIn(){
  const token = localStorage.getItem("token");
  return !this.jwtHelper.isTokenExpired(token);
}

roleMatch(allowedRoles):boolean{
  let isMatch = false;
  const userRoles = this.decodeToken.role as Array<string>;
  allowedRoles.forEach((role) => {
    if(userRoles.includes(role)){
      isMatch = true;
      return isMatch;
    }
  });
  return isMatch;
}

}
