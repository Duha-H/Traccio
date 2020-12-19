import { Injectable } from '@angular/core';
import { AuthModule } from './auth.module';
import { Response } from 'src/app/utils/response';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { LoaderService } from '../controllers/loader.service';

@Injectable({
  providedIn: AuthModule
})
export class AuthWrapperService {

  authState: AuthState = {
    signedIn: false,
    signedUp: false,
  };
  googleAuthProvider: firebase.auth.GoogleAuthProvider;

  constructor(private fireAuth: AngularFireAuth, private fireStore: AngularFirestore, private loaderService: LoaderService) {
    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  }

  async currentAuthenticatedUser(): Promise<boolean> {
    let result = false;
    if (await this.fireAuth.currentUser) {
      result = true;
    }
    return result;
  }

  async getCurrentAuthenticatedUser(): Promise<firebase.User | null> {
    return await this.fireAuth.currentUser;
  }

  async signIn(email: string, password: string): Promise<Response> {
    const response = new Response();

    if (!email || !password) {
      response.error('All sign in fields must be filled');
      return response;
    }

    try {
      // SUCCESS
      await this.fireAuth.signInWithEmailAndPassword(email, password);
      this.authState.signedIn = true;
      this.authState.signedUp = false;
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          response.error('A user account with this email does not exist');
          break;
        case 'auth/invalid-email':
          response.error('The email address specified is invalid');
          break;
        case 'auth/wrong-password':
          response.error('Incorrect password');
          break;
        case 'auth/user-disabled':
          response.error('Looks like the account associated with this email address has been disabled.\nIf this is unexpected, please send an email to support@traccio.app to resolve this issue.');
          response.payload = error.code;
          this.authState.signedUp = true;
          this.authState.signedIn = false;
          break;
        case 'auth/too-many-requests':
          // tslint:disable-next-line: max-line-length
          response.error('Looks like you\'ve had too many failed log in attempts.\nYou can try resetting your password by clicking \'Forgot password\' below, or try signing in again at a later time.');
          break;
        default:
          response.error('An unexpected error occured, please try again');
          console.error('AuthWrapper: unexpected signIn error:', error.message, error.code);
          break;
      }
    }

