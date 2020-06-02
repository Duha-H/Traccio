import { STATUS, APP_SOURCE } from './constants';

export interface ApplicationInput {
	id: number | string;
	company: string;
	title: string;
	date: string | Date;
	status: string;
	source: string;
	notes: string;
}

export class Application {

	private _id = 0;
	private _companyName = '';
	private _positionTitle = '';
	private _appDate: Date = new Date();
	private _status = STATUS.IN_REVIEW.toString();
	private _source = APP_SOURCE.JOB_BOARD.toString();
	private _notes = '';

	constructor(data?: ApplicationInput) {
		if (data) {
			this._id = typeof(data.id) === 'string'
				? parseInt(data.id)
				: data.id;
			this._companyName = data.company;
			this._positionTitle = data.title;
			this._appDate = new Date(data.date);
			// this._appDate = data.date;
			this._status = data.status;
			this._source = data.source;
			this._notes = data.notes;
		}
	}

	get id() { return this._id; }
	set id(id: number) { this._id = id; }

	get companyName() { return this._companyName; }
	set companyName(name: string) { this._companyName = name; }

	get positionTitle() { return this._positionTitle; }
	set positionTitle(name: string) { this._positionTitle = name; }

	get appDate(): Date { return this._appDate; }
	set appDate(date: Date) { this._appDate = date; }

	get status() { return this._status; }
	set status(status: string) { this._status = status; }

	get source() { return this._source; }
	set source(source: string) { this._source = source; }

	get notes() { return this._notes; }
	set notes(notes: string) { this._notes = notes; }

	getGraphQLInput() {
		const input = {
			id: this._id,
			company: this._companyName,
			title: this._positionTitle,
			date: this._appDate.toISOString().split('T')[0], // "YYYY-MM-DD"
			status: this._status,
			source: this._source,
			notes: this._notes
		}
		return input;
	}
}
