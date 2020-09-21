export const STATUS = {
	IN_REVIEW: "In Review",
	INTERVIEW: "Interview",
	ASSESSMENT: "Assessment",
	OFFER: "Offer",
	REJECTED: "Rejected",
	STALE: "Stale/Ghosted",
} as const;

export const APP_SOURCE = {
	JOB_BOARD: 'Job Board',
	COMPANY: 'Company Website/Careers Portal',
	REFERRAL: 'Referral',
	FAIR: 'Career Fair',
	OTHER: 'Other'
} as const;

export const STATUS_COLORS = { // color mappings for statuses
	[STATUS.IN_REVIEW]: '#E76F51',
	[STATUS.ASSESSMENT]: '#F4A261',
	[STATUS.INTERVIEW]: '#E9C46A',
	[STATUS.OFFER]: '#2A9D8F',
	[STATUS.REJECTED]: '#264653',
	[STATUS.STALE]: '#A6A8A8',
};

export const APP_ATTRIBS = {
	ID: 'id',
	POSITION: 'positionTitle',
	COMPANY: 'companyName',
	DATE: 'appDate',
	STATUS: 'status',
	TIMELINE: 'timeline',
	SOURCE: 'source',
	NOTES: 'notes'
};

export const REQUIRED_APP_ATTRIBS = {
	_id: false,
	_positionTitle: true,
	_companyName: true,
	_appDate: true,
	_status: true,
	_timeline: false,
	_source: true,
	_notes: false,
};

export const MONTH_VALS = {
	1: 'January',
	2: 'February',
	3: 'March',
	4: 'April',
	5: 'May',
	6: 'June',
	7: 'July',
	8: 'August',
	9: 'September',
	10: 'October',
	11: 'November',
	12: 'December'
};
