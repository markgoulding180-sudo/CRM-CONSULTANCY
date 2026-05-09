import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Calendar, Percent, GripVertical } from 'lucide-react';

// Stage color mapping for dark theme
const stageColors = {
  'Lead': 'from-slate-800/80 to-slate-900/80 border-slate-700/50',
  'Discovery': 'from-blue-900/60 to-blue-950/80 border-blue-700/50',
  'Proposal': 'from-amber-900/60 to-amber-950/80 border-amber-700/50',
  'Negotiation': 'from-purple-900/60 to-purple-950/80 border-purple-700/50',
  'Closed Won': 'from-emerald-900/60 to-emerald-950/80 border-emerald-700/50'
};

const stageHeaderColors = {
  'Lead': 'from-slate-700 to-slate-800',
  'Discovery': 'from-blue-600 to-blue-700',
  'Proposal': 'from-amber-600 to-amber-700',
  'Negotiation': 'from-purple-600 to-purple-700',
  'Closed Won': 'from-emerald-600 to-emerald-700'
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
  if (probability >= 80) return 'bg-emerald-500';
  if (probability >= 60) return 'bg-blue-500';
  if (probability >= 40) return 'bg-amber-500';
  return 'bg-slate-500';
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
      className="rounded-xl p-4 mb-3 cursor-pointer card-hover group animate-fade-in"
      style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Drag handle and title */}
      <div className="flex items-start gap-2 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-slate-500 hover:text-blue-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={16} />
        </button>
        <h4 className="font-semibold text-white text-sm leading-tight flex-1">
          {deal.name}
        </h4>
      </div>

      {/* Company */}
      <p className="text-xs text-slate-400 mb-3 ml-6">{deal.company}</p>

      {/* Deal details */}
      <div className="space-y-2 ml-6">
        {/* Value */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={14} className="text-blue-400" />
          <span className="font-medium text-blue-200">
            {formatCurrency(deal.value)}
          </span>
        </div>

        {/* Close date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-slate-300">{formatDate(deal.closeDate)}</span>
        </div>

        {/* Probability with visual indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Percent size={14} className="text-slate-400" />
          <div className="flex items-center gap-2 flex-1">
            <span className="text-slate-300 text-xs">{deal.probability}%</span>
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
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
      className={`flex-1 min-w-[280px] max-w-[320px] flex flex-col rounded-2xl border transition-all duration-300 ${
        isOver ? 'border-blue-400 ring-2 ring-blue-500/50 scale-[1.02]' : 'border-slate-700/50'
      }`}
      style={{
        background: `linear-gradient(180deg, ${stageHeaderColors[stage].includes('blue') ? 'rgba(30, 58, 138, 0.3)' : stageHeaderColors[stage].includes('amber') ? 'rgba(146, 64, 14, 0.3)' : stageHeaderColors[stage].includes('purple') ? 'rgba(107, 33, 168, 0.3)' : stageHeaderColors[stage].includes('emerald') ? 'rgba(6, 78, 59, 0.3)' : 'rgba(51, 65, 85, 0.3)'} 0%, rgba(15, 23, 42, 0.5) 100%)`,
      }}
    >
      {/* Column Header */}
      <div 
        className={`px-4 py-3 rounded-t-2xl bg-gradient-to-r ${stageHeaderColors[stage]}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{stage}</h3>
          <span 
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {deals.length}
          </span>
        </div>
        <div className="mt-1 text-sm font-medium text-white/80">
          {formatCurrency(totalValue)}
        </div>
      </div>

      {/* Deals List */}
      <div className="flex-1 p-3 min-h-[200px] overflow-y-auto max-h-[calc(100vh-320px)]">
        {deals.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
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
