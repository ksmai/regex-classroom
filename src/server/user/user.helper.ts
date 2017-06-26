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
