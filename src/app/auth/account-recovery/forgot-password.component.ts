import { OnInit, Component, Output, Input, EventEmitter } from "@angular/core";

@Component({
	selector: 'forgot-password',
	template: '\
	<div class="recovery-component">\
		<p class="secondary-label">Enter the email address used to create your account:</p>\
		<text-field [width]="360" [height]="10" [displayError]="false"\
			(inputChange)="email=$event" [displayLabel]="false" [type]="\'email\'"></text-field>\
		<p class="warning-text">{{error}}<br></p>\
		<button (click)="handleSubmit()" class="submit-button">email me a recovery code</button>\
		<p style="margin-top: 0;">Go back to <a href="" routerLink="/signin" class="login-link">Sign in</a></p>\
	</div>',
	styleUrls: ['./account-recovery.component.css'],
})
export class ForgotPasswordComponent implements OnInit {

	email = '';
	@Input() error = '';
	@Output() submitEmail = new EventEmitter();

	ngOnInit() {
	}

	handleSubmit() {
		this.submitEmail.emit(this.email);
		console.log("submit and stuff");
	}

}
