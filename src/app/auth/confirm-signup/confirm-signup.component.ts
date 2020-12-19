import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStoreService } from 'src/app/models/user-store.service';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';
import { Title } from '@angular/platform-browser';
import { LoaderService } from 'src/app/controllers/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.css', '../auth.component.css']
})
export class ConfirmSignupComponent implements OnInit, OnDestroy {

  email = '';
  error = '';
  success = false;
  submitButton: ElementRef;
  emailSub: Subscription;
  @ViewChild('submitButton') set button(element: ElementRef) {
    if (element) {
      this.submitButton = element;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStore: UserStoreService,
    private authWrapper: AuthWrapperService,
    private titleService: Title,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Confirm Sign Up | Traccio');
    this.emailSub = this.userStore.user.subscribe(user => {
      this.email = user.email;
    });
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.submitButton.nativeElement.click();
      }
    });
    this.success = this.route.snapshot.queryParams.success === 'true' ? true : false;
  }

  ngOnDestroy() {
    this.emailSub.unsubscribe();
  }

  async handleResend() {
    const response = await this.authWrapper.resendVerificationLink(this.email);
    if (response.successful) {
      this.loaderService.setLoadingState(true);
      setTimeout(() => {
        this.loaderService.setLoadingState(false);
      }, 1000);
    } else {
      this.error = response.message;
    }
  }

}
