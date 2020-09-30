/**
 * Exports and data types used by models
 */

export interface ApplicationInput {
	id: string;
	company: string;
	title: string;
	date: string | Date;
	status: string;
	source: string;
	notes: string;
	timeline?: TimelineDatum[] | { status: string, date: string }[];
}

export interface TimelineDatum {
  status: string;
  date: Date;
}

export interface JourneyInput {
	title: string;
	id: string;
	startDate: string;
	endDate?: string | undefined;
	active: boolean;
	applications: { [key: string]: ApplicationInput };
}

export interface UserInput {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	verified: boolean;
	wishlist?: { [key: string]: ApplicationInput };
}
