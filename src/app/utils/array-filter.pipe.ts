import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "arrayFilter",
})
export class ArrayFilterPipe implements PipeTransform {
  transform(list: number[], mode?: 'max' | 'min' | 'count') {
    if (!list || list.length === 0) {
      return list;
    }

    if (!mode || mode === 'max') {
      return Math.max(...list);
    } else if (mode === 'min') {
      return Math.min(...list);
    } else if (mode === 'count') {
      return list.reduce((accumulator, currValue) => {
        return accumulator + currValue;
      });
    }
  }
}
