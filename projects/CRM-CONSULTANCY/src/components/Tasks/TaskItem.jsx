import { Check, Calendar, AlertCircle, Trash2, Pencil } from 'lucide-react';
import Badge from '../UI/Badge';

export default function TaskItem({ task, contact, onToggle, onEdit, onDelete }) {
  const isDone = task.done;
  
  // Check if overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < today && !isDone;
  
  // Priority badge variant mapping
  const priorityVariant = {
    'High': 'high',
    'Medium': 'prospect',
    'Low': 'customer'
  };
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
        isOverdue 
          ? 'bg-red-50 border-red-300' 
          : isDone 
            ? 'bg-slate-50 border-slate-200' 
            : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
          isDone 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-slate-300 hover:border-blue-400 bg-white'
        }`}
        aria-label={isDone ? 'Mark as undone' : 'Mark as done'}
      >
        {isDone && <Check size={14} />}
      </button>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
          {task.description}
        </p>
        
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {/* Due Date */}
          <span className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
            <Calendar size={14} />
            {formatDate(task.dueDate)}
            {isOverdue && <AlertCircle size={14} className="ml-1" />}
          </span>
          
          {/* Priority Badge */}
          <Badge variant={priorityVariant[task.priority] || 'low'}>
            {task.priority}
          </Badge>
          
          {/* Linked Contact */}
          {contact && (
            <span className="text-sm text-slate-500">
              • {contact.name}
            </span>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Edit task"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
