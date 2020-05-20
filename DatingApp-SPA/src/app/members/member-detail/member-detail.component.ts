import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
  user:User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.user = data['user'];
    });

    this.galleryOptions =[{
      width:'500px',
      height:'500px',
      imagePercent: 100,
      thumbnailsColumns:4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview:false
    }];
    
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description,
      })
    }
    return imageUrls;
  }
  

}
