export interface SignupDataProps {
  first_name: string;
  last_name: string;
  gender: string;
  contact_number: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export interface SigninDataProps {
  username: string;
  password: string;
}

export interface ActivationProps {
  uid: string;
  token: string;
}

export interface UserInfoProps {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  contact_number: string;
  email: string;
  username: string;
  image: any;
  preferred_area: string;
}
