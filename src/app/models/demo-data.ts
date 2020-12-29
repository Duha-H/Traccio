import { User } from "./user";

export const DEMO_USER = new User({
  firstName: 'Amos',
  lastName: 'Burton',
  id: '42',
  email: 'aburton@purnkleen.co',
  email_verified: true,
  identityProvider: 'DEFAULT'
});
