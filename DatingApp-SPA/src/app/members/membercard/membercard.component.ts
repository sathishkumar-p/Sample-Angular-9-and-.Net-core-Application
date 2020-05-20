import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';

@Component({
  selector: 'app-membercard',
  templateUrl: './membercard.component.html',
  styleUrls: ['./membercard.component.scss']
})
export class MembercardComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
