// Object representation of a Journey
export class Journey {

	title = '';
	id = '';
	startDate = new Date();
	endDate: Date = null;
	active = true;
	applications = [];

	constructor(data?: { [key: string]: any }) {
		// construct object from provided journey JSON
		if (data) {
			const x = 1;
			this.title = data.title;
			this.id = data.id;
			this.startDate = new Date(Date.parse(data.startDate)); // parse date string, ISO_8601 format -> milliseconds -> Date
			this.endDate = data.endDate
				? new Date(Date.parse(data.startDate))
				: null; // parse date string, ISO_8601 format -> milliseconds -> Date
			this.active = data.active;
			this.applications = data.apps
				? data.apps
				: [];
		}
	}

	setTitle(title: string) { this.title = title; }

	setID(id: string) { this.id = id; }

	setStartDate(date: string) { this.startDate = new Date(Date.parse(date)); }

	setEndDate(date: string) { this.endDate = new Date(Date.parse(date)); }

	setApplications(apps: []) { this.applications = apps; }

	toggleActive(active: boolean) {
		this.active = active;
		if (!this.active) {
			this.endDate = new Date(); // now
			// update database
		}
	}

	addApplication(newApp: {}) {
		this.applications.push(newApp);
		// update database
	}


}
