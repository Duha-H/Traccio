import { OnInit, Component, EventEmitter, Output, Input } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'reset-successful',
  template: '\
  <div class="recovery-component">\
    <p style="margin-top: 160px;">Password successfully reset!</p>\
    <button style="margin-top: 160px;" (click)="handleSubmit()" class="submit-btn">Sign in</button>\
    <p style="margin-top: 0;">Create a new account? <a href="" routerLink="/signup" class="login-link">Sign up</a></p>\
  </div>',
  styleUrls: ["./account-recovery.component.css"],
})
export class ResetSuccessfulComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() { }

  handleSubmit() {
    this.router.navigate(['signin']);
  }

}
