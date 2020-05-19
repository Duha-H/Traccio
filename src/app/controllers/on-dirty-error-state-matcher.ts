import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class OnDirtyErrorStateMatcher extends ErrorStateMatcher {

	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || isSubmitted));
	}

}
