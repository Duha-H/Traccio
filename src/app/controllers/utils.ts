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
