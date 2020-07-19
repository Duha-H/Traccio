import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStoreService } from "src/app/controllers/auth-store.service";
import { UserStoreService } from "src/app/models/user-store.service";
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';

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

  ngOnInit() {  }

  async signUp() {
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
