import { ClipboardList } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({ 
  tasks, 
  contacts, 
  filter, 
  onToggle, 
  onEdit, 
  onDelete 
}) {
  // Get contact name by ID
  const getContact = (contactId) => {
    return contacts.find(c => c.id === contactId);
  };
  
  // Filter tasks based on current filter
  const getFilteredTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case 'today':
        return tasks.filter(task => {
          if (task.done) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate <= today;
        });
        
      case 'upcoming':
        return tasks.filter(task => {
          if (task.done) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate > today;
        });
        
      case 'done':
        return tasks.filter(task => task.done);
        
      case 'all':
      default:
        return tasks;
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  // Sort tasks: undone first, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Done tasks go to bottom
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }
    // Then sort by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  
  // Empty state
  if (sortedTasks.length === 0) {
    const emptyMessages = {
      all: 'No tasks yet. Create your first task to get started!',
      today: 'No tasks due today. Great job staying on top of things!',
      upcoming: 'No upcoming tasks. Time to plan ahead?',
      done: 'No completed tasks yet. Keep working!'
    };
    
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ClipboardList size={32} className="text-slate-400" />
        </div>
        <p className="text-slate-500 max-w-sm">
          {emptyMessages[filter] || emptyMessages.all}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {sortedTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          contact={getContact(task.contactId)}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
