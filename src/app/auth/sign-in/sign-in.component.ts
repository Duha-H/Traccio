import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { AuthWrapperService } from '../auth-wrapper.service';

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


  async signIn() {
    const response = await this.authWrapper.signIn(this.email, this.password);
    if (response.successful) {
      console.log("Looking good");
      this.router.navigate(['']);
    } else {
      this.signInError = true;
      this.error = response.message;
    }
  }

}
