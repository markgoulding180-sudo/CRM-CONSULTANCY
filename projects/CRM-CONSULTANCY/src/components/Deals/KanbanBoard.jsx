import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import DealCard from './DealCard';
import { useData } from '../../context/DataContext';

const STAGES = ['Lead', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

export default function KanbanBoard({ onEditDeal }) {
  const { deals, moveDealStage } = useData();
  const [activeDeal, setActiveDeal] = useState(null);

  const dealsByStage = useMemo(() => {
    const grouped = {};
    STAGES.forEach(stage => {
      grouped[stage] = deals.filter(deal => deal.stage === stage);
    });
    return grouped;
  }, [deals]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const deal = deals.find(d => d.id === event.active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDeal(null);
    if (!over) return;
    if (STAGES.includes(over.id)) {
      const deal = deals.find(d => d.id === active.id);
      if (deal && deal.stage !== over.id) {
        moveDealStage(active.id, over.id);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDeal(null)}
    >
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', minHeight: '450px', paddingBottom: '8px' }}>
        {STAGES.map(stage => (
          <SortableContext
            key={stage}
            items={dealsByStage[stage].map(d => d.id)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn stage={stage} deals={dealsByStage[stage]} onDrop={onEditDeal} />
          </SortableContext>
        ))}
      </div>
      <DragOverlay>
        {activeDeal ? (
          <div style={{ transform: 'rotate(2deg)', opacity: 0.9 }}>
            <DealCard deal={activeDeal} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
