export type UserRole = 'model' | 'client' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface ModelDetails {
  profile_id: string;
  height?: number | null;
  weight?: number | null;
  bust?: number | null;
  waist?: number | null;
  hips?: number | null;
  shoe_size?: number | null;
  hair_color?: string | null;
  eye_color?: string | null;
  ethnicity?: string | null;
  languages: string[];
  categories: string[];
  tattoos: boolean;
  piercings: boolean;
  bio?: string | null;
}

export interface ClientDetails {
  profile_id: string;
  company_name: string;
  industry?: string | null;
  verified: boolean;
}

export type BookingStatus = 'requested' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  model_id: string;
  client_id: string;
  status: BookingStatus;
  date: string;
  location: string;
  project_type?: string | null;
  brief?: string | null;
  budget?: number | null;
  usage_rights?: string | null;
  created_at: string;
}
