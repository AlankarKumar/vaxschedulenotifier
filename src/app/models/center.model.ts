export interface RootObject {
  centers: Center[];
}

export interface Center {
  center_id: number;
  name: string;
  name_l: string;
  address: string;
  address_l: string;
  state_name: string;
  state_name_l: string;
  district_name: string;
  district_name_l: string;
  block_name: string;
  block_name_l: string;
  pincode: string;
  lat: number;
  long: number;
  from: string;
  to: string;
  fee_type: string;
  vaccine_fees: Vaccinefee[];
  sessions: Session[];
}

export interface Session {
  session_id: string;
  date: string;
  available_capacity: number;
  available_capacity_dose1: number;
  available_capacity_dose2: number;
  min_age_limit: number;
  vaccine: string;
  slots: string[];
}

export interface Vaccinefee {
  vaccine: string;
  fee: string;
}

export interface States {
  states: State[];
  ttl: number;
}

export interface State {
  state_id: number;
  state_name: string;
}

export interface Districts {
  districts: District[];
  ttl: number;
}

export interface District {
  state_id: number;
  district_id: number;
  district_name: string;
  district_name_l: string;
}
