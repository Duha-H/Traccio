import { Component, Injector } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { Auth } from 'aws-amplify';
import { createCustomElement } from '@angular/elements';
import { RectItemComponent } from './components/rect-item/rect-item.component';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Tracker";
  signedIn: boolean;
  user: any; // I don't like this

  constructor(public amplifyService: AmplifyService, public injector: Injector) {
    this.amplifyService = amplifyService;
    this.amplifyService.authStateChange$.subscribe((authState) => {
      this.signedIn = authState.state === "signedIn";
      if (!authState.user) {
        this.user = null;
      } else {
        this.user = authState.user;
      }
    });

    this.injector = injector;
    const rectItemElement = createCustomElement(RectItemComponent, {injector: this.injector});
    customElements.define('rect-item', rectItemElement);
  }

  ngDoBootstrap() { }

  public isAuthenticated(): boolean {
    return this.signedIn;
  }

  async signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
}
