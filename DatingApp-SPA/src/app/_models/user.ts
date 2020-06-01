import { Photo } from './photo';

//Interface complie at run time, and it does not include in javascript bundle
//Userful for Intelligence, AutoMapper
export interface User {
  id: number;
  username: string;
  knownAs: string;
  age: number;
  created: Date;
  lastActive: Date;
  photoUrl: string;
  city: string;
  country: string;
  gender: string;

  // Optional Parameter should come after the required parameters
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
}
