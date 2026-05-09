import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Calendar, Percent, GripVertical } from 'lucide-react';

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

export default function DealCard({ deal, onClick }) {
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
