export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'super_admin' | 'admin' | 'delivery' | 'client'
export type ProjectStatus = 'discovery' | 'active' | 'paused' | 'complete' | 'cancelled'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ActivityType = 'project' | 'task' | 'meeting' | 'payment' | 'invoice' | 'comment' | 'file' | 'assignment'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          client_name: string
          client_email: string | null
          client_user_id: string | null
          status: ProjectStatus
          progress: number
          due_date: string | null
          started_at: string | null
          completed_at: string | null
          value_total: number | null
          value_paid: number | null
          margin_percent: number | null
          notes_internal: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          client_name: string
          client_email?: string | null
          client_user_id?: string | null
          status?: ProjectStatus
          progress?: number
          due_date?: string | null
          started_at?: string | null
          completed_at?: string | null
          value_total?: number | null
          value_paid?: number | null
          margin_percent?: number | null
          notes_internal?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          client_name?: string
          client_email?: string | null
          client_user_id?: string | null
          status?: ProjectStatus
          progress?: number
          due_date?: string | null
          started_at?: string | null
          completed_at?: string | null
          value_total?: number | null
          value_paid?: number | null
          margin_percent?: number | null
          notes_internal?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_assignments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string | null
          assigned_at: string
          assigned_by: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: string | null
          assigned_at?: string
          assigned_by?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: string | null
          assigned_at?: string
          assigned_by?: string | null
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          due_date: string | null
          completed_at: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          due_date?: string | null
          completed_at?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          completed_at?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          milestone_id: string | null
          title: string
          description: string | null
          status: TaskStatus
          priority: TaskPriority
          assignee_id: string | null
          due_date: string | null
          completed_at: string | null
          sort_order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          milestone_id?: string | null
          title: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          assignee_id?: string | null
          due_date?: string | null
          completed_at?: string | null
          sort_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          milestone_id?: string | null
          title?: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          assignee_id?: string | null
          due_date?: string | null
          completed_at?: string | null
          sort_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kb_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          sort_order: number
          is_internal: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_internal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_internal?: boolean
          created_at?: string
        }
      }
      kb_articles: {
        Row: {
          id: string
          category_id: string | null
          title: string
          slug: string
          content: string
          excerpt: string | null
          is_published: boolean
          is_internal: boolean
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          slug: string
          content: string
          excerpt?: string | null
          is_published?: boolean
          is_internal?: boolean
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          is_published?: boolean
          is_internal?: boolean
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          project_id: string | null
          user_id: string | null
          type: ActivityType
          title: string
          description: string | null
          metadata: Json
          is_internal: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          type: ActivityType
          title: string
          description?: string | null
          metadata?: Json
          is_internal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          type?: ActivityType
          title?: string
          description?: string | null
          metadata?: Json
          is_internal?: boolean
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          project_id: string | null
          name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          uploaded_by: string | null
          folder: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          folder?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          folder?: string | null
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          project_id: string
          title: string
          date: string
          attendees: string[] | null
          notes: string | null
          action_items: string[] | null
          recorded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          date: string
          attendees?: string[] | null
          notes?: string | null
          action_items?: string[] | null
          recorded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          date?: string
          attendees?: string[] | null
          notes?: string | null
          action_items?: string[] | null
          recorded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          project_id: string | null
          task_id: string | null
          user_id: string
          content: string
          is_internal: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          task_id?: string | null
          user_id: string
          content: string
          is_internal?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          task_id?: string | null
          user_id?: string
          content?: string
          is_internal?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: UserRole
      }
      is_assigned_to_project: {
        Args: { user_id: string; proj_id: string }
        Returns: boolean
      }
      is_project_client: {
        Args: { user_id: string; proj_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      project_status: ProjectStatus
      task_status: TaskStatus
      task_priority: TaskPriority
      activity_type: ActivityType
    }
  }
}
