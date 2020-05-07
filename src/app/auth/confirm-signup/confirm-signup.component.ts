import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { AuthStoreService } from '../auth-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.css']
})
export class ConfirmSignupComponent implements OnInit {

  code = '';
  email = '';

  constructor(private router: Router, private authStore: AuthStoreService) { }

  ngOnInit(): void {
  }

  async confirmSignup() {
    try {
      this.email = this.authStore.userEmail;
      await Auth.confirmSignUp(this.email, this.code);
      console.log('sign up confirmed');
      this.router.navigate(['signin']);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
  }

}
