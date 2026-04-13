-- Forge Database Schema
-- Altitude AI Delivery Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'delivery', 'client');
CREATE TYPE project_status AS ENUM ('discovery', 'active', 'paused', 'complete', 'cancelled');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE activity_type AS ENUM ('project', 'task', 'meeting', 'payment', 'invoice', 'comment', 'file', 'assignment');

-- ============================================
-- TABLES
-- ============================================

-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizations (for multi-tenancy if needed later)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_user_id UUID REFERENCES profiles(id),
    status project_status NOT NULL DEFAULT 'discovery',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    due_date DATE,
    started_at DATE,
    completed_at DATE,
    -- Commercial (only visible to super_admin)
    value_total DECIMAL(10,2),
    value_paid DECIMAL(10,2) DEFAULT 0,
    margin_percent DECIMAL(5,2),
    notes_internal TEXT,
    -- Metadata
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Assignments (which delivery partners are assigned)
CREATE TABLE project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'delivery',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id),
    UNIQUE(project_id, user_id)
);

-- Project Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'medium',
    assignee_id UUID REFERENCES profiles(id),
    due_date DATE,
    completed_at TIMESTAMPTZ,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge Base Categories
CREATE TABLE kb_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_internal BOOLEAN NOT NULL DEFAULT false, -- Hidden from clients
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge Base Articles
CREATE TABLE kb_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES kb_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL, -- Markdown
    excerpt TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_internal BOOLEAN NOT NULL DEFAULT false, -- Hidden from clients
    author_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    type activity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    is_internal BOOLEAN NOT NULL DEFAULT false, -- Hidden from clients
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Files
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by UUID REFERENCES profiles(id),
    folder TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meeting Notes
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    attendees TEXT[],
    notes TEXT, -- Markdown
    action_items TEXT[],
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments (on tasks, projects, etc.)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client_user ON projects(client_user_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_activities_project ON activities(project_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);
CREATE INDEX idx_assignments_user ON project_assignments(user_id);
CREATE INDEX idx_kb_articles_category ON kb_articles(category_id);
CREATE INDEX idx_kb_articles_published ON kb_articles(is_published);
CREATE INDEX idx_files_project ON files(project_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to check if user is assigned to project
CREATE OR REPLACE FUNCTION is_assigned_to_project(user_id UUID, proj_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM project_assignments 
        WHERE project_assignments.user_id = $1 
        AND project_assignments.project_id = $2
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to check if user is project client
CREATE OR REPLACE FUNCTION is_project_client(user_id UUID, proj_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = $2 
        AND projects.client_user_id = $1
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- POLICIES: Profiles
-- ============================================

-- Everyone can read profiles
CREATE POLICY "Profiles are viewable by authenticated users"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Super admins can update any profile
CREATE POLICY "Super admins can update any profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (get_user_role(auth.uid()) = 'super_admin');

-- ============================================
-- POLICIES: Projects
-- ============================================

-- Super admin and admin see all projects
CREATE POLICY "Admins see all projects"
    ON projects FOR SELECT
    TO authenticated
    USING (
        get_user_role(auth.uid()) IN ('super_admin', 'admin')
    );

-- Delivery partners see assigned projects
CREATE POLICY "Delivery sees assigned projects"
    ON projects FOR SELECT
    TO authenticated
    USING (
        get_user_role(auth.uid()) = 'delivery'
        AND is_assigned_to_project(auth.uid(), id)
    );

-- Clients see their own projects
CREATE POLICY "Clients see own projects"
    ON projects FOR SELECT
    TO authenticated
    USING (
        get_user_role(auth.uid()) = 'client'
        AND client_user_id = auth.uid()
    );

-- Only super admin and admin can create projects
CREATE POLICY "Admins can create projects"
    ON projects FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_role(auth.uid()) IN ('super_admin', 'admin')
    );

-- Only super admin and admin can update projects
CREATE POLICY "Admins can update projects"
    ON projects FOR UPDATE
    TO authenticated
    USING (
        get_user_role(auth.uid()) IN ('super_admin', 'admin')
    );

-- Only super admin can delete projects
CREATE POLICY "Super admin can delete projects"
    ON projects FOR DELETE
    TO authenticated
    USING (
        get_user_role(auth.uid()) = 'super_admin'
    );

-- ============================================
-- POLICIES: Tasks
-- ============================================

-- Task visibility follows project visibility
CREATE POLICY "Tasks visible with project access"
    ON tasks FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = tasks.project_id
            AND (
                get_user_role(auth.uid()) IN ('super_admin', 'admin')
                OR is_assigned_to_project(auth.uid(), p.id)
                OR p.client_user_id = auth.uid()
            )
        )
    );

-- Admins and assigned users can create tasks
CREATE POLICY "Can create tasks on accessible projects"
    ON tasks FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_role(auth.uid()) IN ('super_admin', 'admin')
        OR is_assigned_to_project(auth.uid(), project_id)
    );

