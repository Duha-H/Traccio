import { Application } from './application';
// Object representation of a Journey
export class Journey {

	private _title = '';
	private _id = '';
	private _startDate: Date = new Date();
	private _endDate: Date = new Date();
	private _active = true;
	private _applications: Application[] = [];

	constructor(data?: { [key: string]: any }) {
		// construct object from provided journey JSON
		if (data) {
			const x = 1;
			this._title = data.title;
			this._id = data.id;
			this._startDate = new Date(data.startDate); // parse date string, ISO_8601 format -> milliseconds -> Date
			this._endDate = data.endDate
				? new Date(data.endDate)
				: undefined; // parse date string, ISO_8601 format -> milliseconds -> Date
			this._active = data.active;
			this._applications = data.applications
				? data.applications
				: [];
		}
	}

	get title() { return this._title; }
	set title(title: string) { this._title = title; }

	get id() { return this._id; }
	set id(id: string) { this._id = id; }

	get startDate(): Date { return this._startDate; }
	set startDate(date: Date) { this._startDate = date; }

	get endDate(): Date { return this._endDate; }
	set endDate(date: Date) { this._endDate = date; }

	get applications() { return this._applications; }
	set applications(apps: Application[]) { this._applications = apps; }

	get active() { return this._active; }
	set active(active: boolean) { this._active = active; }

	toggleActive(active: boolean) {
		this._active = active;
		if (!this._active) {
			this._endDate = new Date();
			// this._endDate = [today.getDate(), today.getMonth(), today.getFullYear()]; // now
			// update database
		}
	}

	addApplication(newApp: Application) {
		this._applications.push(newApp);
		// update database
	}

	getGraphQLInput() {
		// format null-able values
		const endDateFormatted = this._endDate.toISOString().split('T')[0]; // ISO String format: YYYY-MM-DDTHH:mm:ss.sssZ
																																				// or ±YYYYYY-MM-DDTHH:mm:ss.sssZ
		const applicationsFormatted = this._applications.map(app => app.getGraphQLInput());

		const input = {
			id: this._id,
			title: this._title,
			startDate: `${this._startDate[2]}-${this._startDate[1]}-${this._startDate[0]}`, // "YYYY-MM-DD"
			endDate: endDateFormatted,
			active: this._active,
			applications: applicationsFormatted
		};
		return input;
	}
	

}
