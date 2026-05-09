import { Plus, Users, Briefcase, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';

export default function QuickActions({ onAddContact, onAddDeal, onAddTask }) {
  return (
    <div 
      className="rounded-2xl p-6 card-hover animate-card"
      style={{
        background: 'linear-gradient(145deg, rgba(30, 58, 95, 0.8) 0%, rgba(30, 64, 175, 0.6) 50%, rgba(30, 58, 138, 0.8) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button
          onClick={onAddContact}
          className="w-full flex items-center justify-center gap-2"
          variant="secondary"
        >
          <Users className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
        <Button
          onClick={onAddDeal}
          className="w-full flex items-center justify-center gap-2"
          variant="secondary"
        >
          <Briefcase className="w-4 h-4" />
          <span>Add Deal</span>
        </Button>
        <Button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2"
          variant="secondary"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  );
}
