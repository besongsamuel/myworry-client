export enum Gender
{
  MALE = "Male",
  FEMALE = "Female",
  UNKNOWN = "N/A"
}

export interface ProfileName
{
  familyName: string;
  givenName: string;
  middleName?: string;
}

export class Profile {

  public id: string = "";
  public displayName: string = "";
  public email: string = "";
  public name: ProfileName;
  public profileImage: string = "";
  public profileUrl: string = "";
  public provider: string = "";
  public username: string = "";
  public about: string = "";
  public dob: Date = new Date();
  public interests: string[] = [];
  public gender: Gender = Gender.UNKNOWN;
}

export class UserIdentity {
  public authScheme: string;
  public created: Date;
  public id: string;
  public userId: string;
  public provider: string;
  public profile: Profile;
}
