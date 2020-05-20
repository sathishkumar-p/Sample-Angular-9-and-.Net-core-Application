import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  model:any ={};
  @Output() cancelRegister = new EventEmitter();

  constructor(private authService:AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register(){
    this.authService.register(this.model).subscribe(next => {
      this.alertify.success("Registered in Successfully");
    }, error =>{
      this.alertify.error(error);
    });
   }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
