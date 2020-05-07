import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { AuthStoreService } from '../auth-store.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  usernameAttributes = "email";
  signUpFields = [
    {
      label: "Email",
      key: "email",
      required: true,
      type: "string",
    },
    {
      label: "First Name",
      key: "given_name",
      required: true,
      type: "string",
    },
    {
      label: "Last Name",
      key: "family_name",
      required: true,
      type: "string",
    },
    {
      label: "Password",
      key: "password",
      type: "password",
    },
  ];
  signUpConfig = {
    header: "Sign Up",
    signUpFields: this.signUpFields,
    hideAllDefaults: true,
  };
  signInConfig = {};

  constructor(private router: Router, private authStore: AuthStoreService) { }

  ngOnInit() {
  }

  async signUp() {
    try {
      const user = await Auth.signUp({
        username: this.email,
        password: this.password,
        attributes: {
          email: this.email,
          given_name: this.firstName,
          family_name: this.lastName,
        }
      });
      console.log({ user });
      console.log("signup successful");
      this.authStore.setEmail(this.email);
      this.router.navigate(['confirmsignup']);
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

}
