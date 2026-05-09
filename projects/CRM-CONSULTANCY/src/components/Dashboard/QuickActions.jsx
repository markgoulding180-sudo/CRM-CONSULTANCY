import { Plus, Users, Briefcase, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';

export default function QuickActions({ onAddContact, onAddDeal, onAddTask }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
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
