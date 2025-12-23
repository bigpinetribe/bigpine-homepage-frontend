// Database types for Supabase

export type UserRole = "admin" | "staff" | "member" | "guest";

export interface UserProfile {
  id: string; // UUID from auth.users
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  enrollment_number: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserProfile, "id">>;
      };
    };
  };
}
