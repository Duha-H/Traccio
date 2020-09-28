import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStoreService } from 'src/app/models/user-store.service';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.css']
})
export class ConfirmSignupComponent implements OnInit {

  code = '';
  email = '';
  error = '';
  success = false;
  resendCode = false;
  resendLimit = 5;
  submitButton: ElementRef;
  @ViewChild('submitButton') set button(element: ElementRef) {
    if (element) {
      this.submitButton = element;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStore: UserStoreService,
    private authWrapper: AuthWrapperService
  ) { }

  ngOnInit() {
    this.userStore.user.subscribe(user => {
      this.email = user.email;
    });
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.submitButton.nativeElement.click();
      }
    });
    this.route.params.subscribe(params => {
      if (params.success) {
        this.success = true;
      }
    });
  }

  async confirmSignup() {
    // animate button press
    this.submitButton.nativeElement.classList.add('pulse');
    setTimeout(() => {
      this.submitButton.nativeElement.classList.remove('pulse');
    }, 200);
    // execure confirmation

    if (!this.email) {
      this.router.navigate(['signin']);
      return;
    }

    const response = await this.authWrapper.confirmSignup(this.email, this.code);
    if (response.successful) {
      this.success = true;
    } else {
      this.error = response.message;
    }
  }

  async handleResend() {
    await this.authWrapper.resendSignUp(this.email);
    this.resendCode = true;
    this.resendLimit -= 1;
  }

}
