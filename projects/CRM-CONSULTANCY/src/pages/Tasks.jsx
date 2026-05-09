import { useState } from 'react';
import { Plus, Check, Calendar, Clock } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';

export default function Tasks() {
  const { tasks, contacts, addTask, updateTask, deleteTask, toggleTaskDone } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Filter counts
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const counts = {
    all: tasks.length,
    today: tasks.filter(t => {
      if (t.done) return false;
      const due = new Date(t.dueDate);
      return due <= today;
    }).length,
    upcoming: tasks.filter(t => {
      if (t.done) return false;
      const due = new Date(t.dueDate);
      return due > today;
    }).length,
    done: tasks.filter(t => t.done).length
  };
  
  // Filter options
  const filterOptions = [
    { key: 'all', label: 'All', icon: Check, count: counts.all },
    { key: 'today', label: 'Today', icon: Clock, count: counts.today },
    { key: 'upcoming', label: 'Upcoming', icon: Calendar, count: counts.upcoming },
    { key: 'done', label: 'Done', icon: Check, count: counts.done }
  ];
  
  const handleAddClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };
  
  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };
  
  const handleSubmit = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
  };
  
  const handleDeleteClick = (task) => {
    setDeleteConfirm(task);
  };
  
  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteTask(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus size={18} />
            Add Task
          </Button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                filter === key ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>
        
        {/* Task List */}
        <TaskList
          tasks={tasks}
          contacts={contacts}
          filter={filter}
          onToggle={toggleTaskDone}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>
      
      {/* Add/Edit Modal */}
      <TaskForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        task={editingTask}
        contacts={contacts}
      />
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 z-10 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Delete Task?</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.description}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
