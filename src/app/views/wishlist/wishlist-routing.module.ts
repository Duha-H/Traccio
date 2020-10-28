import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Views
import { ApplicationViewComponent } from 'src/app/shared-components/application-view/application-view.component';
import { NewApplicationViewComponent } from 'src/app/shared-components/application-view/new-application-view.component';
import { WishlistApplicationViewComponent } from 'src/app/shared-components/application-view/wishlist-application-view.component';
import { WishlistComponent } from './wishlist.component';

const routes: Routes = [
  { path: "", component: WishlistComponent, },
  { path: "new-app", component: NewApplicationViewComponent },
  { path: ":appref", component: WishlistApplicationViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistRoutingModule { }
