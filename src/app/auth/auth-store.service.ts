import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {

  userEmail = '';

  constructor() { }

  setEmail(email: string) {
    this.userEmail = email;
    console.log(this.userEmail);
  }
}
