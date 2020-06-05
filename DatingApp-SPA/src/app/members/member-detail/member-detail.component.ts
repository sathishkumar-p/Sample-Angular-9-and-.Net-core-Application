import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { TabsetComponent } from 'ngx-bootstrap/tabs/public_api';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  user:User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.user = data['user'];
    });

    this.router.queryParams.subscribe(queryParams => {
      const selectedTab = queryParams['tab'];
      this.memberTabs.tabs[ selectedTab >0 ? selectedTab : 0].active = true;
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
  
  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }
}
