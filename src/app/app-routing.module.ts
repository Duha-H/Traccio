import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Guards
import { AngularFireAuthGuard, redirectLoggedInTo } from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path: "",
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['home']) },
    loadChildren: () =>
      import("src/app/views/landing/landing.module").then(
        (m) => m.LandingModule
      ),
  },
  {
    path: "home",
    canActivate: [AngularFireAuthGuard],
    loadChildren: () =>
      import("src/app/views/app-wrapper/app-wrapper.module").then(
        (m) => m.AppWrapperModule
      ),
  },
  { path: "**", redirectTo: "404" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
