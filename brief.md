# CRM Web App — Development Brief

**Project:** Build a fully functional CRM (Customer Relationship Management) web application as a single-page app.

## Tech Stack

- **Frontend:** React (with hooks)
- **Styling:** Tailwind CSS
- **No backend required** — use local state or localStorage to persist data between sessions

## Pages / Sections

### 1. Dashboard
- Summary stat cards: Total Contacts, Open Deals, Pipeline Value (£), Tasks Due Today
- Recent activity feed (last 5 actions)
- Quick-add buttons for contact/deal/task

### 2. Contacts
- Searchable, sortable table of contacts
- Fields: Name, Company, Role, Email, Phone, Status (Lead / Prospect / Customer), Last Contacted
- Add / Edit / Delete contacts via a modal form
- Colour-coded status badges

### 3. Deals Pipeline
- Kanban board with 5 columns: Lead → Discovery → Proposal → Negotiation → Closed Won
- Each deal card shows: Deal name, Company, £ Value, Close date, Probability %
- Drag and drop cards between columns
- Add new deals via modal

### 4. Tasks
- List of tasks with: Description, Due date, Priority (High / Medium / Low), Linked contact, Done/Not done
- Tick off tasks as complete
- Add new tasks via modal
- Filter by: All / Today / Upcoming / Done

## Design Requirements

- Clean, professional look — dark navy sidebar, white main area
- Fully responsive (works on mobile and desktop)
- Smooth transitions between sections
- No external APIs needed — seed the app with 5–6 example contacts and deals on first load

## Nice-to-Haves (if time allows)

- Export contacts to CSV
- Search bar in the top navigation
- Deal value totals per pipeline column
- Overdue task highlighting in red

## Tone

Professional SaaS product, similar to HubSpot or Pipedrive in feel. Keep it clean and fast.
