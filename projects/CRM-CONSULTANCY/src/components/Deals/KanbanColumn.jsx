import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Calendar, Percent, GripVertical } from 'lucide-react';

// Stage color mapping
const stageColors = {
  'Lead': 'bg-slate-100 border-slate-200',
  'Discovery': 'bg-blue-50 border-blue-200',
  'Proposal': 'bg-amber-50 border-amber-200',
  'Negotiation': 'bg-purple-50 border-purple-200',
  'Closed Won': 'bg-green-50 border-green-200'
};

const stageHeaderColors = {
  'Lead': 'bg-slate-200 text-slate-700',
  'Discovery': 'bg-blue-200 text-blue-800',
  'Proposal': 'bg-amber-200 text-amber-800',
  'Negotiation': 'bg-purple-200 text-purple-800',
  'Closed Won': 'bg-green-200 text-green-800'
};

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Get probability color
const getProbabilityColor = (probability) => {
  if (probability >= 80) return 'bg-green-500';
  if (probability >= 60) return 'bg-blue-500';
  if (probability >= 40) return 'bg-amber-500';
  return 'bg-slate-400';
};

// Deal Card Component
function DealCard({ deal, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: deal.id, data: { deal } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow group"
    >
      {/* Drag handle and title */}
      <div className="flex items-start gap-2 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={16} />
        </button>
        <h4 className="font-semibold text-slate-900 text-sm leading-tight flex-1">
          {deal.name}
        </h4>
      </div>

      {/* Company */}
      <p className="text-xs text-slate-500 mb-3 ml-6">{deal.company}</p>

      {/* Deal details */}
      <div className="space-y-2 ml-6">
        {/* Value */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={14} className="text-slate-400" />
          <span className="font-medium text-slate-700">
            {formatCurrency(deal.value)}
          </span>
        </div>

        {/* Close date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-slate-600">{formatDate(deal.closeDate)}</span>
        </div>

        {/* Probability with visual indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Percent size={14} className="text-slate-400" />
          <div className="flex items-center gap-2 flex-1">
            <span className="text-slate-600 text-xs">{deal.probability}%</span>
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getProbabilityColor(deal.probability)}`}
                style={{ width: `${deal.probability}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Kanban Column Component
export default function KanbanColumn({ stage, deals, onDrop }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { stage }
  });

  // Calculate total value
  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[260px] max-w-[350px] flex flex-col rounded-xl border-2 transition-colors ${
        stageColors[stage]
      } ${isOver ? 'border-blue-400 ring-2 ring-blue-200' : ''}`}
    >
      {/* Column Header */}
      <div className={`px-4 py-3 rounded-t-xl ${stageHeaderColors[stage]}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{stage}</h3>
          <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded-full">
            {deals.length}
          </span>
        </div>
        <div className="mt-1 text-sm font-medium opacity-80">
          {formatCurrency(totalValue)}
        </div>
      </div>

      {/* Deals List */}
      <div className="flex-1 p-3 min-h-[200px] overflow-y-auto max-h-[calc(100vh-280px)]">
        {deals.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            Drop deals here
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={() => onDrop(deal)}
            />
          ))
        )}
      </div>
    </div>
  );
}
