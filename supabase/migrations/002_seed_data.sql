-- Forge Seed Data
-- Run this after 001_initial_schema.sql to populate test data

-- Note: Replace 'your-user-id' with your actual user ID from auth.users after signup

-- ============================================
-- SAMPLE PROJECTS
-- ============================================

INSERT INTO projects (id, name, description, client_name, client_email, status, progress, due_date, started_at, value_total, value_paid, margin_percent, notes_internal) VALUES
('11111111-1111-1111-1111-111111111111', 'Alpha Piling Enquiry Automation', 'End-to-end automation system for tender enquiry processing. Monitors Gmail, extracts project details, creates Drive folder structure, extracts pile schedules from drawings, and sends acknowledgement emails.', 'Alpha Piling Ltd', 'joe@alphapiling.co.uk', 'active', 35, '2026-06-01', '2026-04-01', 5500, 2750, 45, 'Joe Hall is the main contact. Darryl handles technical queries. Deposit received, waiting on sample data.'),

('22222222-2222-2222-2222-222222222222', 'BuildRight Invoice Processing', 'Automated invoice extraction and approval workflow for construction company. Integrates with Xero.', 'BuildRight Construction', 'sarah@buildright.co.uk', 'discovery', 10, '2026-05-15', NULL, 3500, 0, 40, 'Initial call completed. Awaiting scope confirmation.'),

('33333333-3333-3333-3333-333333333333', 'Metro Scaffolding Quote Generator', 'AI-powered quote generation from site photos and specifications. Mobile-first design.', 'Metro Scaffolding', 'dave@metroscaff.com', 'complete', 100, '2026-03-01', '2026-01-15', 4200, 4200, 50, 'Delivered on time. Client very happy. Potential for Phase 2.'),

('44444444-4444-4444-4444-444444444444', 'Coastal Civils Document Classifier', 'Machine learning model to classify incoming tender documents by type. Feeds into existing workflow.', 'Coastal Civils', 'info@coastalcivils.co.uk', 'paused', 60, '2026-04-30', '2026-02-01', 6000, 3000, 35, 'Paused due to client internal restructuring. Resume expected May.');

-- ============================================
-- MILESTONES
-- ============================================

INSERT INTO milestones (project_id, title, description, due_date, completed_at, sort_order) VALUES
-- Alpha Piling
('11111111-1111-1111-1111-111111111111', 'Discovery & Scoping', 'Understand requirements, document workflow, agree technical approach', '2026-04-07', '2026-04-05 10:00:00', 1),
('11111111-1111-1111-1111-111111111111', 'Email Monitoring Setup', 'Gmail API integration, email parsing, trigger configuration', '2026-04-14', NULL, 2),
('11111111-1111-1111-1111-111111111111', 'File Source Integration', 'Dropbox, Dalux, and email attachment handling', '2026-04-21', NULL, 3),
('11111111-1111-1111-1111-111111111111', 'Pile Schedule Extraction', 'Azure Document Intelligence integration, table extraction, Excel output', '2026-05-05', NULL, 4),
('11111111-1111-1111-1111-111111111111', 'Testing & Refinement', 'End-to-end testing with real documents, accuracy improvements', '2026-05-19', NULL, 5),
('11111111-1111-1111-1111-111111111111', 'Deployment & Handover', 'Production deployment, documentation, training session', '2026-06-01', NULL, 6),

-- BuildRight
('22222222-2222-2222-2222-222222222222', 'Requirements Gathering', 'Document current invoice workflow and pain points', '2026-04-20', NULL, 1),
('22222222-2222-2222-2222-222222222222', 'Technical Feasibility', 'Xero API assessment, OCR testing', '2026-04-30', NULL, 2);

-- ============================================
-- TASKS
-- ============================================

INSERT INTO tasks (project_id, milestone_id, title, description, status, priority, due_date, sort_order) VALUES
-- Alpha Piling - Active tasks
('11111111-1111-1111-1111-111111111111', NULL, 'Receive sample data from Joe', 'Need 10-15 enquiry emails, pile drawings with schedules, expected Excel format', 'todo', 'high', '2026-04-15', 1),
('11111111-1111-1111-1111-111111111111', NULL, 'Set up Gmail API credentials', 'Create Google Cloud project, enable Gmail API, generate OAuth credentials', 'todo', 'medium', '2026-04-16', 2),
('11111111-1111-1111-1111-111111111111', NULL, 'Build email polling service', 'Python script to monitor inbox, filter tender enquiries, extract attachments', 'todo', 'medium', '2026-04-18', 3),
('11111111-1111-1111-1111-111111111111', NULL, 'Dropbox link handler', 'Detect Dropbox links in emails, authenticate, download files', 'todo', 'medium', '2026-04-20', 4),
('11111111-1111-1111-1111-111111111111', NULL, 'Document current folder structure', 'Get exact folder hierarchy from Joe for Drive organisation', 'in_progress', 'medium', '2026-04-14', 5),
('11111111-1111-1111-1111-111111111111', NULL, 'POC demo created', 'Interactive demo showing full workflow', 'done', 'high', '2026-04-10', 6),
('11111111-1111-1111-1111-111111111111', NULL, 'Proposal sent and approved', 'Combined proposal for email automation + pile extraction', 'done', 'high', '2026-04-01', 7),
('11111111-1111-1111-1111-111111111111', NULL, 'Deposit received', '50% upfront payment (£2,750)', 'done', 'urgent', '2026-04-08', 8),

