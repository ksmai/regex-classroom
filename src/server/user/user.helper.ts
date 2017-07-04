export function toObject(user: any): any {
  const userObj = user.toObject();
  delete userObj.hash;
  return userObj;
}

export function assertUser(errorMessage: string): any {
  return (user: any) => {
    if (!user) {
      throw new Error(errorMessage);
    }

    return user;
  };
}

/* tslint:disable:no-bitwise */
// https://stackoverflow.com/questions/109023/how-to-count-the-number-of-set-bits-in-a-32-bit-integer/109025#109025
export function totalBits(n: number): number {
  n = n - ((n >>> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  return (((n + (n >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
}
