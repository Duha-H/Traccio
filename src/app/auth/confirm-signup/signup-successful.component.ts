import { OnInit, Component, EventEmitter, Output, Input } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'signup-successful',
  template: '\
  <div class="confirm-signup-container">\
    <h2>Confirm Sign Up</h2>\
    <p style="margin-top: 80px;">Sign up confirmed. Looks like you\'re all set!</p>\
    <button (click)="handleSubmit()" class="submit-btn">Sign in</button>\
    <p style="margin-top: 0;">Create a new account? <a href="" routerLink="/signup" class="login-link">Sign up</a></p>\
  </div>',
  styleUrls: ["./confirm-signup.component.css"],
})
export class SignupSuccessfulComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

  handleSubmit() {
    this.router.navigate(['signin']);
  }

}
