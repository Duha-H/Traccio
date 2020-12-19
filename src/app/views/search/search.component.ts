import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { Application } from 'src/app/models/application';
import { UserStoreService } from 'src/app/models/user-store.service';
import { SearchPipe } from './search-pipe.pipe';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Router } from '@angular/router';
import { KeysPipe } from '../../utils/keys.pipe';
import { ResizeService } from 'src/app/controllers/resize.service';
import { ConcatPipe } from 'src/app/utils/concat.pipe';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() query = '';
  @Input() parentSearchSubject: BehaviorSubject<string>;
  @Output() clearEvent = new EventEmitter();

  constructor(
    public userStore: UserStoreService,
    private searchPipe: SearchPipe,
    private router: Router,
    public keys: KeysPipe,
    public rs: ResizeService,
    public concat: ConcatPipe
  ) { }

  ngOnInit() { }

  clear() {
    this.clearEvent.emit();
  }

  viewResult(type: string, item: Journey | Application, journeyid?: string) {
    if (type === 'journey') {
      this.router.navigate(['/home/journeys', item.id]);
    } else if (type === 'application' && journeyid) {
      this.router.navigate(['/home/journeys', journeyid, item.id]);
    } else if (type === 'wishlist') {
      this.router.navigate(['/home/wishlist', item.id]);
    }
    this.clear();
  }

}
