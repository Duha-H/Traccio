import { Pipe, PipeTransform } from "@angular/core";
import { reduce } from 'rxjs/operators';

@Pipe({
  name: "arrayFormatter",
})
export class ArrayFormatterPipe implements PipeTransform {
  /**
   * Returns a formatted version of the input list based on the specified list of formatters
   * @param list input array to format
   * @param formatters list of formatting functions (applied in order)
   * @param reduceCount amount to reduce input array by (if a 'reduce' formatter is specified)
   */
  transform(list: number[], formatters: ('fill' | 'reduce')[], reduceCount?: number) {
    if (!list || list.length === 0 || !formatters || formatters.length === 0) {
      return list;
    }

    let result = list;
    formatters.forEach(formatter => {
      switch (formatter) {
        case 'fill':
          result = this.fillArray(result);
          break;
        case 'reduce':
          result = this.reduceArray(result, reduceCount);
          break;
        default:
          break;
      }
    });
    return result;
  }

  /**
   * Returns a "filled" array of values in the range between the minimum and maximum
   * values in the input list (inclusive)
   * @param list array to return filled version of
   */
  fillArray(list: number[]): number[] {
    const start = Math.min(...list);
    const end = Math.max(...list);
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  /**
   * Returns a reduced array containing every other "reduceCount" value in the input "list"
   * @param list array to return reduced version of
   * @param reduceCount amount to reduce by
   */
  reduceArray(list: number[], reduceCount: number) {
    if (reduceCount === undefined) {
      reduceCount = Math.round(list.length / 6); // extract roughly 6 values atmost
      if (reduceCount === 0) {
        reduceCount = 1;
      }
    }
    const result = list.reduce((accumulator, currentValue, index) => {
      if (index % reduceCount === 0) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
    return result;
  }
}
