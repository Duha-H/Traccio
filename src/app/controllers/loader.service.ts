import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // loading toggle to use when making API calls
  private _loading = new BehaviorSubject<boolean>(false);
  loading = this._loading.asObservable();

  constructor() { }

  setLoadingState(state: boolean) {
    this._loading.next(state);
  }

}
