export interface iUserIn {
  username: string;
  password: string;
}

export interface iUserOut {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}
