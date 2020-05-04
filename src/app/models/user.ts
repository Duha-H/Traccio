export class User {

	private _firstName = '';
	private _lastName = '';
	private _userid = '';

  constructor(userparams?: { [key: string]: any }) {
		if (userparams) {
			this._firstName = userparams.firstName;
			this._lastName = userparams.lastName;
			this._userid = userparams.id;
		}
	}

	get firstName() { return this._firstName; }
	set firstName(name: string) { this._firstName = name; }

	get lastName() { return this._lastName; }
	set lastName(name: string) { this._lastName = name; }

	get userid() { return this._userid; }
	set userid(id: string) { this._userid = id; }
}
