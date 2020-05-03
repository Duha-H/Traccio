import { STATUS, APP_SOURCE } from './constants';

export class Application {

	companyName = '';
	positionTitle = '';
	appDate = new Date();
	status = STATUS.IN_REVIEW;
	source = APP_SOURCE.JOB_BOARD;
	notes = '';

	constructor(data?: { [key: string]: any }) {
		if (data) {
			this.companyName = data.company;
			this.positionTitle = data.title;
			this.appDate = new Date(Date.parse(data.date));
		}
	}
}
