export class User {

	private _firstName = '';
	private _lastName = '';
	private _userid = '';
	private _email = '';
	private _verified = false;

  constructor(userparams?: { [key: string]: any }) {
		if (userparams) {
			this._firstName = userparams.firstName;
			this._lastName = userparams.lastName;
			this._userid = userparams.id;
			this._email = userparams.email;
			this._verified = userparams.email_verified;
		}
	}

	get firstName() { return this._firstName; }
	set firstName(name: string) { this._firstName = name; }

	get lastName() { return this._lastName; }
	set lastName(name: string) { this._lastName = name; }

	get userid() { return this._userid; }
	set userid(id: string) { this._userid = id; }

	get email() { return this._email; }
	set email(email: string) { this._email = email; }

	get verified() { return this._verified; }
	set verified(status: boolean) { this._verified = status; }

	isDefined() {
		return (this._firstName && this._lastName && this._userid);
	}

	notVerified() {
		return this._verified;
	}

	getGraphQLInput(): { [key: string]: any } {
		const input = {
			id: this._userid,
			firstName: this._firstName,
			lastName: this._lastName
		}
		return input;
	}
}
