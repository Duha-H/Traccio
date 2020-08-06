export class Notification {

  message: string;
  type: 'standard' | 'success' | 'error';
  constructor(message?: string, type?: 'standard' | 'success' | 'error') {
    this.message = message ? message : '';
    this.type = type ? type : 'standard';
  }

}
