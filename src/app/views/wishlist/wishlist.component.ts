import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';
import { Application } from 'src/app/models/application';
import { Router } from '@angular/router';
import { ResizeService } from 'src/app/controllers/resize.service';
import { NotificationService } from 'src/app/controllers/notification.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  applications: Application[] = [];
  selectionMode = false;

  constructor(
    private userStore: UserStoreService,
    private router: Router,
    private notificationService: NotificationService,
    public rs: ResizeService
  ) { }

  ngOnInit() {
    this.userStore.wishlistApps.subscribe(apps => {
      this.applications = apps;
    });
    sessionStorage.setItem('wishlistRoute', '/home/wishlist');
  }

  selectApplication(app: Application) {
    if (!this.selectionMode) {
      this.router.navigate(['/home/wishlist', app.id]);
    }
  }

  addApplication() {
    this.router.navigate(['/home/wishlist', 'new-app']);
  }

  async removeApplication(app: Application) {
    if (confirm(`Are you sure you\'d like to delete your application for ${app.positionTitle} at ${app.companyName}?`)) {
      const response = await this.userStore.removeWishlistApplication(app.id);
      if (!response.successful) {
        this.notificationService.sendNotification(response.message, 'error');
      } else {
        this.notificationService.sendNotification(`Wishlist application removed successfully!`, 'success');
      }
      if (this.applications.length === 0) {
        this.selectionMode = false;
      }
    }
  }

  toggleSelectionMode() {
    this.selectionMode = !this.selectionMode;
  }
}
