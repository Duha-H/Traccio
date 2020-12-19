import { Pipe, PipeTransform } from '@angular/core';
import { Journey } from 'src/app/models/journey';
import { Application } from 'src/app/models/application';

@Pipe({
  name: 'concat'
})
export class ConcatPipe implements PipeTransform {

  transform(items: Journey[]): Application[] {
    if (!items) {
      return [];
    }
    const apps: Application[] = [];
    items.map(journey => {
      apps.push(...journey.applications);
    });
    return apps;
  }

}
