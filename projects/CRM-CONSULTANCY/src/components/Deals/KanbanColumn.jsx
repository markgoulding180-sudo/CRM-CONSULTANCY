import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Calendar, Percent, GripVertical } from 'lucide-react';

const STAGE_COLORS = {
  'Lead': { bg: 'rgba(51, 65, 85, 0.3)', header: '#334155', border: 'rgba(51, 65, 85, 0.5)' },
  'Discovery': { bg: 'rgba(30, 58, 138, 0.3)', header: '#1e40af', border: 'rgba(45, 126, 247, 0.4)' },
  'Proposal': { bg: 'rgba(146, 64, 14, 0.3)', header: '#b45309', border: 'rgba(245, 158, 11, 0.4)' },
  'Negotiation': { bg: 'rgba(107, 33, 168, 0.3)', header: '#7c3aed', border: 'rgba(139, 92, 246, 0.4)' },
  'Closed Won': { bg: 'rgba(6, 78, 59, 0.3)', header: '#059669', border: 'rgba(16, 185, 129, 0.4)' },
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getProbabilityColor = (probability) => {
  if (probability >= 80) return '#10b981';
  if (probability >= 60) return '#2d7ef7';
  if (probability >= 40) return '#f59e0b';
  return '#64748b';
};

// Deal Card Component
function DealCard({ deal, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: { deal }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="card"
      style={{
        ...style,
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        background: 'var(--bg-surface-2)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header with drag handle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          style={{ 
            padding: '4px', 
            color: 'var(--text-muted)', 
            cursor: 'grab',
            background: 'none',
            border: 'none',
            marginTop: '-4px',
            marginLeft: '-4px'
          }}
        >
          <GripVertical size={16} />
        </button>
        <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, flex: 1, lineHeight: 1.4 }}>
          {deal.name}
        </h4>
      </div>

      {/* Company */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '12px', paddingLeft: '20px' }}>
        {deal.company}
      </p>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px' }}>
        {/* Value */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>
            {formatCurrency(deal.value)}
          </span>
        </div>

        {/* Close date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            {formatDate(deal.closeDate)}
          </span>
        </div>

        {/* Probability */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Percent size={14} style={{ color: 'var(--text-muted)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', minWidth: '30px' }}>
              {deal.probability}%
            </span>
            <div style={{ flex: 1, height: '4px', background: 'var(--bg-surface-3)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${deal.probability}%`,
                  background: getProbabilityColor(deal.probability),
                  borderRadius: '2px',
                }}
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
  const { setNodeRef, isOver } = useDroppable({ id: stage, data: { stage } });
  const colors = STAGE_COLORS[stage] || STAGE_COLORS['Lead'];
  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '280px',
        minWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '14px',
        background: colors.bg,
        border: `1px solid ${isOver ? 'var(--accent)' : colors.border}`,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Column Header */}
      <div
        style={{
          padding: '16px',
          borderRadius: '14px 14px 0 0',
          background: colors.header,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{stage}</h3>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '2px 10px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
            }}
          >
            {deals.length}
          </span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500 }}>
          {formatCurrency(totalValue)}
        </div>
      </div>

      {/* Deals List */}
      <div
        style={{
          flex: 1,
          padding: '12px',
          minHeight: '100px',
          maxHeight: 'calc(100vh - 400px)',
          overflowY: 'auto',
        }}
      >
        {deals.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px',
              color: 'var(--text-muted)',
              fontSize: '13px',
              border: '2px dashed var(--border)',
              borderRadius: '10px',
            }}
          >
            Drop deals here
          </div>
        ) : (
          deals.map((deal) => <DealCard key={deal.id} deal={deal} onClick={() => onDrop(deal)} />)
        )}
      </div>
    </div>
  );
}
