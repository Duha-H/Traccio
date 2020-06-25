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
    if (filters.map(filter => filter.value).join('') === '') { // no filter values specified
      return true;
    }
    // filtering is disjunctive within a specific property (OR-ing)
    // but conjunctive across properties (AND-ing)
    const match: boolean[] = [];
    filters.forEach(filter => {
      if (
        (filter.value !== '' && filter.value.includes(item[filter.property])) ||
        filter.value === ''
      ) {
        match.push(true);
      } else {
        match.push(false);
      }
    });
    return match.every((value) => value); // true if every value is true
  }
}
