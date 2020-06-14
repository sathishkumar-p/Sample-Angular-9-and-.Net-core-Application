import { Directive, OnInit, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isVisible = false;

  constructor(private viewContainerRef: ViewContainerRef, private template: TemplateRef<any>, private authService: AuthService){ }

  ngOnInit() {
    const userRoles = this.authService.decodeToken.role as Array<string>;

    if(!userRoles){
      this.viewContainerRef.clear();
    }

    if(this.authService.roleMatch(this.appHasRole)){
      if(!this.isVisible){
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.template);
      }else{
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    }
  }

}
