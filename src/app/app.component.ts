import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tracker';
  usernameAttributes = 'email';
  signUpFields = [
    {
      label: 'Email',
      key: 'email',
      required: true,
      type: 'string'
    },
    {
      label: 'First Name',
      key: 'given_name',
      required: true,
      type: 'string'
    },
    {
      label: 'Last Name',
      key: 'family_name',
      required: true,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      type: 'password'
    }
  ];
  signUpConfig = {
    header: 'Sign Up',
    signUpFields: this.signUpFields,
    hideAllDefaults: true,
  };
  signInConfig = {};

  constructor(
    public amplifyService: AmplifyService,
  ) {
    this.amplifyService = amplifyService;
  }
}
