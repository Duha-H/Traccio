import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { WishlistComponent } from './wishlist.component';
import { WishlistRoutingModule } from './wishlist-routing.module';

@NgModule({
  declarations: [
    WishlistComponent,
  ],
  imports: [
    SharedModule,
    WishlistRoutingModule,
    // MatGridListModule,
    // MatCheckboxModule,
    // MatTableModule,
    // MatSortModule,
  ],
  providers: [ ],
  exports: []
})
export class WishlistModule { }
