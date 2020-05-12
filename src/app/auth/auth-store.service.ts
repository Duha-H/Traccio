import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {

  email = '';
  id = '';
  firstName = '';
  lastName = '';

  constructor() { }

  setEmail(email: string) {
    this.email = email;
    console.log(this.email);
  }

  setUserDetails(firstName: string, lastName: string, email: string, id: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.id = id;
  }
}