-- Admins and assigned users can update tasks
CREATE POLICY "Can update tasks on accessible projects"
    ON tasks FOR UPDATE
    TO authenticated
    USING (
        get_user_role(auth.uid()) IN ('super_admin', 'admin')
        OR is_assigned_to_project(auth.uid(), project_id)
        OR assignee_id = auth.uid()
    );

-- ============================================
-- POLICIES: Knowledge Base
-- ============================================

-- Categories visible to all authenticated (filter internal in app)
CREATE POLICY "KB categories visible to authenticated"
    ON kb_categories FOR SELECT
    TO authenticated
    USING (
        NOT is_internal 
        OR get_user_role(auth.uid()) IN ('super_admin', 'admin', 'delivery')
    );

-- Articles visible based on internal flag
CREATE POLICY "KB articles visible based on role"
    ON kb_articles FOR SELECT
    TO authenticated
    USING (
        is_published = true
        AND (
            NOT is_internal 
            OR get_user_role(auth.uid()) IN ('super_admin', 'admin', 'delivery')
        )
    );

-- Only admins can manage KB
CREATE POLICY "Admins can manage KB categories"
    ON kb_categories FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('super_admin', 'admin'))
    WITH CHECK (get_user_role(auth.uid()) IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage KB articles"
    ON kb_articles FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('super_admin', 'admin'))
    WITH CHECK (get_user_role(auth.uid()) IN ('super_admin', 'admin'));

-- ============================================
-- POLICIES: Activities
-- ============================================

CREATE POLICY "Activities visible with project access"
    ON activities FOR SELECT
    TO authenticated
    USING (
        project_id IS NULL -- Global activities
        OR EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = activities.project_id
            AND (
                get_user_role(auth.uid()) IN ('super_admin', 'admin')
                OR (is_assigned_to_project(auth.uid(), p.id) AND NOT activities.is_internal)
                OR (p.client_user_id = auth.uid() AND NOT activities.is_internal)
            )
        )
    );

CREATE POLICY "Authenticated users can create activities"
    ON activities FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================
-- POLICIES: Files, Meetings, Comments
-- ============================================

-- Files follow project access
CREATE POLICY "Files visible with project access"
    ON files FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = files.project_id
            AND (
                get_user_role(auth.uid()) IN ('super_admin', 'admin')
                OR is_assigned_to_project(auth.uid(), p.id)
                OR p.client_user_id = auth.uid()
            )
        )
    );

-- Meetings follow project access  
CREATE POLICY "Meetings visible with project access"
    ON meetings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = meetings.project_id
            AND (
                get_user_role(auth.uid()) IN ('super_admin', 'admin')
                OR is_assigned_to_project(auth.uid(), p.id)
            )
        )
    );

-- Comments follow project access (with internal filter)
CREATE POLICY "Comments visible with project access"
    ON comments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = comments.project_id
            AND (
                get_user_role(auth.uid()) IN ('super_admin', 'admin')
                OR (is_assigned_to_project(auth.uid(), p.id) AND NOT comments.is_internal)
                OR (p.client_user_id = auth.uid() AND NOT comments.is_internal)
            )
        )
    );

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_kb_articles_updated_at
    BEFORE UPDATE ON kb_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================

-- Insert default KB categories
INSERT INTO kb_categories (name, slug, icon, sort_order, is_internal) VALUES
    ('Getting Started', 'getting-started', '🚀', 1, false),
    ('Process', 'process', '🔧', 2, true),
    ('Technical', 'technical', '💻', 3, true),
    ('Industry', 'industry', '🏗️', 4, true),
    ('Commercial', 'commercial', '💰', 5, true);
