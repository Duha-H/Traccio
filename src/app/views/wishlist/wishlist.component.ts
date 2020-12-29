import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';
import { Application } from 'src/app/models/application';
import { ActivatedRoute, Router } from '@angular/router';
import { ResizeService } from 'src/app/controllers/resize.service';
import { NotificationService } from 'src/app/controllers/notification.service';
import { Title } from '@angular/platform-browser';
import { RouterManagerService } from 'src/app/controllers/router-manager.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  selectionMode = false;

  constructor(
    public userStore: UserStoreService,
    private router: Router,
    private routerManager: RouterManagerService,
    private notificationService: NotificationService,
    public rs: ResizeService,
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Wishlist | Traccio');
    sessionStorage.setItem('wishlistRoute', this.routerManager.getPlainRoute());
  }

  selectApplication(app: Application) {
    if (!this.selectionMode) {
      this.router.navigate([this.routerManager.getPlainRoute(), app.id]);
    }
  }

  addApplication() {
    this.router.navigate([this.routerManager.getPlainRoute(), 'new-app']);
  }

  async removeApplication(app: Application) {
    if (confirm(`Are you sure you\'d like to delete your application for ${app.positionTitle} at ${app.companyName}?`)) {
      const response = await this.userStore.removeWishlistApplication(app.id);
      if (!response.successful) {
        this.notificationService.sendNotification(response.message, 'error');
      } else {
        this.notificationService.sendNotification(`Wishlist application removed successfully!`, 'success');
      }
    }
  }

  toggleSelectionMode() {
    this.selectionMode = !this.selectionMode;
  }
}
