import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  email = '';
  password = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }


  async signIn() {
    try {
      const user = await Auth.signIn(this.email, this.password);
      console.log('signed in');
      this.router.navigate(['']);
    } catch (error) {
      console.log('error signing in', error);
    }
  }

}
