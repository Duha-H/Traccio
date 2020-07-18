import { STATUS, APP_SOURCE, MONTH_VALS } from './constants';
import { ApplicationInput, TimelineDatum } from './types';
import * as utils from 'src/app/controllers/utils';

export class Application {

	private _id = 0;
	private _companyName = '';
	private _positionTitle = '';
	private _appDate: Date = new Date();
	private _status = STATUS.IN_REVIEW.toString();
	private _timeline: TimelineDatum[] = [
		{ status: this._status, date: this._appDate }
	];
	private _source = APP_SOURCE.JOB_BOARD.toString();
	private _notes = '';

	constructor(data?: ApplicationInput) {
		if (data) {
			this._id = typeof(data.id) === 'string'
				? parseInt(data.id)
				: data.id;
			this._companyName = data.company;
			this._positionTitle = data.title;
			this._appDate = typeof data.date === 'string'
				? this._adjustDateString(data.date)
				: new Date(data.date);
			// this._appDate = data.date;
			this._status = data.status;
			if (data.timeline) {
				this._timeline = this._modifyTimelineData(data.timeline);
			} else {
				this._timeline.push({
					status: this._status,
					date: this._appDate
				});
			}
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
	set status(status: string) {
		this._status = status;
		this._timeline.push({
			status, date: new Date()
		});
	}

	get source() { return this._source; }
	set source(source: string) { this._source = source; }

	get notes() { return this._notes; }
	set notes(notes: string) { this._notes = notes; }

	get timeline() { return this._timeline; }

	getGraphQLInput() {
		const input = {
			id: this._id,
			company: this._companyName,
			title: this._positionTitle,
			date: utils.getDateString(this._appDate), // "YYYY-MM-DD"
			status: this._status,
			source: this._source,
			notes: this._notes
		};
		return input;
	}

	getFilteredString() {
		const result = `${this._companyName}${this._positionTitle}${this._status}${this._source}`;
		return result.toLocaleLowerCase();
	}

	private _modifyTimelineData(data: TimelineDatum[] | { status: string, date: string }[]): TimelineDatum[] {
		const modifiedData: TimelineDatum[] = [];
		data.forEach(item => {
			let storedDate = item.date;
			if (typeof storedDate === 'string') {
				storedDate = new Date(storedDate);
			}
			modifiedData.push({
				status: item.status, date: storedDate
			});
		});
		return modifiedData;
	}

	private _adjustDateString(date: string) {
		const components = date.split('-');
		if (components.length !== 3) {
			console.log('Application: invalid date string:', date);
			return new Date();
		} else {
			// accepts 1-indexed ISO date string (YYYY-MM-DD)
			const updatedDateStr = `${MONTH_VALS[+components[1]]} ${components[2]}, ${components[0]}`;
			return new Date(updatedDateStr);
		}
	}
}
