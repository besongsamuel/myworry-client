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

export interface ProfileValue
{
  value: string;
}

export class Profile {

  public id: string = "";
  public displayName: string = "";
  public emails: ProfileValue[] = [];
  public name: ProfileName;
  public photos: ProfileValue[] = [];
  public profileUrl: string = "";
  public provider: string = "";
  public username: string = "";
  public about: string = "";
  public dob: Date = new Date();
  public interests: string[] = [];
  public gender: Gender = Gender.UNKNOWN;
}
