/**
 * Simple representation of a response object
 * used for consolidating api/auth responses, and providing
 * simpler, cleaner component-facing messages on-error
 */
export class Response {

  private _successful: boolean;
  private _message: string;
  private _payload: any;

  /**
   * Creates a response object
   * Response is successful by default, message is an empty string
   */
  constructor() {
    this._successful = true;
    this._message = '';
    this._payload = null;
  }

  get successful(): boolean { return this._successful; }

  get message(): string { return this._message; }

  get payload(): any { return this._payload; }
  set payload(data: any) { this._payload = data; }

  /**
   * Sets successful to false, and assigns an error message
   * @param message error message to assign
   */
  error(message: string, ...optionalRemainder: string[]) {
    this._successful = false;
    this._message = message + optionalRemainder.join('');
  }

  /**
   * Sets successful to true, and assigns a success message
   * @param message success message to assign
   */
  success(message: string, ...optionalRemainder: string[]) {
    this._successful = true;
    this._message = message + optionalRemainder.join('');
  }

}
