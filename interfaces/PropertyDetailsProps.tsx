export interface Address {
  id: string;
  street_1: string;
  street_2: string;
  street_3: string;
  city: string;
  province: string;
  region: string;
  country: string;
}
export interface Coordinates {
  id: string;
  latitude: any;
  longitude: any;
}

export interface PropertyDetails {
  id: string;
  description: string;
  inclusion: string;
  landlord: string;
  landlord_fullname: string;
  landlord_contactnumber: string;
  number_of_vacant_male: number;
  number_of_vacant_female: number;
  rent: any;
  type: string;
  image: any;
  owner: string;
  owner_fullname: string;
  owner_image: any;
  timestamp: string;
  is_available: boolean;
  is_saved: boolean;
  address: Address;
  coordinates: Coordinates;
}
