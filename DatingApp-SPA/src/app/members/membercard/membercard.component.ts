import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-membercard',
  templateUrl: './membercard.component.html',
  styleUrls: ['./membercard.component.scss']
})
export class MembercardComponent implements OnInit {
  @Input() user: User;

  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number){
    this.userService.sendLike(this.authService.decodeToken.nameid,id).subscribe( data =>{
      this.alertify.success('You have liked:'+ this.user.knownAs);
    }, error =>{
      this.alertify.error(error);
    });
  }

}
