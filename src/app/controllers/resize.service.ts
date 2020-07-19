import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  resizeObserver$: Observable<BreakpointState>;
  tabletSizeMatched$: Observable<boolean>;
  breakpoints = {
    BP_TABLET: `(max-width: ${SIZES.TABLET}px)`,
    BP_MOBILE: `(max-width: ${SIZES.MOBILE}px)`,
  };
  tabletSize$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  mobileSize$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      this.breakpoints.BP_TABLET,
      this.breakpoints.BP_MOBILE,
    ]).subscribe(result => {
      if (result.breakpoints[this.breakpoints.BP_TABLET]) {
        this.tabletSize$.next(true);
      } else {
        this.tabletSize$.next(false);
      }
      if (result.breakpoints[this.breakpoints.BP_MOBILE]) {
        this.mobileSize$.next(true);
      } else {
        this.mobileSize$.next(false);
      }
    });
  }
}

export const SIZES = {
  TABLET: 768,
  MOBILE: 500
};
