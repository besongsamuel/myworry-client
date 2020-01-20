export enum Gender
{
  MALE = "Male",
  FEMALE = "Female",
  UNKNOWN = "N/A"
}

export class Profile {

  public image: string = "";
  public about: string = "";
  public dob: Date = new Date();
  public interests: string[] = [];
  public gender: Gender = Gender.UNKNOWN;
}
