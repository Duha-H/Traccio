import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';
import { Application } from 'src/app/models/application';
import { Router } from '@angular/router';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  applications: Application[] = [];

  constructor(private userStore: UserStoreService, private router: Router, public rs: ResizeService) { }

  ngOnInit() {
    this.userStore.wishlistApps.subscribe(apps => {
      this.applications = apps;
    });
  }

  selectApplication(app: Application) {
    console.log('clicked?', app);
    this.router.navigate(['/wishlist', app.id]);
  }

}
