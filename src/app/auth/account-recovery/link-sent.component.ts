import { OnInit, Component, Input, ElementRef, ViewChild, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'link-sent',
  template: '\
  <div class="recovery-component">\
    <p *ngIf="error != \'\'; else success;" class="warning-text" style="margin-top: 160px;">{{error}}</p><br>\
    <ng-template #success>\
      <p style="margin-top: 100px;">Sweet! A password reset link was sent to your email!</p>\
      <p>Click on the link to generate a new password.</p><br>\
    </ng-template>\
    <button style="margin-top: 20px;" (click)="handleSubmit()" class="submit-btn">Sign in</button>\
    <p style="margin-top: 0;">Didn\'t receive a link? <a role="button" (click)="handleResend()" class="login-link">Re-send link</a>.</p>\
	</div>',
  styleUrls: ["./account-recovery.component.css"],
})
export class LinkSentComponent implements OnInit {

  @Input() email = 'your email';
  @Input() error = '';
  @Output() resendLink = new EventEmitter();
  @ViewChild('submitButton') submitButton: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.submitButton.nativeElement.click();
      }
    });
    console.log(this.email);
  }

  handleSubmit() {
    this.router.navigate(['signin']);
  }

  handleResend() {
    this.resendLink.emit();
  }
}
