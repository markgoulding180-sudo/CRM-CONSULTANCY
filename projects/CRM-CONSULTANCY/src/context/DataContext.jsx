/**
 * DataContext - Central state management for CRM application
 * Provides contacts, deals, tasks, and activities with CRUD operations
 * All data is persisted to localStorage
 */

import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { seedContacts, seedDeals, seedTasks } from '../utils/seedData';

// Create context
const DataContext = createContext(null);

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

/**
 * DataProvider component - Wraps the app and provides data context
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const DataProvider = ({ children }) => {
  // Initialize state with seed data if localStorage is empty
  const [contacts, setContacts] = useLocalStorage('crm_contacts', seedContacts);
  const [deals, setDeals] = useLocalStorage('crm_deals', seedDeals);
  const [tasks, setTasks] = useLocalStorage('crm_tasks', seedTasks);
  const [activities, setActivities] = useLocalStorage('crm_activities', []);
  const [contactActivities, setContactActivities] = useLocalStorage('crm_contact_activities', []);
  const [meetings, setMeetings] = useLocalStorage('crm_meetings', []);
  const [invoices, setInvoices] = useLocalStorage('crm_invoices', []);

  // Use refs to avoid circular dependency issues
  const addActivityRef = useRef();
  const addTaskRef = useRef();
  const addInvoiceRef = useRef();

  /**
   * Add a new system activity log entry (for internal CRM events)
   * @param {string} type - Activity type (e.g., 'contact_added', 'deal_updated')
   * @param {string} description - Human-readable description
   * @param {string} [entityId] - ID of related entity
   * @param {string} [entityType] - Type of related entity (contact, deal, task)
   */
  const addActivity = useCallback((type, description, entityId = null, entityType = null) => {
    const newActivity = {
      id: `a_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      description,
      entityId,
      entityType,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  }, [setActivities]);

  // Store addActivity in ref for use by other functions
  useEffect(() => {
    addActivityRef.current = addActivity;
  }, [addActivity]);

  // ==================== CONTACT ACTIVITY CRUD (Email, Call, Note, Meeting) ====================

  /**
   * Add a new contact activity (email, call, note, meeting)
   * @param {Object} activityData - Activity data
   * @param {string} activityData.contactId - Contact ID
   * @param {string} activityData.type - Activity type ('email'|'call'|'note'|'meeting')
   * @param {string} activityData.subject - Activity subject
   * @param {string} activityData.body - Activity body/content
   * @param {string} activityData.date - Activity date (YYYY-MM-DD)
   * @returns {Object} The created activity with generated id
   */
  const addContactActivity = useCallback((activityData) => {
    const newActivity = {
      id: `ca_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contactId: activityData.contactId,
      type: activityData.type,
      subject: activityData.subject,
      body: activityData.body,
      date: activityData.date,
      createdAt: new Date().toISOString()
    };
    setContactActivities(prev => [newActivity, ...prev]);
    
    // Auto-update contact's lastContacted date
    setContacts(prev => {
      const index = prev.findIndex(c => c.id === activityData.contactId);
      if (index === -1) return prev;
      const updatedContact = { ...prev[index], lastContacted: activityData.date };
      const newContacts = [...prev];
      newContacts[index] = updatedContact;
      return newContacts;
    });
    
    return newActivity;
  }, [setContactActivities, setContacts]);

  /**
   * Update an existing contact activity
   * @param {string} id - Activity ID
   * @param {Object} updates - Partial activity data to update
   * @returns {Object|null} Updated activity or null if not found
   */
  const updateContactActivity = useCallback((id, updates) => {
    let updatedActivity = null;
    setContactActivities(prev => {
      const index = prev.findIndex(a => a.id === id);
      if (index === -1) return prev;
      updatedActivity = { ...prev[index], ...updates };
      const newActivities = [...prev];
      newActivities[index] = updatedActivity;
      return newActivities;
    });
    return updatedActivity;
  }, [setContactActivities]);

  /**
   * Delete a contact activity
   * @param {string} id - Activity ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteContactActivity = useCallback((id) => {
    const activity = contactActivities.find(a => a.id === id);
    if (!activity) return false;

    setContactActivities(prev => prev.filter(a => a.id !== id));
    return true;
  }, [contactActivities, setContactActivities]);

  // ==================== CONTACT CRUD ====================

  /**
   * Add a new contact
   * @param {Object} contactData - Contact data (without id)
   * @returns {Object} The created contact with generated id
   */
  const addContact = useCallback((contactData) => {
    const newContact = {
      ...contactData,
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastContacted: new Date().toISOString().split('T')[0]
    };
    setContacts(prev => [...prev, newContact]);
    addActivityRef.current?.('contact_added', `Added contact: ${newContact.name}`, newContact.id, 'contact');
    return newContact;
  }, [setContacts]);

  /**
   * Update an existing contact
   * @param {string} id - Contact ID
   * @param {Object} updates - Partial contact data to update
   * @returns {Object|null} Updated contact or null if not found
   */
  const updateContact = useCallback((id, updates) => {
    let updatedContact = null;
    setContacts(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index === -1) return prev;
      updatedContact = { ...prev[index], ...updates };
      const newContacts = [...prev];
      newContacts[index] = updatedContact;
      return newContacts;
    });
    if (updatedContact) {
      addActivityRef.current?.('contact_updated', `Updated contact: ${updatedContact.name}`, id, 'contact');
    }
    return updatedContact;
  }, [setContacts]);

  /**
   * Delete a contact and related tasks/deals
   * @param {string} id - Contact ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteContact = useCallback((id) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return false;

    setContacts(prev => prev.filter(c => c.id !== id));
    // Also delete related deals and tasks
    setDeals(prev => prev.filter(d => d.contactId !== id));
    setTasks(prev => prev.filter(t => t.contactId !== id));
    
    addActivityRef.current?.('contact_deleted', `Deleted contact: ${contact.name}`, id, 'contact');
    return true;
  }, [contacts, setContacts, setDeals, setTasks]);

  // ==================== DEAL CRUD ====================

  /**
   * Add a new deal
   * @param {Object} dealData - Deal data (without id)
   * @returns {Object} The created deal with generated id
   */
  const addDeal = useCallback((dealData) => {
    const newDeal = {
      ...dealData,
      id: `d_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setDeals(prev => [...prev, newDeal]);
    addActivityRef.current?.('deal_added', `Added deal: ${newDeal.name} (${newDeal.company})`, newDeal.id, 'deal');
    return newDeal;
  }, [setDeals]);

  /**
   * Update an existing deal
   * @param {string} id - Deal ID
   * @param {Object} updates - Partial deal data to update
   * @returns {Object|null} Updated deal or null if not found
   */
  const updateDeal = useCallback((id, updates) => {
    let updatedDeal = null;
    setDeals(prev => {
      const index = prev.findIndex(d => d.id === id);
      if (index === -1) return prev;
      updatedDeal = { ...prev[index], ...updates };
      const newDeals = [...prev];
      newDeals[index] = updatedDeal;
      return newDeals;
    });
    if (updatedDeal) {
      addActivityRef.current?.('deal_updated', `Updated deal: ${updatedDeal.name}`, id, 'deal');
    }
    return updatedDeal;
  }, [setDeals]);

  /**
   * Delete a deal
   * @param {string} id - Deal ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteDeal = useCallback((id) => {
    const deal = deals.find(d => d.id === id);
    if (!deal) return false;

    setDeals(prev => prev.filter(d => d.id !== id));
    addActivityRef.current?.('deal_deleted', `Deleted deal: ${deal.name}`, id, 'deal');
    return true;
  }, [deals, setDeals]);

  // ==================== INVOICE HELPERS ====================

  /**
   * Generate next invoice number
   * @returns {string} Next invoice number (e.g., INV-001)
   */
  const generateInvoiceNumber = useCallback(() => {
    const invoiceCount = invoices.length;
    const nextNumber = invoiceCount + 1;
    return `INV-${String(nextNumber).padStart(3, '0')}`;
  }, [invoices]);

  /**
   * Calculate invoice totals from line items
   * @param {Array} lineItems - Array of { description, quantity, unitPrice }
   * @returns {Object} { subtotal, vat, total }
   */
  const calculateInvoiceTotals = useCallback((lineItems) => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    const vat = subtotal * 0.20; // 20% VAT
    const total = subtotal + vat;
    return { subtotal, vat, total };
  }, []);

  /**
   * Add a new invoice
   * @param {Object} invoiceData - Invoice data (without id, number, subtotal, vat, total)
   * @returns {Object} The created invoice with generated id and number
   */
  const addInvoice = useCallback((invoiceData) => {
    const number = generateInvoiceNumber();
    const { subtotal, vat, total } = calculateInvoiceTotals(invoiceData.lineItems || []);
    
    const newInvoice = {
      ...invoiceData,
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      number,
      subtotal,
      vat,
      total,
      status: invoiceData.status || 'draft',
      date: invoiceData.date || new Date().toISOString().split('T')[0]
    };
    
    setInvoices(prev => [...prev, newInvoice]);
    addActivityRef.current?.('invoice_added', `Created invoice ${newInvoice.number}`, newInvoice.id, 'invoice');
    return newInvoice;
  }, [generateInvoiceNumber, calculateInvoiceTotals, setInvoices]);

  // Store addInvoice in ref
  useEffect(() => {
    addInvoiceRef.current = addInvoice;
  }, [addInvoice]);

  /**
   * Update an existing invoice
   * @param {string} id - Invoice ID
   * @param {Object} updates - Partial invoice data to update
   * @returns {Object|null} Updated invoice or null if not found
   */
  const updateInvoice = useCallback((id, updates) => {
    let updatedInvoice = null;
    setInvoices(prev => {
      const index = prev.findIndex(inv => inv.id === id);
      if (index === -1) return prev;
      
      // Recalculate totals if line items changed
      let calculatedFields = {};
      if (updates.lineItems) {
        const { subtotal, vat, total } = calculateInvoiceTotals(updates.lineItems);
        calculatedFields = { subtotal, vat, total };
      }
      
      updatedInvoice = { ...prev[index], ...updates, ...calculatedFields };
      const newInvoices = [...prev];
      newInvoices[index] = updatedInvoice;
      return newInvoices;
    });
    if (updatedInvoice) {
      addActivityRef.current?.('invoice_updated', `Updated invoice ${updatedInvoice.number}`, id, 'invoice');
    }
    return updatedInvoice;
  }, [setInvoices, calculateInvoiceTotals]);

  /**
   * Delete an invoice
   * @param {string} id - Invoice ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteInvoice = useCallback((id) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return false;

    setInvoices(prev => prev.filter(inv => inv.id !== id));
    addActivityRef.current?.('invoice_deleted', `Deleted invoice ${invoice.number}`, id, 'invoice');
    return true;
  }, [invoices, setInvoices]);

  /**
   * Mark an invoice as paid
   * @param {string} id - Invoice ID
   * @returns {Object|null} Updated invoice or null if not found
   */
  const markInvoicePaid = useCallback((id) => {
    let updatedInvoice = null;
    setInvoices(prev => {
      const index = prev.findIndex(inv => inv.id === id);
      if (index === -1) return prev;
      updatedInvoice = { ...prev[index], status: 'paid' };
      const newInvoices = [...prev];
      newInvoices[index] = updatedInvoice;
      return newInvoices;
    });
    if (updatedInvoice) {
      addActivityRef.current?.('invoice_paid', `Marked invoice ${updatedInvoice.number} as paid`, id, 'invoice');
    }
    return updatedInvoice;
  }, [setInvoices]);

  /**
   * Move a deal to a different stage
   * @param {string} id - Deal ID
   * @param {string} newStage - New stage (Lead/Discovery/Proposal/Negotiation/Closed Won)
   * @returns {Object|null} Updated deal or null if not found
   */
  const moveDealStage = useCallback((id, newStage) => {
    const validStages = ['Lead', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won'];
    if (!validStages.includes(newStage)) {
      console.error(`Invalid stage: ${newStage}`);
      return null;
    }

    let updatedDeal = null;
    setDeals(prev => {
      const index = prev.findIndex(d => d.id === id);
      if (index === -1) return prev;
      updatedDeal = { ...prev[index], stage: newStage };
      const newDeals = [...prev];
      newDeals[index] = updatedDeal;
      return newDeals;
    });
    if (updatedDeal) {
      addActivityRef.current?.('deal_stage_changed', `Moved "${updatedDeal.name}" to ${newStage}`, id, 'deal');
      
      // Auto-create draft invoice when deal moves to "Closed Won"
      if (newStage === 'Closed Won') {
        addInvoiceRef.current?.({
          contactId: updatedDeal.contactId,
          lineItems: [
            {
              description: `Deal: ${updatedDeal.name}`,
              quantity: 1,
              unitPrice: parseFloat(updatedDeal.value) || 0
            }
          ],
          status: 'draft',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        });
      }
    }
    return updatedDeal;
  }, [setDeals]);

  // ==================== TASK CRUD ====================

  /**
   * Add a new task
   * @param {Object} taskData - Task data (without id)
   * @returns {Object} The created task with generated id
   */
  const addTask = useCallback((taskData) => {
    const newTask = {
      ...taskData,
      id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      done: false
    };
    setTasks(prev => [...prev, newTask]);
    addActivityRef.current?.('task_added', `Added task: ${newTask.description.substring(0, 50)}...`, newTask.id, 'task');
    return newTask;
  }, [setTasks]);

  // Store addTask in ref
  useEffect(() => {
    addTaskRef.current = addTask;
  }, [addTask]);

  /**
   * Update an existing task
   * @param {string} id - Task ID
   * @param {Object} updates - Partial task data to update
   * @returns {Object|null} Updated task or null if not found
   */
  const updateTask = useCallback((id, updates) => {
    let updatedTask = null;
    setTasks(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;
      updatedTask = { ...prev[index], ...updates };
      const newTasks = [...prev];
      newTasks[index] = updatedTask;
      return newTasks;
    });
    if (updatedTask) {
      addActivityRef.current?.('task_updated', `Updated task: ${updatedTask.description.substring(0, 50)}...`, updatedTask.id, 'task');
    }
    return updatedTask;
  }, [setTasks]);

  /**
   * Delete a task
   * @param {string} id - Task ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;

    setTasks(prev => prev.filter(t => t.id !== id));
    addActivityRef.current?.('task_deleted', `Deleted task: ${task.description.substring(0, 50)}...`, task.id, 'task');
    return true;
  }, [tasks, setTasks]);

  /**
   * Toggle task completion status
   * @param {string} id - Task ID
   * @returns {Object|null} Updated task or null if not found
   */
  const toggleTaskDone = useCallback((id) => {
    let updatedTask = null;
    setTasks(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;
      updatedTask = { ...prev[index], done: !prev[index].done };
      const newTasks = [...prev];
      newTasks[index] = updatedTask;
      return newTasks;
    });
    if (updatedTask) {
      const action = updatedTask.done ? 'completed' : 'reopened';
      addActivityRef.current?.('task_toggled', `${action === 'completed' ? 'Completed' : 'Reopened'} task: ${updatedTask.description.substring(0, 50)}...`, updatedTask.id, 'task');
    }
    return updatedTask;
  }, [setTasks]);

  // ==================== MEETING CRUD ====================

  /**
   * Add a new meeting
   * @param {Object} meetingData - Meeting data (without id)
   * @returns {Object} The created meeting with generated id
   */
  const addMeeting = useCallback((meetingData) => {
    const newMeeting = {
      ...meetingData,
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setMeetings(prev => [...prev, newMeeting]);
    
    // Auto-create a preparation task due the day before
    const meetingDate = new Date(meetingData.date);
    const prepDate = new Date(meetingDate);
    prepDate.setDate(prepDate.getDate() - 1);
    const prepDueDate = prepDate.toISOString().split('T')[0];
    
    const prepTask = {
      description: `Prepare for ${meetingData.title}`,
      dueDate: prepDueDate,
      priority: 'High',
      contactId: meetingData.contactId,
      done: false
    };
    addTaskRef.current?.(prepTask);
    
    addActivityRef.current?.('meeting_added', `Scheduled meeting: ${newMeeting.title}`, newMeeting.id, 'meeting');
    return newMeeting;
  }, [setMeetings]);

  // Store addMeeting in ref
  useEffect(() => {
    addTaskRef.current = addTask;
  }, [addTask]);

  /**
   * Update an existing meeting
   * @param {string} id - Meeting ID
   * @param {Object} updates - Partial meeting data to update
   * @returns {Object|null} Updated meeting or null if not found
   */
  const updateMeeting = useCallback((id, updates) => {
    let updatedMeeting = null;
    setMeetings(prev => {
      const index = prev.findIndex(m => m.id === id);
      if (index === -1) return prev;
      updatedMeeting = { ...prev[index], ...updates };
      const newMeetings = [...prev];
      newMeetings[index] = updatedMeeting;
      return newMeetings;
    });
    if (updatedMeeting) {
      addActivityRef.current?.('meeting_updated', `Updated meeting: ${updatedMeeting.title}`, id, 'meeting');
    }
    return updatedMeeting;
  }, [setMeetings]);

  /**
   * Delete a meeting
   * @param {string} id - Meeting ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteMeeting = useCallback((id) => {
    const meeting = meetings.find(m => m.id === id);
    if (!meeting) return false;

    setMeetings(prev => prev.filter(m => m.id !== id));
    addActivityRef.current?.('meeting_deleted', `Deleted meeting: ${meeting.title}`, id, 'meeting');
    return true;
  }, [meetings, setMeetings]);

  // Context value
  const value = {
    // State
    contacts,
    setContacts,
    deals,
    setDeals,
    tasks,
    setTasks,
    activities,
    setActivities,
    contactActivities,
    setContactActivities,
    invoices,
    setInvoices,
    meetings,
    setMeetings,
    
    // Contact helpers
    addContact,
    updateContact,
    deleteContact,
    
    // Deal helpers
    addDeal,
    updateDeal,
    deleteDeal,
    moveDealStage,
    
    // Task helpers
    addTask,
    updateTask,
    deleteTask,
    toggleTaskDone,
    
    // Invoice helpers
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markInvoicePaid,
    
    // System Activity helper
    addActivity,
    
    // Contact Activity helpers (email, call, note, meeting)
    addContactActivity,
    updateContactActivity,
    deleteContactActivity,
    
    // Meeting helpers
    addMeeting,
    updateMeeting,
    deleteMeeting
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
