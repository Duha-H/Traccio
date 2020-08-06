export class Notification {

  id: number;
  message: string;
  type: 'standard' | 'success' | 'error';

  constructor(id: number, message?: string, type?: 'standard' | 'success' | 'error') {
    this.id = id;
    this.message = message ? message : '';
    this.type = type ? type : 'standard';
  }

}
