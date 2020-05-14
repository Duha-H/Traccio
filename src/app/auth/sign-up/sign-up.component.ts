import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { AuthStoreService } from '../../controllers/auth-store.service';
import { UserStoreService } from 'src/app/models/user-store.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router, private authStore: AuthStoreService, private userStore: UserStoreService) { }

  ngOnInit() {
  }

  async signUp() {
    try {
      console.log(this.firstName, this.lastName, this.email);
      const user = await Auth.signUp({
        username: this.email,
        password: this.password,
        attributes: {
          email: this.email,
          given_name: this.firstName,
          family_name: this.lastName,
        }
      });
      console.log("user:", { user });
      console.log("signup successful");
      // this.authStore.setEmail(this.email);
      // const result: {[key: string]: any} = {};
      // user.user.getUserAttributes((err, attribs) => {
      //   // result = {};
      //   console.log(attribs);
      //   attribs.forEach(attrib => {
      //     result[attrib.getName()] = attrib.getValue();
      //   });
      // });
      // console.log(result);
      this.authStore.setUserDetails(this.firstName, this.lastName, this.email, user.userSub);
      this.router.navigate(['confirmsignup']);
    } catch (error) {
      console.log('Error signing up:', error);
    }
  }

}
