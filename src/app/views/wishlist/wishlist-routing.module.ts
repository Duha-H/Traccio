import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Views
import { ApplicationViewComponent } from 'src/app/shared-components/application-view/application-view.component';
import { WishlistComponent } from './wishlist.component';

const routes: Routes = [
  { path: "", component: WishlistComponent, },
  { path: ":appref", component: ApplicationViewComponent },
  { path: "new-app", component: ApplicationViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistRoutingModule { }
