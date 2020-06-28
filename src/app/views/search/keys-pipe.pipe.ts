import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(items: {[key: string]: any}): any[] {
    return Object.keys(items);
  }

}
