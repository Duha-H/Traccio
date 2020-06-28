import { Pipe, PipeTransform } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { Application } from 'src/app/models/application';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {

  transform(items: Journey[] | Application[], type: 'journey' | 'application', query: string): Journey[] | Application[] {
    if (!items || !type) {
      return items;
    } else if (!query) {
      return [];
    }
    if (typeof query === 'string') {
      query = query.toLowerCase();
    }
    if (type === 'journey') {
      return (items as Journey[]).filter(journey => journey.title.toLowerCase().indexOf(query) !== -1);
    } else if (type === 'application') {
      return (items as Application[]).filter(app => {
        return app.companyName.toLowerCase().indexOf(query) !== -1
          || app.positionTitle.toLowerCase().indexOf(query) !== -1;
      });
    }
    return items;
  }

}
