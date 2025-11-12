import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
// eslint-disable-next-line no-unused-vars
import { auth } from '../config/firebase';
import { format } from 'date-fns';
import api from '../lib/api';

const auditoriums = [
  { id: 'aud1', name: 'Main Auditorium', capacity: 500 },
  { id: 'aud2', name: 'Seminar Hall A', capacity: 150 },
  { id: 'aud3', name: 'Seminar Hall B', capacity: 100 },
  { id: 'aud4', name: 'Conference Room', capacity: 50 },
];

const eventTypes = ['Seminar', 'Workshop', 'Club Event', 'Lecture', 'Cultural Event', 'Tech Talk', 'Conference'];
const seatingLayouts = ['Theater', 'Classroom', 'U-Shape', 'Banquet', 'Conference'];
const avRequirements = ['Projector', 'Microphone', 'Sound System', 'Lighting', 'Video Recording', 'Live Streaming'];

const step1Schema = yup.object({
  title: yup.string().required('Event title is required').min(5, 'Title must be at least 5 characters'),
  eventType: yup.string().required('Event type is required'),
  audienceSize: yup.number().required('Audience size is required').min(10, 'Minimum 10 attendees').max(1000, 'Maximum 1000 attendees'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
});

export default function BookingForm({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    eventType: '',
    audienceSize: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    auditorium: '',
    seatingLayout: '',
    avRequirements: [],
  });
  const [loading, setLoading] = useState(false);

  const { register: register1, handleSubmit: handleSubmit1, formState: { errors: errors1 } } = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: formData
  });

  // Returns an object { available: boolean, conflicts: Array }
  const checkAvailability = async (date, startTime, endTime, auditoriumId) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');

      const response = await api.get('/bookings/checkAvailability', {
        params: {
          auditoriumId,
          date: dateStr,
          startTime,
          endTime
        }
      });

      return {
        available: response.data.available,
        conflicts: response.data.conflicts || []
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      if (error.response?.data?.conflicts) {
        const conflicts = error.response.data.conflicts;
        const conflictTimes = conflicts.map(c => `${c.startTime}-${c.endTime}`).join(', ');
        // Show a user-friendly hint about conflicting slots
        toast.warning(`Time slot conflicts with existing bookings: ${conflictTimes}`);
        return { available: false, conflicts };
      }
      // If the check itself failed for another reason (network, server), return unavailable with empty conflicts
      return { available: false, conflicts: [] };
    }
  };

  const validateTimeSlot = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffHours = (end - start) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 8;
  };

  const onStep1Submit = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const onStep2Submit = async (data) => {
    if (!validateTimeSlot(data.startTime, data.endTime)) {
      toast.error('Event duration must be between 0 and 8 hours');
      return;
    }
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const onStep3Submit = (data) => {
    setFormData({ ...formData, ...data });
    setStep(4);
  };

  const onFinalSubmit = async () => {
    setLoading(true);
    
    try {
      // Check availability first. The helper now returns { available, conflicts }
      const availability = await checkAvailability(
        formData.date,
        formData.startTime,
        formData.endTime,
        formData.auditorium
      );

      if (!availability.available) {
        // If conflicts were returned, send user to auditorium selection so they can try another room,
        // otherwise send them back to date/time selection to pick a different slot.
        if (availability.conflicts && availability.conflicts.length > 0) {
          toast.error('Selected auditorium is unavailable for the chosen time. Please pick a different auditorium or time.');
          setStep(3);
        } else {
          toast.error('This time slot is already booked or could not be verified. Please choose another time.');
          setStep(2);
        }
        setLoading(false);
        return;
      }

      // Create booking via backend API
      await api.post('/bookings', {
        eventTitle: formData.title,
        eventType: formData.eventType,
        date: format(formData.date, 'yyyy-MM-dd'),
        startTime: formData.startTime,
        endTime: formData.endTime,
        auditoriumId: formData.auditorium,
        expectedAudience: parseInt(formData.audienceSize),
        description: formData.description || ''
      });

      toast.success('Booking request submitted successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create booking. Please try again.';
      toast.error(errorMessage);
      
      if (error.response?.status === 409) {
        // Conflict - show alternatives if available
        setStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleSubmit1(onStep1Submit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
        <input
          {...register1('title')}
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
          placeholder="e.g., Annual Tech Conference 2024"
        />
        {errors1.title && <p className="mt-2 text-sm text-red-400">{errors1.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Event Type *</label>
        <select
          {...register1('eventType')}
          value={formData.eventType}
          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white"
        >
          <option value="">Select event type</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors1.eventType && <p className="mt-2 text-sm text-red-400">{errors1.eventType.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Expected Audience Size *</label>
        <input
          {...register1('audienceSize')}
          type="number"
          value={formData.audienceSize}
          onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
          placeholder="Number of attendees"
        />
        {errors1.audienceSize && <p className="mt-2 text-sm text-red-400">{errors1.audienceSize.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Event Description *</label>
        <textarea
          {...register1('description')}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
          placeholder="Describe your event..."
        />
        {errors1.description && <p className="mt-2 text-sm text-red-400">{errors1.description.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Next: Date & Time
      </button>
    </form>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Event Date *</label>
        <DatePicker
          selected={formData.date}
          onChange={(date) => setFormData({ ...formData, date })}
          minDate={new Date()}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Start Time *</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">End Time *</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onStep2Submit(formData)}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Next: Auditorium
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Auditorium *</label>
        <div className="grid grid-cols-1 gap-3">
          {auditoriums.map(aud => (
            <motion.div
              key={aud.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setFormData({ ...formData, auditorium: aud.id })}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.auditorium === aud.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700 bg-gray-900/50 hover:border-green-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{aud.name}</h4>
                  <p className="text-sm text-gray-400">Capacity: {aud.capacity} people</p>
                </div>
                {formData.auditorium === aud.id && (
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Seating Layout</label>
        <select
          value={formData.seatingLayout}
          onChange={(e) => setFormData({ ...formData, seatingLayout: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white"
        >
          <option value="">Select layout</option>
          {seatingLayouts.map(layout => (
            <option key={layout} value={layout}>{layout}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">AV Requirements</label>
        <div className="grid grid-cols-2 gap-2">
          {avRequirements.map(req => (
            <label key={req} className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-green-500/50 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={formData.avRequirements.includes(req)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...formData.avRequirements, req]
                    : formData.avRequirements.filter(r => r !== req);
                  setFormData({ ...formData, avRequirements: updated });
                }}
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-300">{req}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onStep3Submit(formData)}
          disabled={!formData.auditorium}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Booking
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const selectedAud = auditoriums.find(a => a.id === formData.auditorium);
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold text-green-400 mb-4">Review Your Booking</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Event Title</p>
              <p className="text-white font-medium">{formData.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Event Type</p>
              <p className="text-white font-medium">{formData.eventType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Audience Size</p>
              <p className="text-white font-medium">{formData.audienceSize} people</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="text-white font-medium">{format(formData.date, 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p className="text-white font-medium">{formData.startTime} - {formData.endTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Auditorium</p>
              <p className="text-white font-medium">{selectedAud?.name}</p>
            </div>
            {formData.seatingLayout && (
              <div>
                <p className="text-sm text-gray-400">Seating Layout</p>
                <p className="text-white font-medium">{formData.seatingLayout}</p>
              </div>
            )}
            {formData.avRequirements.length > 0 && (
              <div className="col-span-2">
                <p className="text-sm text-gray-400 mb-2">AV Requirements</p>
                <div className="flex flex-wrap gap-2">
                  {formData.avRequirements.map(req => (
                    <span key={req} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-green-500/20 pt-4">
            <p className="text-sm text-gray-400">Description</p>
            <p className="text-white">{formData.description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep(3)}
            disabled={loading}
            className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onFinalSubmit}
            disabled={loading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Booking Request'
            )}
          </button>
        </div>
      </div>
    );
  };

  const steps = [
    { number: 1, title: 'Event Details', icon: '📝' },
    { number: 2, title: 'Date & Time', icon: '📅' },
    { number: 3, title: 'Auditorium', icon: '🏛️' },
    { number: 4, title: 'Review', icon: '✓' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-3xl bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-green-500/20 shadow-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-500/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            New Booking Request
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-black/30">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    step >= s.number ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-500'
                  } transition-all duration-300`}>
                    {s.icon}
                  </div>
                  <p className={`mt-2 text-xs font-medium ${
                    step >= s.number ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {s.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    step > s.number ? 'bg-green-500' : 'bg-gray-800'
                  } transition-all duration-300`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
