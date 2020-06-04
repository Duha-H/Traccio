import { Pipe, PipeTransform } from "@angular/core";
import { Application } from "src/app/models/application";

@Pipe({
  name: "appFilter",
})
export class AppFilterPipe implements PipeTransform {
  transform(
    apps: Application[],
    filters: {
      property: string;
      value: string;
    }[]
  ): Application[] {
    if (apps.length === 0 || !apps || !filters || filters.length === 0) {
      return apps;
    }
    return apps.filter((item) => this._matches(item, filters));
  }

  private _matches(
    item: Application,
    filters: {
      property: string;
      value: string;
    }[]
  ): boolean {
    let match = false;
    filters.forEach(filter => {
      // if (filter.value !== '' && !filter.value.includes(item[filter.property])) {
      //   match = false;
      //   return;
      // }
      if (filter.value !== '' && filter.value.includes(item[filter.property])) {
        match = true;
        return;
      }
    });
    return match;
  }
}
