import { Pipe, PipeTransform } from '@angular/core';
import { Application } from 'src/app/models/application';

@Pipe({
  name: 'appFilter'
})
export class AppFilterPipe implements PipeTransform {

  transform(apps: Application[], property: string, value: any): Application[] {
    if (apps.length === 0 || !apps || !property || !value || value === '') {
      return apps;
    }
    return apps.filter(item => item[property] === value);
  }

}
