export interface AppFrequencyDatum {
  // week days are 0-indexed (0 - 6 -> 'Sun' - 'Sat')
  week: { [key: number]: { x: string | number; y: number, label?: Date | string } };
  // month days are 1-indexed (1- 30 or 1 - 31 depending on the month)
  month: { [key: number]: { x: string | number; y: number, label?: Date | string } };
  // year months are 1 - indexed (1 - 12 -> 'Jan' - 'Dec')
  year: { [key: number]: { x: string | number; y: number, label?: Date | string } };
}

export interface FormattedFrequencyData {
  week: LineChartDatum[];
  month: LineChartDatum[];
  year: LineChartDatum[];
}

export interface LineChartDatum {
  id: string;
  data: { x: string; y: number, label?: Date | string }[];
  color?: string;
}

export const WEEKDAYS = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat'
};

export const MONTHS = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};
