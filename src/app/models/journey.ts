import { Application } from './application';
// Object representation of a Journey
export class Journey {

	private _title = '';
	private _id = 0;
	private _startDate: number[] = [];
	private _endDate: number[] = [];
	private _active = true;
	private _applications: Application[] = [];

	constructor(data?: { [key: string]: any }) {
		// construct object from provided journey JSON
		if (data) {
			const x = 1;
			this._title = data.title;
			this._id = data.id;
			this._startDate = data.startDate; // parse date string, ISO_8601 format -> milliseconds -> Date
			this._endDate = data.endDate
				? data.endDate
				: []; // parse date string, ISO_8601 format -> milliseconds -> Date
			this._active = data.active;
			this._applications = data.apps
				? data.apps // TODO: fix this
				: [];
		}
	}

	get title() { return this._title; }
	set title(title: string) { this._title = title; }

	get id() { return this._id; }
	set id(id: number) { this._id = id; }

	get startDate() { return this._startDate; }
	set startDate(date: number[]) { this._startDate = date; }

	get endDate() { return this._endDate; }
	set endDate(date: number[]) { this._endDate = date; }

	get applications() { return this._applications; }
	set applications(apps: Application[]) { this._applications = apps; }

	get active() { return this._active; }
	set active(active: boolean) { this._active = active; }

	toggleActive(active: boolean) {
		this._active = active;
		if (!this._active) {
			const today = new Date();
			this._endDate = [today.getDate(), today.getMonth(), today.getFullYear()]; // now
			// update database
		}
	}

	addApplication(newApp: Application) {
		this._applications.push(newApp);
		// update database
	}


}
