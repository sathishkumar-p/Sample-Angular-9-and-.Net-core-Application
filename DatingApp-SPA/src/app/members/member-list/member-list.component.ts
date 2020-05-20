import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  users:User[];

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.users = data['users'];
    });
  }

}
