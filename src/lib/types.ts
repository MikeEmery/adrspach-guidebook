export type Database = {
  public: {
    Tables: {
      walls: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order: number;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          description?: string | null;
        };
      };
      routes: {
        Row: {
          id: string;
          wall_id: string;
          number: string;
          name: string;
          grade_yds: string | null;
          grade_french: string | null;
          height_ft: number | null;
          protection: string | null;
          first_ascent: string | null;
          description: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          wall_id: string;
          number: string;
          name: string;
          grade_yds?: string | null;
          grade_french?: string | null;
          height_ft?: number | null;
          protection?: string | null;
          first_ascent?: string | null;
          description?: string | null;
          sort_order: number;
        };
        Update: {
          id?: string;
          wall_id?: string;
          number?: string;
          name?: string;
          grade_yds?: string | null;
          grade_french?: string | null;
          height_ft?: number | null;
          protection?: string | null;
          first_ascent?: string | null;
          description?: string | null;
          sort_order?: number;
        };
      };
      wall_images: {
        Row: {
          id: string;
          wall_id: string;
          image_url: string;
          image_type: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          wall_id: string;
          image_url: string;
          image_type: string;
          sort_order: number;
        };
        Update: {
          id?: string;
          wall_id?: string;
          image_url?: string;
          image_type?: string;
          sort_order?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
        };
      };
      ticks: {
        Row: {
          id: string;
          user_id: string;
          route_id: string;
          ticked_at: string;
          style: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          route_id: string;
          ticked_at: string;
          style?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          route_id?: string;
          ticked_at?: string;
          style?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          route_id: string;
          body: string;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          route_id: string;
          body: string;
          rating?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          route_id?: string;
          body?: string;
          rating?: number | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Convenience types
export type Wall = Database["public"]["Tables"]["walls"]["Row"];
export type Route = Database["public"]["Tables"]["routes"]["Row"];
export type WallImage = Database["public"]["Tables"]["wall_images"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Tick = Database["public"]["Tables"]["ticks"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export type RouteWithWall = Route & { walls: Wall };
export type CommentWithProfile = Comment & { profiles: Profile };
