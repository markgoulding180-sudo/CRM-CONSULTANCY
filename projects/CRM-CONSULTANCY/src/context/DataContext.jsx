/**
 * DataContext - Central state management for CRM application
 * Provides contacts, deals, tasks, and activities with CRUD operations
 * All data is persisted to localStorage
 */

import React, { createContext, useContext, useCallback } from 'react';
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

  /**
   * Add a new activity log entry
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
    addActivity('contact_added', `Added contact: ${newContact.name}`, newContact.id, 'contact');
    return newContact;
  }, [setContacts, addActivity]);

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
      addActivity('contact_updated', `Updated contact: ${updatedContact.name}`, id, 'contact');
    }
    return updatedContact;
  }, [setContacts, addActivity]);

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
    
    addActivity('contact_deleted', `Deleted contact: ${contact.name}`, id, 'contact');
    return true;
  }, [contacts, setContacts, setDeals, setTasks, addActivity]);

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
    addActivity('deal_added', `Added deal: ${newDeal.name} (${newDeal.company})`, newDeal.id, 'deal');
    return newDeal;
  }, [setDeals, addActivity]);

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
      addActivity('deal_updated', `Updated deal: ${updatedDeal.name}`, id, 'deal');
    }
    return updatedDeal;
  }, [setDeals, addActivity]);

  /**
   * Delete a deal
   * @param {string} id - Deal ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteDeal = useCallback((id) => {
    const deal = deals.find(d => d.id === id);
    if (!deal) return false;

    setDeals(prev => prev.filter(d => d.id !== id));
    addActivity('deal_deleted', `Deleted deal: ${deal.name}`, id, 'deal');
    return true;
  }, [deals, setDeals, addActivity]);

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
      addActivity('deal_stage_changed', `Moved "${updatedDeal.name}" to ${newStage}`, id, 'deal');
    }
    return updatedDeal;
  }, [setDeals, addActivity]);

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
    addActivity('task_added', `Added task: ${newTask.description.substring(0, 50)}...`, newTask.id, 'task');
    return newTask;
  }, [setTasks, addActivity]);

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
      addActivity('task_updated', `Updated task: ${updatedTask.description.substring(0, 50)}...`, id, 'task');
    }
    return updatedTask;
  }, [setTasks, addActivity]);

  /**
   * Delete a task
   * @param {string} id - Task ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;

    setTasks(prev => prev.filter(t => t.id !== id));
    addActivity('task_deleted', `Deleted task: ${task.description.substring(0, 50)}...`, id, 'task');
    return true;
  }, [tasks, setTasks, addActivity]);

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
      addActivity('task_toggled', `${action === 'completed' ? 'Completed' : 'Reopened'} task: ${updatedTask.description.substring(0, 50)}...`, id, 'task');
    }
    return updatedTask;
  }, [setTasks, addActivity]);

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
    
    // Activity helper
    addActivity
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
