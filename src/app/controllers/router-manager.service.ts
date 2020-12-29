import { Injectable } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterManagerService {


  constructor(private router: Router, private route: ActivatedRoute, private authGuard: AngularFireAuthGuard) { }

  /**
   * Returns the parent url of the current route ${level} levels up
   * e.g. '/demo/home/journeys', 1 level up => '/demo/home'
   * e.g. '/demo/home/journeys', 2 levels up => '/demo'
   */
  getParentRoute(level?: number): string {
    // const level = inputLevel === undefined ? 1 : inputLevel;
    const routeSegments = this._getRouteSegments();
    const n = level === undefined ? -1 : -level;
    const parentRoute = `/${routeSegments.slice(0, n).join('/')}`;

    return parentRoute;
  }

  /**
   * Returns the current url stripped of any parameters, queryParams, or data
   */
  getPlainRoute(): string {
    const routeSegments = this._getRouteSegments();
    return `/${routeSegments.join('/')}`;
  }


  /**
   * Returns application root url
   */
  getRootUrl(): string {
    const routeSegments = this._getRouteSegments();
    if (routeSegments[0] === 'demo') {
      return '/demo/home';
    } else {
      return '/home';
    }
  }

  private _getRouteSegments(): string[] {
    const routeSegments =
      this.router.parseUrl(this.router.url).root.children.primary.segments;
    const routes = routeSegments.map(segment => segment.path);
    return routes;
  }
}
