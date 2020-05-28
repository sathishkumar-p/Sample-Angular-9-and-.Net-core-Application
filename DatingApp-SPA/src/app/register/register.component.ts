import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user:User;
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>; // Since we can't declare full property of class use partial

  constructor(private authService:AuthService, private alertify: AlertifyService, 
              private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.bsConfig={
      containerClass:'theme-red'
    };
    this.createRegistrationForm();
  }

  createRegistrationForm(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    }, {validator: this.passwordMatcheValidator});
  }

  passwordMatcheValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmPassword').value ? g.controls['confirmPassword'].setErrors(null) 
                                                                      : g.controls['confirmPassword'].setErrors({'mismatch':true});
  }
  register(){
    if(this.registerForm.valid){
      this.user = Object.assign({}, this.registerForm.value); // Assign the src to target empty object value

      this.authService.register(this.user).subscribe(next => {
        this.alertify.success("Registered in Successfully");
      }, error =>{
        this.alertify.error(error);
      },() =>{
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
   }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
