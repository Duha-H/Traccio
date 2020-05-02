import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {
  }

}
