import { Plus, Users, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export default function QuickActions({ onAddContact, onAddDeal, onAddTask }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button
          onClick={onAddContact}
          className="w-full justify-start space-x-2"
          variant="outline"
        >
          <Users className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
        <Button
          onClick={onAddDeal}
          className="w-full justify-start space-x-2"
          variant="outline"
        >
          <Briefcase className="w-4 h-4" />
          <span>Add Deal</span>
        </Button>
        <Button
          onClick={onAddTask}
          className="w-full justify-start space-x-2"
          variant="outline"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  );
}
