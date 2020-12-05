import { NgModule } from '@angular/core';
import { ViewsSharedModule } from 'src/app/views-shared.module';
import { WishlistComponent } from './wishlist.component';
import { WishlistRoutingModule } from './wishlist-routing.module';
import { BaseSharedModule } from 'src/app/base-shared.module';

@NgModule({
  declarations: [
    WishlistComponent,
  ],
  imports: [
    BaseSharedModule,
    ViewsSharedModule,
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