-- BuildRight - Discovery tasks
('22222222-2222-2222-2222-222222222222', NULL, 'Schedule discovery call', 'Book 30-min call with Sarah to discuss requirements', 'todo', 'high', '2026-04-18', 1),
('22222222-2222-2222-2222-222222222222', NULL, 'Review Xero API documentation', 'Check invoice endpoints, authentication, rate limits', 'todo', 'medium', '2026-04-20', 2),

-- Metro Scaffolding - Completed tasks
('33333333-3333-3333-3333-333333333333', NULL, 'Requirements gathering', 'Documented all quote fields and calculation logic', 'done', 'high', '2026-01-20', 1),
('33333333-3333-3333-3333-333333333333', NULL, 'UI prototype', 'Figma mockups approved by client', 'done', 'medium', '2026-01-25', 2),
('33333333-3333-3333-3333-333333333333', NULL, 'Backend development', 'API, database, image processing pipeline', 'done', 'high', '2026-02-15', 3),
('33333333-3333-3333-3333-333333333333', NULL, 'Mobile app build', 'React Native app with camera integration', 'done', 'high', '2026-02-25', 4),
('33333333-3333-3333-3333-333333333333', NULL, 'Testing and refinement', 'UAT with client team, bug fixes', 'done', 'medium', '2026-03-01', 5);

-- ============================================
-- KNOWLEDGE BASE ARTICLES
-- ============================================

INSERT INTO kb_articles (category_id, title, slug, content, excerpt, is_published, is_internal) VALUES
-- Getting Started (public)
((SELECT id FROM kb_categories WHERE slug = 'getting-started'), 
'Welcome to Forge', 
'welcome-to-forge',
'# Welcome to Forge

Forge is Altitude AI''s project delivery platform. It helps us manage client projects, track tasks, and maintain our knowledge base.

## What you can do here

- **View your projects** — See progress, milestones, and deliverables
- **Track tasks** — Know what''s being worked on and what''s next
- **Access documentation** — Find guides and resources
- **See activity** — Stay updated on project progress

## Need help?

Contact your project lead or email support@altitudeai.co.uk',
'Getting started with the Forge platform',
true, false),

-- Process (internal)
((SELECT id FROM kb_categories WHERE slug = 'process'),
'Project Delivery Workflow',
'project-delivery-workflow', 
'# Project Delivery Workflow

Our standard process for delivering AI automation projects.

## Phases

### 1. Discovery (Week 1)
- Initial client call
- Requirements documentation
- Technical feasibility assessment
- Proposal creation

### 2. Build (Weeks 2-6)
- Environment setup
- Core development
- Weekly progress updates
- Internal testing

### 3. Testing (Week 7)
- Client UAT
- Bug fixes
- Performance optimization

### 4. Deployment (Week 8)
- Production deployment
- Documentation handover
- Training session
- Go-live support

## Key Principles

1. **Communicate early and often** — Clients should never be surprised
2. **Document everything** — Future you will thank present you
3. **Test with real data** — Synthetic data hides real problems
4. **Under-promise, over-deliver** — Build buffer into timelines',
'Standard process for AI automation project delivery',
true, true),

-- Technical (internal)
((SELECT id FROM kb_categories WHERE slug = 'technical'),
'Azure Document Intelligence Setup',
'azure-document-intelligence-setup',
'# Azure Document Intelligence Setup

Guide to setting up Azure DI for document extraction projects.

## Prerequisites

- Azure subscription
- Resource group created
- Appropriate permissions

## Steps

### 1. Create Resource

```bash
az cognitiveservices account create \
  --name "altitude-doc-intel" \
  --resource-group "altitude-ai-rg" \
  --kind "FormRecognizer" \
  --sku "S0" \
  --location "uksouth"
```

### 2. Get API Keys

```bash
az cognitiveservices account keys list \
  --name "altitude-doc-intel" \
  --resource-group "altitude-ai-rg"
```

### 3. Python Client Setup

```python
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

endpoint = "https://altitude-doc-intel.cognitiveservices.azure.com/"
key = "your-api-key"

client = DocumentAnalysisClient(endpoint, AzureKeyCredential(key))
```

## Pricing

- ~£1.50 per 1,000 pages (prebuilt models)
- ~£10 per 1,000 pages (custom models)

## Tips

- Use `prebuilt-layout` for tables
- Use `prebuilt-document` for general extraction
- Custom models only when accuracy <90%',
'Setting up Azure Document Intelligence for document processing',
true, true),

