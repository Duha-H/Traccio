import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'values'
})
export class ValuesPipe implements PipeTransform {

  transform(items: {[key: string]: any}): any[] {
    return Object.values(items);
  }

}
