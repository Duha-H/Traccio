import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  email = '';
  password = '';
  error = '\n\n';
  signInError = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }


  async signIn() {
    if (this.email.length === 0 || this.password.length === 0) {
      this.error = "All sign in fields must be filled";
      this.signInError = true;
      return;
    }

    try {
      await Auth.signIn(this.email, this.password);
      console.log('signed in');
      this.router.navigate(['']);
    } catch (error) {
      console.log('error signing in', error);
      this.signInError = true;
      switch (error.code) {
        case "UserNotFoundException":
          this.error = "A user account with this email does not exist";
          break;
        case "InvalidParameterException":
          this.error = "All sign in fields must be filled";
          break;
        case "NotAuthorizedException":
          this.error = "Incorrect email or password";
          break;
        default:
          this.error = error.message;
          break;
      }
    }
  }

}
