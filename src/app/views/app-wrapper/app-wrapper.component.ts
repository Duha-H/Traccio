import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { UserStoreService } from 'src/app/models/user-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wrapper',
  templateUrl: './app-wrapper.component.html',
  styleUrls: ['./app-wrapper.component.css']
})
export class AppWrapperComponent implements OnInit {
  signedIn: boolean;

  constructor(
    private userStore: UserStoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async signOut() {
    try {
        await Auth.signOut();
        this.signedIn = false;
        this.userStore.clearData();
        this.router.navigate(['signin']);
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }

}
