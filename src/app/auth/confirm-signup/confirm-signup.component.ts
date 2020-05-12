import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { AuthStoreService } from '../auth-store.service';
import { Router } from '@angular/router';
import { APIService } from 'src/app/API.service';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.css']
})
export class ConfirmSignupComponent implements OnInit {

  code = '';
  email = '';

  constructor(private router: Router, private authStore: AuthStoreService, private api: APIService) { }

  ngOnInit() {
    this.email = this.authStore.email;
  }

  async confirmSignup() {
    try {
      await Auth.confirmSignUp(this.authStore.email, this.code);
      console.log('sign up confirmed');
      // const result = await this.api.CreateUserEntry({
      //   firstName: this.authStore.firstName,
      //   lastName: this.authStore.lastName,
      //   id: this.authStore.id
      // });
      // console.log(result);
      this.router.navigate(['signin']);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
  }

}
