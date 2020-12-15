/**
 * A collection of FormControl validator functions
 */
import { AbstractControl, ValidatorFn } from "@angular/forms";


export function containsCharacterValidator(regex: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = regex.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}

export function containsUppercaseValidator(): ValidatorFn {
  const regex = new RegExp('^(.*[A-Z]+.*)*$');
  return (control: AbstractControl): {[key: string]: any} | null => {
    const match = regex.test(control.value);
    return match ? null : { upperCase: { value: control.value } };
  };
}

export function containsLowercaseValidator(): ValidatorFn {
  const regex = new RegExp('^(.*[a-z]+.*)*$');
  return (control: AbstractControl): {[key: string]: any} | null => {
    const match = regex.test(control.value);
    return match ? null : { lowerCase: { value: control.value } };
  };
}

export function containsNumberValidator(): ValidatorFn {
  const regex = new RegExp('^(.*[0-9]+.*)*$');
  return (control: AbstractControl): {[key: string]: any} | null => {
    const match = regex.test(control.value);
    return match ? null : { number: { value: control.value } };
  };
}

export function containsSpecialCharValidator(): ValidatorFn {
  const regex = new RegExp('^(.*[#?!@$%^&*-]+.*)*$');
  return (control: AbstractControl): {[key: string]: any} | null => {
    const match = regex.test(control.value);
    return match ? null : { specialChar: { value: control.value } };
  };
}