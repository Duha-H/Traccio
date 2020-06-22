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

