import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  applications: Application[] = [];

  constructor(private userStore: UserStoreService) { }

  ngOnInit() {
    this.userStore.wishlistApps.subscribe(apps => {
      this.applications = apps;
    });
  }

}
