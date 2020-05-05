import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/models/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name = '';

  constructor(private userStore: UserStoreService) { }

  ngOnInit() {
    try {
      this.name = `${this.userStore.user.firstName} ${this.userStore.user.lastName}`;
    } catch (error) {
      console.log("User not defined yet");
      console.log(error);
    }
  }

}
