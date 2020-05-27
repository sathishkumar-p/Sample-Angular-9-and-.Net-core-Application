import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  //View Child get the template reference variable like id in jquery 
  @ViewChild('editForm', {static: true}) editForm:NgForm;
  user:User;
  photoUrl: string;

  //Host Listener used to listen browser object changes like tab closing, reload the tab
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event:any){
    if(this.editForm.dirty)
    $event.returnValue = true;
  }

  constructor(private router: ActivatedRoute,private alertify: AlertifyService,
              private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser(){
    this.userService.updateUser(this.authService.decodeToken.nameid, this.user).subscribe(next => {
      this.alertify.success("Profile Updated Successfully");
      this.editForm.reset(this.user); // Reset the form after the submit and also retain the value after reset.
    }, error => {
      this.alertify.error(error);
    }
    );
  }
}
