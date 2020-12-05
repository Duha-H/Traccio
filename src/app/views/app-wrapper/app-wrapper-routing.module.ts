import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseSharedModule } from 'src/app/base-shared.module';
import { InfoComponent } from '../info/info.component';
import { SettingsComponent } from '../settings/settings.component';
import { AppWrapperComponent } from './app-wrapper.component';


const routes: Routes = [
  {
    path: "",
    component: AppWrapperComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("src/app/views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "journeys",
        loadChildren: () =>
          import("src/app/views/journeys/journeys.module").then(
            (m) => m.JourneysModule
          ),
      },
      {
        path: "wishlist",
        loadChildren: () =>
          import("src/app/views/wishlist/wishlist.module").then(
            (m) => m.WishlistModule
          ),
      },
      { path: "settings", component: SettingsComponent },
      { path: "info", component: InfoComponent },
      { path: "**", redirectTo: "" },
    ],
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    BaseSharedModule,
  ],
  exports: [RouterModule],
})
export class AppWrapperRoutingModule { }
