import * as bcrypt from 'bcrypt';
import { randomID } from './random-id';

export function testUser(password: string) {
  return {
    _id: randomID(),
    name: 'Test User',
    hash: bcrypt.hashSync(password, 8),
    progress: [1, 2, 3, 4],
  };
}
