import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';

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

  constructor(private router: Router, private authWrapper: AuthWrapperService) { }

  ngOnInit() {
  }

  async signIn(identityProvider?: string) {
    let response;
    if (identityProvider === 'Google') {
      response = await this.authWrapper.googleSignIn();
    } else {
      response = await this.authWrapper.signIn(this.email, this.password);
    }
    if (response.successful) {
      this.router.navigate(['home']);
    } else {
      this.signInError = true;
      this.error = response.message;
    }
  }

  setInput(value: string, type: string) {
    if (type === 'email') {
      this.email = value;
    } else if (type === 'password') {
      this.password = value;
    }
    this.error = ''; // remove current error on new input
  }

}
