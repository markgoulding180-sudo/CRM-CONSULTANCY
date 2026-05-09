import { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import UpcomingMeetings from '../components/Calendar/UpcomingMeetings';
import MeetingForm from '../components/Calendar/MeetingForm';
import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';

export default function Calendar() {
  const { meetings, contacts } = useData();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setEditingMeeting(null);
    setShowModal(true);
  };

  const handleNewMeeting = () => {
    setSelectedDate(new Date());
    setEditingMeeting(null);
    setShowModal(true);
  };

  const handleMeetingClick = (meeting) => {
    setEditingMeeting(meeting);
    setSelectedDate(new Date(meeting.date));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setEditingMeeting(null);
  };

  const modalTitle = editingMeeting ? 'Edit Meeting' : 'New Meeting';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <Button onClick={handleNewMeeting} className="flex items-center gap-2">
            <Plus size={18} />
            New Meeting
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <CalendarGrid
              meetings={meetings}
              contacts={contacts}
              onDayClick={handleDayClick}
              onMeetingClick={handleMeetingClick}
            />
          </div>

          {/* Upcoming Meetings Sidebar - Takes up 1 column */}
          <div className="lg:col-span-1">
            <UpcomingMeetings onMeetingClick={handleMeetingClick} />
          </div>
        </div>
      </div>

      {/* Meeting Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalTitle}
      >
        <MeetingForm
          onClose={handleCloseModal}
          initialDate={selectedDate}
          editMeeting={editingMeeting}
        />
      </Modal>
    </Layout>
  );
}
