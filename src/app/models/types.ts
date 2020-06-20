/**
 * Exports and data types used by models
 */

export interface ApplicationInput {
	id: number | string;
	company: string;
	title: string;
	date: string | Date;
	status: string;
	source: string;
	notes: string;
}

export interface TimelineDatum {
  status: string;
  date: Date;
}