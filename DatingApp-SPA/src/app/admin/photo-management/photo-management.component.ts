import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.scss']
})
export class PhotoManagementComponent implements OnInit {
  photos:any;

  constructor(private adminService:AdminService) { }

  ngOnInit() {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe((photos)=>{
      this.photos = photos;
    }, error =>{
      console.log(error);
    });
  }

  approvePhoto(photoId){
    this.adminService.approvePhoto(photoId).subscribe(()=>{
      this.photos.splice(this.photos.findIndex(photo => photo.id === photoId),1);
    }, error =>{
      console.log(error);
    });
  }

  rejectPhoto(photoId){
    this.adminService.rejectPhoto(photoId).subscribe(()=>{
      this.photos.splice(this.photos.findIndex(photo => photo.id === photoId),1);
    }, error =>{
      console.log(error);
    });
  }

}
