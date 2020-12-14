import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "arrayFilter",
})
export class ArrayFilterPipe implements PipeTransform {
  transform(list: number[], mode?: 'max' | 'min' | 'count' | 'average', minVal?: number) {
    if (!list || list.length === 0) {
      return list;
    }

    if (!mode || mode === 'max') {
      return Math.max(...list);
    } else if (mode === 'min') {
      return Math.min(...list);
    } else if (mode === 'count') {
      return this.sum(list);
    } else if (mode === 'average') {
      const count = list.length;
      const total = this.sum(list);
      const average = total / count;
      if (minVal && average < minVal) {
        return '< 1';
      } else {
        return average.toFixed(1);
      }
    }
  }

  sum(list: number[]): number {
    return list.reduce((accumulator, currValue) => {
      return accumulator + currValue;
    });
  }
}
