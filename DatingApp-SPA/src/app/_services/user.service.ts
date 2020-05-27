import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl= environment.apiUrl + "users/";


constructor(private http: HttpClient) { }

getUsers():Observable<User[]>{
  return this.http.get<User[]>(this.baseUrl);
}

getUser(id):Observable<User>{
  return this.http.get<User>(this.baseUrl + id);
}

updateUser(id:number, user: User){
  return this.http.put(this.baseUrl + id, user);
}

setMainPhoto(userId:number, id:number){
  return this.http.post(this.baseUrl  + userId +'/photos/' + id + '/setMain',{});
}

deletePhoto(userId:number, id:number){
  return this.http.delete(this.baseUrl  + userId +'/photos/' + id);
}
}