-- Industry (internal)
((SELECT id FROM kb_categories WHERE slug = 'industry'),
'Piling Industry Overview',
'piling-industry-overview',
'# Piling Industry Overview

Background knowledge for working with piling contractors.

## What is Piling?

Piling is a foundation technique where long columns (piles) are driven or drilled into the ground to support structures. Used when surface soil can''t support the building load.

## Key Documents

### Pile Schedules
Tables showing:
- Pile reference (e.g., P1, P2, P3)
- Pile type (CFA, driven, bored)
- Diameter (300mm, 450mm, 600mm)
- Length (typically 6-20m)
- Working load (kN) — **this is the critical data**
- Cut-off level
- Grid reference

### Soil Investigation Reports
- Borehole logs
- SPT (Standard Penetration Test) results
- Groundwater levels
- Soil descriptions

## Common Terminology

| Term | Meaning |
|------|---------|
| SWL | Safe Working Load |
| CFA | Continuous Flight Auger |
| COL | Cut-Off Level |
| TOC | Top of Concrete |
| BGL | Below Ground Level |

## Tender Process

1. Enquiry received (drawings, specs, deadline)
2. Review pile schedule for quantities
3. Calculate pricing based on loads and ground conditions
4. Submit tender
5. If won, detailed design and mobilisation',
'Background on the piling industry for project context',
true, true);

-- ============================================
-- ACTIVITIES
-- ============================================

INSERT INTO activities (project_id, type, title, description, is_internal, created_at) VALUES
-- Alpha Piling activities
('11111111-1111-1111-1111-111111111111', 'payment', 'Deposit received', '£2,750 (50% of £5,500) received via bank transfer', false, '2026-04-08 14:30:00'),
('11111111-1111-1111-1111-111111111111', 'project', 'Project kicked off', 'Discovery phase started after deposit confirmation', false, '2026-04-08 15:00:00'),
('11111111-1111-1111-1111-111111111111', 'meeting', 'Discovery call with Joe', 'Walked through current workflow, identified file sources (email, Dropbox, Dalux), confirmed pile schedule format requirements', true, '2026-04-05 10:00:00'),
('11111111-1111-1111-1111-111111111111', 'task', 'POC demo completed', 'Interactive demo showing 8-stage workflow now live on GitHub Pages', false, '2026-04-10 16:00:00'),
('11111111-1111-1111-1111-111111111111', 'comment', 'Waiting on sample data', 'Joe to send 10-15 enquiry emails with attachments, pile drawings, and expected output format', true, '2026-04-12 09:00:00'),

-- BuildRight activities  
('22222222-2222-2222-2222-222222222222', 'project', 'Enquiry received', 'Sarah reached out about automating invoice processing', false, '2026-04-10 11:00:00'),
('22222222-2222-2222-2222-222222222222', 'meeting', 'Initial call', 'Discussed pain points: manual data entry, approval bottlenecks, Xero sync issues', true, '2026-04-12 14:00:00'),

-- Metro activities
('33333333-3333-3333-3333-333333333333', 'payment', 'Final payment received', '£2,100 (remaining 50%) received', false, '2026-03-01 10:00:00'),
('33333333-3333-3333-3333-333333333333', 'project', 'Project completed', 'All deliverables handed over, client signed off', false, '2026-03-01 12:00:00');

-- ============================================
-- MEETINGS
-- ============================================

INSERT INTO meetings (project_id, title, date, attendees, notes, action_items, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 
'Discovery Call - Alpha Piling',
'2026-04-05 10:00:00',
ARRAY['Joe Hall', 'Darryl', 'Bolaji Olatoye'],
'## Summary
Walked through current tender enquiry workflow. Key pain points:
- Manual email monitoring for enquiries
- Copy-pasting project details into folders
- Hunting through 100+ document packs for pile drawings
- Manual transcription of pile schedules into Excel

## File Sources
- Email attachments (most common)
- Dropbox links (shared folders)
- Dalux project files (construction collaboration platform)

## Requirements Confirmed
1. Auto-detect enquiry emails in inbox
2. Download all files regardless of source
3. Create standard folder structure in Google Drive
4. Extract pile schedules → Excel
5. Send acknowledgement email with lead time

## Technical Notes
- Civils AI works but crashes on large files
- Separate load tables need to be detected and merged
- Column headers vary between engineers (SWL vs Working Load vs Allowable)',
ARRAY['Joe to send sample data (10-15 emails)', 'Bolaji to set up Gmail API credentials', 'Document exact folder structure needed'],
'2026-04-05 11:00:00'),

('33333333-3333-3333-3333-333333333333',
'Final Handover - Metro Scaffolding', 
'2026-03-01 09:00:00',
ARRAY['Dave', 'Bolaji Olatoye'],
'## Handover Complete
- Mobile app deployed to App Store and Play Store
- Admin dashboard live at app.metroscaff.com
- All documentation in shared Drive folder

## Training
- Walked through quote creation flow
- Showed how to adjust pricing rules
- Explained photo upload and AI processing

## Phase 2 Ideas (for future)
- Integration with accounting software
- Customer portal for quote acceptance
- Automated follow-ups',
ARRAY['Dave to provide testimonial', 'Discuss Phase 2 in Q3'],
'2026-03-01 10:30:00');
