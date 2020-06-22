import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { TimeAgoPipe } from 'time-ago-pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
//Above section is node modules import

// Below section is  our app imports
//import should start with ./ or../ not a folder it will cause error in prod build and also remove unused module or parameters 
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AlertifyService } from './_services/alertify.service';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { RouterModule } from '@angular/router';
import { MembercardComponent } from './members/membercard/membercard.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_reslovers/member-detail.resolver';
import { AuthGuard } from './_gaurds/auth.guard';
import { UserService } from './_services/user.service';
import { MemberListResolver } from './_reslovers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_reslovers/member-edit.resolver'
import { NgxFancyLoggerModule } from 'ngx-fancy-logger';


//Ag Grid Component
import { AgGridModule } from 'ag-grid-angular';
import { SimpleaggridComponent } from './ag-grid/simpleaggrid/simpleaggrid.component';
import { PreventUnsavedChanges } from './_gaurds/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ListResolver } from './_reslovers/lists.resolver';
import { MessagesResolver } from './_reslovers/message.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directive/hasRole.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { RolesModalComponent } from './admin/roles-modal/roles-modal.component';
import { environment } from 'src/environments/environment';


export function tokenGetter(){
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      MembercardComponent, 
      ListsComponent,
      MessagesComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      //Ag Grid Examples
      SimpleaggridComponent,
      MemberMessagesComponent,
      AdminPanelComponent,
      HasRoleDirective,
      UserManagementComponent,
      PhotoManagementComponent,
      RolesModalComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      NgxGalleryModule,
      RouterModule.forRoot(appRoutes),
      FileUploadModule,
      ReactiveFormsModule,
      BsDatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      ButtonsModule.forRoot(),
      JwtModule.forRoot({
         config:{
            tokenGetter:tokenGetter,
            whitelistedDomains:['localhost:5000'],
            blacklistedRoutes:['localhost:5000/api/auth']
         }
      }),
      ModalModule.forRoot(),
      NgxFancyLoggerModule.forRoot(environment.loggerConfig),
      //Ag grid module
      AgGridModule.withComponents([])
   ],
   providers: [
      AuthService,
      AlertifyService,
      AuthGuard,
      UserService,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      PreventUnsavedChanges,
      ListResolver,
      MessagesResolver
   ],
   entryComponents: [RolesModalComponent],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
