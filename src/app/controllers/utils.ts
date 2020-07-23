/**
 * Shared utility functions
 */

 /**
  * Returns a string representation of the date,
  * basically using it so I can control the date string format throughout the whole application
  * and avoid any discrepencies caused by Date string representations
  * (month 0-indexing, time-zone effect on dates, etc)
  * @param date Date object to retreive as string
  */
export function getDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}


/**
 * Returns true if date1 and date2 are equal (i.e. have the same date, month, and year)
 * @param date1 first date to be compared
 * @param date2 second date to be compared
 */
export function datesEqual(date1: Date, date2: Date): boolean {
  if (
    date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCFullYear() === date2.getUTCFullYear()
  ) {
    return true;
  } else {
    return false;
  }
}