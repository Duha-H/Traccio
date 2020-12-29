import { UserInput } from "./types";

export class User {

	private _firstName = '';
	private _lastName = '';
	private _userid = '';
	private _email = '';
	private _verified = false;
	private _identityProvider: 'DEFAULT' | 'GOOGLE' = 'DEFAULT';
	private _theme: 'light' | 'dark' = 'light';
	private _palette: 'palette-0' | 'palette-1' | 'palette-2' | 'palette-3'
		= 'palette-0';
	private _journeyInactive = 90;
	private _appStale = 90;

  constructor(userparams?: UserInput) {
		if (userparams) {
			this._firstName = userparams.firstName;
			this._lastName = userparams.lastName;
			this._userid = userparams.id;
			this._email = userparams.email;
			this._verified = userparams.email_verified;
			if (userparams.identityProvider) {
				this._identityProvider = userparams.identityProvider;
			}
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

	get identityProvider() { return this._identityProvider; }
	set identityProvider(provider: 'DEFAULT' | 'GOOGLE') { this._identityProvider = provider; }

	get theme() { return this._theme; }
	set theme(theme: 'light' | 'dark') { this._theme = theme; }

	get palette() { return this._palette; }
	set palette(palette: 'palette-0' | 'palette-1' | 'palette-2' | 'palette-3') { this._palette = palette; }

	get journeyInactive() { return this._journeyInactive; }
	set journeyInactive(value: number) { this._journeyInactive = value; }

	get appStale() { return this._appStale; }
	set appStale(value: number) { this._appStale = value; }

	isDefined() {
		return (this._firstName && this._lastName && this._userid);
	}

	isVerified() {
		return this._verified;
	}

	getGraphQLInput(): { [key: string]: any } {
		const input = {
			id: this._userid,
			firstName: this._firstName,
			lastName: this._lastName
		};
		return input;
	}
}
