import { OnInit, Component, Output, Input, EventEmitter, ViewChild, ElementRef } from "@angular/core";

@Component({
	selector: 'forgot-password',
	template: '\
	<div class="recovery-component">\
		<p class="secondary-label">Enter the email address used to create your account:</p>\
		<text-field [width]="360" [height]="10" [displayError]="false"\
			(inputChange)="email=$event" [displayLabel]="false" [type]="\'email\'"></text-field>\
		<p class="warning-text">{{error}}<br></p>\
		<button (click)="handleSubmit()" class="submit-button" #submitButton>email me a recovery code</button>\
		<p style="margin-top: 0;">Go back to <a href="" routerLink="/signin" class="login-link">Sign in</a></p>\
	</div>',
	styleUrls: ['./account-recovery.component.css'],
})
export class ForgotPasswordComponent implements OnInit {

	email = '';
	@Input() error = '';
	@Output() submitEmail = new EventEmitter();
  @ViewChild('submitButton') submitButton: ElementRef;

	ngOnInit() {
		document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.submitButton.nativeElement.click();
      }
    });
	}

	handleSubmit() {
		// animate button press
    this.submitButton.nativeElement.classList.add('pulse');
    setTimeout(() => {
      this.submitButton.nativeElement.classList.remove('pulse');
    }, 200);
		// submit
		this.submitEmail.emit(this.email);
	}

}
