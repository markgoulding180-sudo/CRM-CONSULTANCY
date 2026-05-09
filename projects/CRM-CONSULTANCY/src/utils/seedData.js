/**
 * Seed data for CRM application
 * Contains realistic sample contacts, deals, and tasks
 */

export const seedContacts = [
  {
    id: 'c1',
    name: 'Sarah Mitchell',
    company: 'TechVentures Ltd',
    role: 'CTO',
    email: 'sarah.mitchell@techventures.co.uk',
    phone: '+44 20 7946 0958',
    status: 'Customer',
    lastContacted: '2026-05-01'
  },
  {
    id: 'c2',
    name: 'James Harrison',
    company: 'Acme Corp',
    role: 'Procurement Manager',
    email: 'j.harrison@acmecorp.com',
    phone: '+44 161 496 0357',
    status: 'Prospect',
    lastContacted: '2026-04-28'
  },
  {
    id: 'c3',
    name: 'Emma Thompson',
    company: 'BrightStart Solutions',
    role: 'CEO',
    email: 'emma@brightstart.io',
    phone: '+44 121 496 0123',
    status: 'Lead',
    lastContacted: '2026-05-05'
  },
  {
    id: 'c4',
    name: 'Michael Chen',
    company: 'Global Dynamics Inc',
    role: 'VP of Sales',
    email: 'm.chen@globaldynamics.com',
    phone: '+44 20 7123 4567',
    status: 'Customer',
    lastContacted: '2026-04-15'
  },
  {
    id: 'c5',
    name: 'Olivia Williams',
    company: 'Summit Consulting',
    role: 'Director of Operations',
    email: 'olivia.w@summitconsulting.co.uk',
    phone: '+44 131 496 0987',
    status: 'Prospect',
    lastContacted: '2026-05-03'
  },
  {
    id: 'c6',
    name: 'David Patel',
    company: 'Innovate UK Partners',
    role: 'Managing Director',
    email: 'david.patel@innovateuk.net',
    phone: '+44 20 7946 0888',
    status: 'Lead',
    lastContacted: '2026-05-07'
  }
];

export const seedDeals = [
  {
    id: 'd1',
    name: 'Enterprise Software License',
    company: 'TechVentures Ltd',
    value: 75000,
    closeDate: '2026-06-15',
    probability: 85,
    stage: 'Negotiation',
    contactId: 'c1'
  },
  {
    id: 'd2',
    name: 'Q3 Consulting Package',
    company: 'Acme Corp',
    value: 25000,
    closeDate: '2026-07-01',
    probability: 60,
    stage: 'Proposal',
    contactId: 'c2'
  },
  {
    id: 'd3',
    name: 'Digital Transformation Project',
    company: 'BrightStart Solutions',
    value: 120000,
    closeDate: '2026-08-30',
    probability: 40,
    stage: 'Discovery',
    contactId: 'c3'
  },
  {
    id: 'd4',
    name: 'Annual Support Contract',
    company: 'Global Dynamics Inc',
    value: 45000,
    closeDate: '2026-05-20',
    probability: 95,
    stage: 'Closed Won',
    contactId: 'c4'
  }
];

export const seedTasks = [
  {
    id: 't1',
    description: 'Follow up with Sarah about implementation timeline',
    dueDate: '2026-05-10',
    priority: 'High',
    contactId: 'c1',
    done: false
  },
  {
    id: 't2',
    description: 'Send proposal document to James Harrison',
    dueDate: '2026-05-12',
    priority: 'High',
    contactId: 'c2',
    done: false
  },
  {
    id: 't3',
    description: 'Schedule discovery call with Emma Thompson',
    dueDate: '2026-05-11',
    priority: 'Medium',
    contactId: 'c3',
    done: true
  },
  {
    id: 't4',
    description: 'Prepare quarterly review for Michael Chen',
    dueDate: '2026-05-15',
    priority: 'Medium',
    contactId: 'c4',
    done: false
  },
  {
    id: 't5',
    description: 'Research Summit Consulting competitors',
    dueDate: '2026-05-14',
    priority: 'Low',
    contactId: 'c5',
    done: false
  }
];

// Default export for convenience
export default {
  contacts: seedContacts,
  deals: seedDeals,
  tasks: seedTasks
};
