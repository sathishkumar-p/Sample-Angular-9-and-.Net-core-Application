import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_gaurds/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_reslovers/member-detail.resolver';
import { MemberListResolver } from './_reslovers/member-list.resolver';
import { SimpleaggridComponent } from './ag-grid/simpleaggrid/simpleaggrid.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_reslovers/member-edit.resolver';
import { PreventUnsavedChanges } from './_gaurds/prevent-unsaved-changes.guard';
import { ListResolver } from './_reslovers/lists.resolver';

export const appRoutes: Routes =[
    {path: 'home', component:HomeComponent},
    {
        path: '',
        runGuardsAndResolvers:'always',
        canActivate: [AuthGuard],
        children:[
            {path: 'members', component:MemberListComponent, resolve:{users:MemberListResolver}},
            {path: 'members/:id', component:MemberDetailComponent, resolve:{user:MemberDetailResolver}},
            {path: 'member/edit', component:MemberEditComponent, resolve:{user:MemberEditResolver}, canDeactivate:[PreventUnsavedChanges]},
            {path: 'messages', component:MessagesComponent},
            {path: 'lists', component:ListsComponent, resolve:{users:ListResolver}},
            {path: 'aggrid', component:SimpleaggridComponent}
        ]
    },
    {path: '**', redirectTo:'home', pathMatch: 'full'},
];