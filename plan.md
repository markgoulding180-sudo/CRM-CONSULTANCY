# CRM-CONSULTANCY Project Plan

## Overview
Building a fully functional CRM (Customer Relationship Management) web application as a single-page React app with Tailwind CSS styling. Data persists via localStorage.

## Tech Stack
- **Frontend:** React (with hooks)
- **Styling:** Tailwind CSS
- **Persistence:** localStorage
- **Drag & Drop:** @dnd-kit or react-beautiful-dnd

## Architecture
- Single-page application with client-side routing (React Router)
- Component-based structure
- Custom hooks for data persistence
- Context API for global state management

## Task Breakdown

### Phase 1: Project Setup
**Agent:** qwen2.5-coder:7b
- Initialize React project with Vite
- Configure Tailwind CSS
- Set up folder structure (components, hooks, context, utils)
- Install dependencies (react-router-dom, @dnd-kit/core, @dnd-kit/sortable, lucide-react)

### Phase 2: Core Components & Layout
**Agent:** qwen2.5-coder:7b
- Create dark navy sidebar navigation
- Build main layout wrapper (sidebar + content area)
- Implement responsive mobile menu
- Create reusable UI components (Button, Modal, Card, Badge, Input)

### Phase 3: Data Layer
**Agent:** qwen3:14b
- Design data models (Contact, Deal, Task, Activity)
- Create custom useLocalStorage hook
- Build data context with CRUD operations
- Seed initial data (5-6 contacts, 3-4 deals, 5 tasks)

### Phase 4: Dashboard Page
**Agent:** qwen2.5-coder:7b
- Build stat cards component
- Calculate totals (contacts, deals, pipeline value, tasks due)
- Create recent activity feed
- Add quick-add action buttons

### Phase 5: Contacts Page
**Agent:** qwen2.5-coder:7b
- Build searchable, sortable contacts table
- Create contact form modal (add/edit)
- Implement delete with confirmation
- Add colour-coded status badges (Lead=blue, Prospect=amber, Customer=green)

### Phase 6: Deals Pipeline
**Agent:** qwen3:14b
- Build Kanban board with 5 columns
- Implement drag-and-drop between columns
- Create deal card component
- Build deal form modal
- Show value totals per column

### Phase 7: Tasks Page
**Agent:** qwen2.5-coder:7b
- Build task list with checkboxes
- Create task form modal
- Implement filters (All/Today/Upcoming/Done)
- Add overdue highlighting (red for past due dates)
- Link tasks to contacts

### Phase 8: Polish & Nice-to-Haves
**Agent:** gemma4:e4b
- Add smooth transitions/animations
- Implement CSV export for contacts
- Add global search in top nav
- Final responsive testing
- Performance optimization

## File Structure
```
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── UI/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   └── Input.jsx
│   ├── Dashboard/
│   │   ├── StatCard.jsx
│   │   ├── ActivityFeed.jsx
│   │   └── QuickActions.jsx
│   ├── Contacts/
│   │   ├── ContactsTable.jsx
│   │   └── ContactForm.jsx
│   ├── Deals/
│   │   ├── KanbanBoard.jsx
│   │   ├── KanbanColumn.jsx
│   │   ├── DealCard.jsx
│   │   └── DealForm.jsx
│   └── Tasks/
│       ├── TaskList.jsx
│       ├── TaskItem.jsx
│       └── TaskForm.jsx
├── context/
│   └── DataContext.jsx
├── hooks/
│   └── useLocalStorage.js
├── utils/
│   ├── formatters.js
│   └── seedData.js
├── App.jsx
└── main.jsx
```

## Design System

### Colors
- **Sidebar:** bg-slate-900 (dark navy)
- **Primary:** blue-600
- **Success:** green-500
- **Warning:** amber-500
- **Danger:** red-500
- **Background:** gray-50 (main), white (cards)

### Status Colors
- Lead: blue
- Prospect: amber
- Customer: green

### Priority Colors
- High: red
- Medium: amber
- Low: green

## Timeline Estimate
- Phase 1: 30 mins
- Phase 2: 45 mins
- Phase 3: 30 mins
- Phase 4: 30 mins
- Phase 5: 45 mins
- Phase 6: 60 mins
- Phase 7: 45 mins
- Phase 8: 30 mins

**Total: ~5-6 hours**
