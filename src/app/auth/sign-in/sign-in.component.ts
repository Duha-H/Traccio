import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css', '../auth.component.css']
})
export class SignInComponent implements OnInit {

  email = '';
  password = '';
  error = '\n\n';
  signInError = false;
  @ViewChild('submitButton') submitButton: ElementRef;

  constructor(
    private router: Router,
    private authWrapper: AuthWrapperService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Sign In | Traccio');
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.submitButton.nativeElement.click();
      }
    });
  }

  async signIn(identityProvider?: string) {
    // animate button press
    this.submitButton.nativeElement.classList.add('pulse');
    setTimeout(() => {
      this.submitButton.nativeElement.classList.remove('pulse');
    }, 200);
    // execure sign in
    let response;
    if (identityProvider === 'Google') {
      response = await this.authWrapper.googleSignIn();
    } else {
      response = await this.authWrapper.signIn(this.email, this.password);
    }
    if (response.successful) {
      this.router.navigate(['home']);
    } else {
      if (response.payload === 'UserNotConfirmedException') {
        this.router.navigate(['confirmsignup']);
      }
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