    return response;
  }

  async googleSignIn(): Promise<Response> {
    const response = new Response();

    try {
      response.payload = (await this.fireAuth.signInWithRedirect(this.googleAuthProvider));
      this.authState.signedIn = true;
      this.authState.signedUp = false;
    } catch (error) {
      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          // tslint:disable-next-line: max-line-length
          response.error('Unable to sign in, looks like a user account with this email address is already in-use with a different sign-in method.\nTry signing in with the correct sign-in method, or use a different Google account.');
          break;
        case 'auth/popup-blocked':
          response.error('Looks like the sign-in popup is being blocked by your browser.\nEnable popups from Traccio and try again.');
          break;
        case 'auth/popup-closed-by-user':
          response.error('Looks like the sign in popup has been closed.\nPlease try again.');
          break;
        default:
          console.error('AuthWrapper: google sign in error:', error);
          response.error('An unexpected error occured, please try again', error);
          // TODO: figure out a way to propagate errors here to some kind of logger
          break;
      }
    }

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
      const user = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      // send verification email
      await user.user.sendEmailVerification({
        url: `http://${window.location.host}/confirmsignup;success=true`, // TODO: update later
        handleCodeInApp: true,
      });
      // add user info to database
      await this.fireStore.collection('users').doc(user.user.uid).set({
        firstName,
        lastName,
        email,
        journeys: [],
        theme: 'light',
        palette: 'palette-0',
        journeyInactive: 90,
        appStale: 60,
        wishlist: {},
      });
      // set response payload
      response.payload = user.user;
      this.authState.signedUp = true;
      this.authState.signedIn = false;
    } catch (error) {
      response.payload = error;
      switch (error.code) {
        case 'auth/email-already-in-use':
          response.error('Looks like an account with this email address already exists.\nPlease specify a different email address.');
          break;
        case 'auth/invalid-email':
          response.error('A value you provided is either empty or invalid.\nMake sure that you\'ve provided valid values.');
          break;
        case 'auth/weak-password':
          response.error('Looks like the password provided is too weak, please provide a stronger password');
          break;
        default:
          console.error('AuthWrapper: unexpected signUp error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async resendVerificationLink(email: string): Promise<Response> {
    const response = new Response();

    try {
      // SUCCESS
      const user = await this.fireAuth.currentUser;
      // send verification email
      await user.sendEmailVerification({
        url: `http://${window.location.host}/confirmsignup?success=true`, // TODO: update later
        handleCodeInApp: true,
      });
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      console.error('AuthWrapper: unexpected resendVerificationLink error:', error);
      response.error('An unexpected error occured.\nPlease try using the link in your email once again, or re-sending a new link.');
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
      await this.fireAuth.sendPasswordResetEmail(email, {
        url: `http://${window.location.host}/accountrecovery?mode=resetSuccessful`,
        handleCodeInApp: true,
      });
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          response.error('The email address provided is invalid, make sure you provide a valid email address');
          break;
        case 'auth/user-not-found':
          response.error('No user account found with the specified email address.\nMaybe double-check the email you provided?');
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
      response.error('No verification code specified.\nTry using the link in your email once again, or re-send a verification link.');
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
      await this.fireAuth.confirmPasswordReset(code, newPassword);
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-action-code':
          response.error('Looks like the code you provided is incorrect, please try again.');
          break;
        case 'auth/expired-action-code':
          this.forgotPassword(email);
          response.error('Looks like the code you provided is no longer valid.\n A new code was sent to your email, enter the new code.');
          break;
        case 'auth/user-disabled':
          response.error('Looks like the account associated with this email address has been disabled.\nIf this is unexpected, please send an email to support@traccio.app to resolve this issue.');
          response.payload = error.code;
          break;
        case 'auth/weak-password':
          response.error('Looks like the password provided is too weak, please provide a stronger password');
          break;
        case 'auth/user-not-found':
          response.error('A user account with this email does not exist');
          break;
        default:
          console.error('AuthWrapper: unexpected forgotPassword error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async verifyPasswordResetCode(actionCode: string, continueUrl?: string): Promise<Response> {
    const response = new Response();

    if (!actionCode) {
      response.error('Unexpected error: no action code provided. Try using the link in your email once again, or re-send a verification link.');
      return response;
    }

    try {
      const email = await this.fireAuth.verifyPasswordResetCode(actionCode);
      response.payload = {
        email,
        actionCode,
      };
    } catch (error) {
      switch (error.code) {
        case 'auth/expired-action-code':
          response.error('Action code expired. Try re-sending a new verification link below.');
          break;
        case 'auth/invalid-action-code':
          response.error('Action code invalid. Try re-sending a new verification link below.');
          break;
        case 'auth/user-disabled':
          response.error('Looks like your user account has been disabled.\nIf this is unexpected send a Support Request to support@traccio.app');
          break;
        case 'auth/user-not-found':
          response.error('A user account corresponding to the given reset code was not found.\nIf this is unexpected send a Support Request to support@traccio.app');
          break;
        default:
          console.error('AuthWrapper: unexpected verifyPasswordResetCode error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async checkActionCode(actionCode: string): Promise<Response> {
    const response = new Response();

    if (!actionCode) {
      response.error('Unexpected error: no action code provided.\nTry using the link in your email once again, or re-send a verification link.');
      return response;
    }

    try {
      const actionCodeInfo = await this.fireAuth.checkActionCode(actionCode);
      response.payload = actionCodeInfo;
      this.applyActionCode(actionCode);
    } catch (error) {
      switch (error.code) {
        case 'auth/expired-action-code':
          response.error('Action code expired. Try re-sending a new verification link below.');
          break;
        case 'auth/invalid-action-code':
          response.error('Action code invalid. Try re-sending a new verification link below.');
          break;
        case 'auth/user-disabled':
          response.error('Looks like your user account has been disabled.\nIf this is unexpected send a Support Request to support@traccio.app');
          break;
        case 'auth/user-not-found':
          response.error('A user account corresponding to the given reset code was not found.\nIf this is unexpected send a Support Request to support@traccio.app');
          break;
        default:
          console.error('AuthWrapper: unexpected verifyPasswordResetCode error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async applyActionCode(actionCode: string): Promise<Response> {
    const response = new Response();

    if (!actionCode) {
      response.error('Unexpected error: no action code provided. Try using the link in your email once again, or re-send a verification link.');
      return response;
    }

    try {
      await this.fireAuth.applyActionCode(actionCode);
    } catch (error) {
      switch (error.code) {
        case 'auth/expired-action-code':
          response.error('Action code expired. Try re-sending a new verification link below.');
          break;
        case 'auth/invalid-action-code':
          response.error('Action code invalid. Try re-sending a new verification link below.');
          break;
        case 'auth/user-disabled':
          response.error('Looks like your user account has been disabled.\nIf this is unexpected send a Support Request to support@traccio.app');
          break;
        case 'auth/user-not-found':
          response.error('A user account corresponding to the given reset code was not found.\nIf this is unexpected send a Support Request to support@traccio.app');
          break;
        default:
          console.error('AuthWrapper: unexpected verifyPasswordResetCode error:', error);
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
      await this.fireAuth.signOut();
      this.authState.signedIn = false;
      this.authState.signedUp = false;
    } catch (error) {
      console.error('AuthWrapper: unexpected signOut error:', error);
      response.error('An unexpected error occured, please try again');
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

    const user = await this.fireAuth.currentUser;
    const reauth = await this.reauthenticateUser(user.email, oldPassword);
    if (!reauth.successful) {
      response.error('Your account could not be reauthenticated. Make sure you\'ve entered the correct password.');
      return response;
    }
    try {
      // SUCCESS
      await user.updatePassword(newPassword);
    } catch (error) {
      switch (error.code) {
        case 'auth/weak-password':
          response.error('Looks like the password provided is too weak, please provide a stronger password');
          break;
        default:
          console.error('AuthWrapper: unexpected forgotPassword error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async changeEmail(updatedEmail: string, userPassword): Promise<Response> {
    const response = new Response();

    if (!updatedEmail) {
      response.error('Email cannot be empty');
      return response;
    }

    const user = await this.fireAuth.currentUser;
    const reauth = await this.reauthenticateUser(user.email, userPassword);
    if (!reauth.successful) {
      response.error('Your account could not be reauthenticated. Make sure you\'ve entered the correct password.');
      return response;
    }
    try {
      // SUCCESS
      await user.updateEmail(updatedEmail);
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          response.error('The email address you provided is invalid, please try again');
          break;
        case 'auth/email-already-in-use':
          response.error('The email address you provided is already in-use, please try a different address');
          break;
        default:
          console.error('AuthWrapper: unexpected forgotPassword error:', error);
          response.error('An unexpected error occured, please try again');
          break;
      }
    }

    return response;
  }

  async reauthenticateUser(email: string, password: string) {
    const response = new Response();

    try {
      // SUCCESS
      const user = await this.fireAuth.currentUser;
      const credentials = firebase.auth.EmailAuthProvider.credential(email, password);
      const result = await user.reauthenticateWithCredential(credentials);
    } catch(error) {
      switch (error.code) {
        case 'auth/user-mismatch':
        case 'auth/wrong-password':
          response.error('The old password provided is incorrect.\nPlease try again.');
          break;
        case 'auth/invalid-credential':
        case 'auth/invalid-email':
          response.error('The email address provided is invalid, make sure you provide a valid email address');
          break;
        case 'auth/user-not-found':
          response.error('A user account with the email address you provided does not exist.');
          console.error('AuthError: changePassword user not found, this should not happen.', error);
          break;
        default:
          console.error('AuthWrapper: unexpected reauthenticateUser error:', error);
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
