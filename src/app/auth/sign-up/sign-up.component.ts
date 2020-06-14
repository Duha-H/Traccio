import { Component, OnInit } from "@angular/core";
import { Auth } from "aws-amplify";
import { Router } from "@angular/router";
import { AuthStoreService } from "../../controllers/auth-store.service";
import { UserStoreService } from "src/app/models/user-store.service";
import { AuthWrapperService } from '../auth-wrapper.service';

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  firstName = "";
  lastName = "";
  email = "";
  password = "";
  confirmPassword = "";
  error = "";

  constructor(
    private router: Router,
    private authStore: AuthStoreService,
    private userStore: UserStoreService,
    private authWrapper: AuthWrapperService,
  ) {}

  ngOnInit() {
    console.log("sign up init");
  }

  async signUp() {
    // check for empty fields
    // if (
    //   this.firstName.length === 0 ||
    //   this.lastName.length === 0 ||
    //   this.email.length === 0 ||
    //   this.password.length === 0 ||
    //   this.confirmPassword.length === 0
    // ) {
    //   this.error = 'All fields are required and must be filled in';
    //   return;
    // } else if (this.password !== this.confirmPassword) {
    //   this.error = 'Looks like your passwords don\'t match.\nRe-enter to make sure they match.';
    //   return;
    // }

    // try {
    //   const user = await Auth.signUp({
    //     username: this.email,
    //     password: this.password,
    //     attributes: {
    //       email: this.email,
    //       given_name: this.firstName,
    //       family_name: this.lastName,
    //     },
    //   });
    //   console.log("user:", { user });
    //   console.log("signup successful");
    //   this.authStore.setUserDetails(
    //     this.firstName,
    //     this.lastName,
    //     this.email,
    //     user.userSub
    //   );
    //   this.router.navigate(["confirmsignup"]);
    // } catch (error) {
    //   console.log("Error signing up:", error);
    //   this.error = error.message;
    // }
    const response = await this.authWrapper.signUp(this.firstName, this.lastName, this.email, this.password, this.confirmPassword);
    if (response.successful && response.payload) {
      const user = response.payload;
      this.userStore.setUser(this.firstName, this.lastName, this.email, user.userSub, user.userConfirmed);
      this.router.navigate(['confirmsignup']);
    } else {
      this.error = response.message;
    }
  }
}
