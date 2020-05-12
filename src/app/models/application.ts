import { STATUS, APP_SOURCE } from './constants';

export class Application {

	private _id = 0;
	private _companyName = '';
	private _positionTitle = '';
	private _appDate: number[] = [];
	private _status = STATUS.IN_REVIEW.toString();
	private _source = APP_SOURCE.JOB_BOARD.toString();
	private _notes = '';

	constructor(data?: { [key: string]: any }) {
		if (data) {
			this._id = data.id;
			this._companyName = data.company;
			this._positionTitle = data.title;
			this._appDate = data.date;
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

	get appDate() { return this._appDate; }
	set appDate(date: number[]) { this._appDate = date; }

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
			date: `${this._appDate[2]}-${this._appDate[1]}-${this._appDate[0]}`, // "YYYY-MM-DD"
			status: this._status,
			source: this._source,
			notes: this._notes
		}
		return input;
	}
}
