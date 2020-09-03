import { Injectable } from '@angular/core';
import { AuthModule } from './auth.module';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Response } from 'src/app/utils/response';

@Injectable({
  providedIn: AuthModule
})
export class AuthWrapperService {

  authState: AuthState = {
    signedIn: false,
    signedUp: false,
  };

  constructor() { }

  async currentAuthenticatedUser(): Promise<boolean> {
    let result = false;
    try {
      await Auth.currentAuthenticatedUser();
      result = true;
    } catch (error) {
      result = false;
    }
    return result;
  }

  async getCurrentAuthenticatedUser(): Promise<any> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      return null;
    }
  }

  async signIn(email: string, password: string): Promise<Response> {
    const response = new Response();

    if (!email || !password) {
      response.error('All sign in fields must be filled');
      return response;
    }

    try {
      // SUCCESS
      await Auth.signIn(email, password);
      this.authState.signedIn = true;
      this.authState.signedUp = false;
    } catch (error) {
      switch (error.code) {
        case 'UserNotFoundException':
          response.error('A user account with this email does not exist');
          break;
        case 'InvalidParameterException':
          response.error('All sign in fields must be filled');
          break;
        case 'NotAuthorizedException':
          response.error('Incorrect password');
          break;
        case 'UserNotConfirmedException':
          response.error('Looks like your email address was never verified, please verify it.');
          response.payload = error.code;
          this.authState.signedUp = true;
          this.authState.signedIn = false;
          break;
        default:
          response.error('An unexpected error occured, please try again');
          console.error('AuthWrapper: unexpected signIn error:', error.message);
          break;
      }
    }

    return response;
  }

  async googleSignIn(): Promise<Response> {
    const response = new Response();

    try {
      await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
      this.authState.signedIn = true;
      this.authState.signedUp = false;
    } catch (error) {
      console.log('AuthWrapper: google sign in error:', error);
      response.error('Error in federated sign in');
    }
    console.log(response, this.authState.signedIn);

    return response;
  }

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<Response> {
    const response = new Response();

    // check for empty fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      response.error('All fields are required and must be filled in');
      return response;
    } else if (password !== confirmPassword) {
      response.error('Looks like your passwords don\'t match.\nRe-enter to make sure they match.');
      return response;
    }

    try {
      // SUCCESS
      const user = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          given_name: firstName,
          family_name: lastName,
        },
      });
      response.payload = user;
      this.authState.signedUp = true;
      this.authState.signedIn = false;
    } catch (error) {
      switch (error.code) {
        case 'InvalidParameterException':
          response.error('A value you provided is either empty or invalid.\nMake sure that you\'ve provided valid values.');
          break;
        case 'InvalidPasswordException':
          response.error('The password you provided is invalid.\nMake sure that you provide a compliant password.');
          break;
        case 'UsernameExistsException':
          response.error('Looks like an account with this email address already exists.\nPlease specify a different email address.');
          break;
        default:
          console.error('AuthWrapper: unexpected signUp error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async confirmSignup(email: string, code: string): Promise<Response> {
    const response = new Response();

    if (!code) {
      response.error('A confirmation code must be provided');
      return response;
    }

    try {
      // SUCCESS
      await Auth.confirmSignUp(email, code);
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          response.error('Looks like the code you provided is incorrect, please try again.');
          break;
        case 'ExpiredCodeException':
          this.resendSignUp(email);
          response.error('Looks like the code you provided is no longer valid.\n A new code was sent to your email, enter the new code.');
          break;
        case 'TooManyFailedAttemptsException':
          response.error('An incorrect code was entered too many times.\nPlease confirm your account at a later time.');
          break;
        default:
          console.error('AuthWrapper: unexpected confirmSignup error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async resendSignUp(email: string): Promise<Response> {
    const response = new Response();

    try {
      // SUCCESS
      await Auth.resendSignUp(email);
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      console.error('AuthWrapper: unexpected resendSignup error:', error);
    }

    return response;
  }

  async forgotPassword(email: string): Promise<Response> {
    const response = new Response();

    if (!email) {
      response.error('An email must be provided');
      return response;
    }

    try {
      // SUCCESS
      await Auth.forgotPassword(email);
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      switch (error.code) {
        case 'UserNotFoundException':
          response.error('No user account found with the specified email address.\nMaybe double-check the email you provided?');
          break;
        case 'UserNotConfirmedException':
          // tslint:disable-next-line: max-line-length
          response.error('Yikes, looks like your account was never successfully verified/confirmed.\nThis should not happen. Please reach out to <insert-support-email>, and provide your email address so we can sort this out.');
          break;
        default:
          console.error('AuthWrapper: unexpected forgotPassword error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async forgotPasswordSubmit(email: string, code: string, newPassword: string, confirmedPassword: string): Promise<Response> {
    const response = new Response();

    if (!code) {
      response.error('No verification code specified.\nEnter the verification code sent to your account email.');
      return response;
    } else if (!newPassword) {
      response.error('New password was not specified');
      return response;
    } else if (!confirmedPassword) {
      response.error('New password was not re-entered.\nRe-enter new password to confirm it.');
      return response;
    } else if (newPassword.trim() !== confirmedPassword.trim()) {
      response.error('Looks like your passwords don\'t match.\nRe-enter to make sure they match.');
      return response;
    }

    try {
      // SUCCESS
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          response.error('Looks like the code you provided is incorrect, please try again.');
          break;
        case 'ExpiredCodeException':
          this.forgotPassword(email);
          response.error('Looks like the code you provided is no longer valid.\n A new code was sent to your email, enter the new code.');
          break;
        case 'InvalidPasswordException':
        case 'InvalidParameterException':
          response.error('The password you provided is invalid.\nMake sure you provide a compliant password.');
          break;
        case 'TooManyFailedAttemptsException':
          response.error('Looks like you\'ve made too many unsuccessful recovery attempts.\nPlease try again at a later time.');
          break;
        case 'UserNotConfirmedException':
          // tslint:disable-next-line: max-line-length
          response.error('Yikes, looks like your account was never successfully verified/confirmed.\nThis should not happen. Please reach out to <insert-support-email>, and provide your email address so we can sort this out.');
          break;
        default:
          console.error('AuthWrapper: unexpected forgotPassword error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async signOut(): Promise<Response> {
    const response = new Response();

    try {
      // SUCCESS
      await Auth.signOut();
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      console.error('AuthWrapper: unexpected forgotPassword error:', error);
      response.error('An unexpected error occured, please try again');
    }

    return response;
  }

  async updateUserAttributes(attrUpdates: {[key: string]: string}): Promise<Response> {
    const response = new Response();

    for (const attribute of Object.keys(attrUpdates)) {
      if (!validUpdateAttributes[attribute]) {
        // since this doesn't need to be user-facing
        // log the error, and remove the invalid attribute
        delete attrUpdates[attribute];
        console.log('AuthWrapper error: attempted to update an invalid parameter:', attribute);
      }
    }

    try {
      // SUCCESS
      const user = await this.getCurrentAuthenticatedUser();
      await Auth.updateUserAttributes(user, attrUpdates);
      const updatedUser = await this.getCurrentAuthenticatedUser();
      response.payload = updatedUser;
    } catch (error) {
      response.payload = error.code;
      switch (error.code) {
        case 'AliasExistsException':
          response.error('Another account with the email address you provided already exists. No changes were saved.');
          break;
        case 'InvalidParameterException':
          response.error('Attempted to update an invalid parameter:', error.message);
          break;
        case 'PasswordResetRequiredException':
          // tslint:disable-next-line: max-line-length
          response.error('Looks like your password needs to be updated before any changes can be applied. Please reset your password first then try again');
          break;
        case 'UserNotConfirmedException':
          response.error('Looks like your email address was not verified. Please verify your email first before applying any changes.');
          break;
        case 'UserNotFoundException':
          response.error('A user account with the email address you provided does not exist.');
          console.error('AuthError: updateAttributes user not found, this should not happen.', error);
          break;
        default:
          console.error('AuthWrapper: unexpected forgotPassword error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
      console.log("nope", error);
    }

    return response;
  }

  async verifyCurrentUserAttributeSubmit(attribute: string, code: string): Promise<Response> {
    const response = new Response();

    if (!validUpdateAttributes[attribute]) {
      response.error('Attempted to verify an invalid parameter');
      console.log('AuthWrapper error: attempted to verify an invalid parameter:', attribute);
      return response;
    }

    try {
      await Auth.verifyCurrentUserAttributeSubmit(attribute, code);
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          response.error('Looks like the verification code you provided is incorrect. Please make sure you\'ve entered the correct code');
          break;
        case 'ExpiredCodeException':
          // tslint:disable-next-line: max-line-length
          response.error('Looks like the verificated code you provided is no longer valid. Worry not! A new code was sent to your email address, please enter the new code.');
          break;
        case 'InvalidParameterException':
          response.error('Attempted to update an invalid parameter:', attribute);
          break;
        case 'PasswordResetRequiredException':
          // tslint:disable-next-line: max-line-length
          response.error('Looks like your password needs to be updated before any changes can be applied. Please reset your password first then try again');
          break;
        case 'UserNotConfirmedException':
          response.error('Looks like your email address was not verified. Please verify your email first before applying any changes.');
          break;
        case 'UserNotFoundException':
          response.error('A user account with the email address you provided does not exist.');
          console.error('AuthError: updateAttributes user not found, this should not happen.', error);
          break;
        default:
          console.error('AuthWrapper: unexpected forgotPassword error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<Response> {
    const response = new Response();

    if (!oldPassword) {
      response.error('Old password was not specified');
      return response;
    } else if (!newPassword) {
      response.error('New password was not specified');
      return response;
    } else if (!confirmPassword) {
      response.error('New password was not re-entered.\nRe-enter new password to confirm it.');
      return response;
    } else if (newPassword.trim() !== confirmPassword.trim()) {
      response.error('Looks like your passwords don\'t match.\nRe-enter to make sure they match.');
      return response;
    }

    try {
      // SUCCESS
      const user = await this.getCurrentAuthenticatedUser();
      await Auth.changePassword(user, oldPassword, newPassword);
    } catch (error) {
      switch (error.code) {
        case 'InvalidParameterException':
        case 'InvalidPasswordException':
          response.error('The new password you provided is invalid.\nMake sure that you provide a compliant password.');
          break;
        case 'PasswordResetRequiredException':
          // tslint:disable-next-line: max-line-length
          response.error('Looks like your password needs to be updated before any changes can be applied. Please reset your password first then try again');
          break;
        case 'NotAuthorizedException':
          response.error('The old password provided is incorrect.\nPlease try again.');
          break;
        case 'TooManyRequestsException':
          response.error('An invalid attempt was made too many times.\nPlease try again later.');
          break;
        case 'UserNotConfirmedException':
          // tslint:disable-next-line: max-line-length
          response.error('Looks like your account was never successfully verified/confirmed.\nPlease verify your email address first before proceeding.');
          break;
        case 'UserNotFoundException':
          response.error('A user account with the email address you provided does not exist.');
          console.error('AuthError: changePassword user not found, this should not happen.', error);
          break;
        default:
          console.error('AuthWrapper: unexpected forgotPassword error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }
}

export interface AuthState {
  signedIn: boolean;
  signedUp: boolean;
}

// temporarily hard-coding valid attributes for update (based on current CognitoUserPool)
export const validUpdateAttributes = {
  given_name: true,
  family_name: true,
  email: true,
};

// can sign_in => when not signed in
// can sign_up => when not signed in
// can confirm_sign_up => when not signed in and signed up
// can recover_account => when not signed in, and not signed up
