import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer ='Unread';

  constructor(private router: ActivatedRoute, private userService: UserService, 
    private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number){
    this.alertify.confirm('Are you sure you want to delete', ()=>{
      this.userService.deleteMessage(id, this.authService.decodeToken.nameid).subscribe(()=>{
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('Message deleted successfully');
      }, error =>{
        this.alertify.error(error);
      });
    })
  }
  loadMessages() {
    this.userService.getMessages(this.authService.decodeToken.nameid, this.pagination.currentPage,
                                  this.pagination.itemsPerPage, this.messageContainer)
                                  .subscribe((res: PaginatedResult<Message[]>) => {
                                    this.messages = res.result;
                                    this.pagination = res.pagination;
                                  }, error => {
                                    this.alertify.error(error);
                                  }
                                  );
  }

  }
