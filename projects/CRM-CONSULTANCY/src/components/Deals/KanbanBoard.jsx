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

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped = {};
    STAGES.forEach(stage => {
      grouped[stage] = deals.filter(deal => deal.stage === stage);
    });
    return grouped;
  }, [deals]);

  // Sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const deal = deals.find(d => d.id === active.id);
    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id;
    const overId = over.id;

    // Check if dropped over a stage column
    if (STAGES.includes(overId)) {
      const deal = deals.find(d => d.id === dealId);
      if (deal && deal.stage !== overId) {
        moveDealStage(dealId, overId);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveDeal(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {STAGES.map(stage => (
          <SortableContext
            key={stage}
            items={dealsByStage[stage].map(d => d.id)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn
              stage={stage}
              deals={dealsByStage[stage]}
              onDrop={onEditDeal}
            />
          </SortableContext>
        ))}
      </div>

      {/* Drag Overlay - shows the card being dragged */}
      <DragOverlay>
        {activeDeal ? (
          <div className="opacity-90 rotate-2">
            <DealCard
              deal={activeDeal}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
