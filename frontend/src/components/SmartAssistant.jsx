import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { auth } from '../config/firebase';
import api from '../lib/api';

// Conversation flow steps  
const STEPS = {
  GREETING: 'greeting',
  EVENT_TYPE: 'eventType',
  EVENT_TITLE: 'eventTitle',
  AUDIENCE_SIZE: 'audienceSize',
  SUGGEST_AUDITORIUM: 'suggestAuditorium',
  CONFIRM_AUDITORIUM: 'confirmAuditorium',
  DATE: 'date',
  TIME: 'time',
  CHECK_AVAILABILITY: 'checkAvailability',
  SUMMARY: 'summary',
  COMPLETE: 'complete'
};

// Event type options
const EVENT_TYPES = [
  { id: 'seminar', label: 'Seminar', icon: '���' },
  { id: 'lecture', label: 'Lecture', icon: '���' },
  { id: 'club-meeting', label: 'Club Meeting', icon: '���' },
  { id: 'workshop', label: 'Workshop', icon: '���' },
  { id: 'others', label: 'Others', icon: '✨' }
];

// Auditorium database
const AUDITORIUMS = [
  { id: 'mini-hall', name: 'Mini Hall', capacity: 100, description: 'Cozy space for intimate gatherings' },
  { id: 'main-auditorium', name: 'Main Auditorium', capacity: 300, description: 'Our flagship venue' },
  { id: 'convention-hall', name: 'Convention Hall', capacity: 500, description: 'Large-scale events' },
  { id: 'seminar-room-1', name: 'Seminar Room 1', capacity: 50, description: 'Perfect for small groups' }
];

export default function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.GREETING);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const messagesEndRef = useRef(null);

  // Booking data collection
  const [bookingData, setBookingData] = useState({
    eventType: '',
    eventTitle: '',
    audienceSize: 0,
    suggestedAuditorium: null,
    auditoriumId: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation when opened
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const initConversation = () => {
      setTimeout(() => {
        addBotMessage("Hi there 👋 I'm your Smart Booking Assistant. Let's help you book an auditorium!", STEPS.GREETING);
        setTimeout(() => {
          setCurrentStep(STEPS.EVENT_TYPE);
          addBotMessage("What type of event are you planning?", STEPS.EVENT_TYPE, EVENT_TYPES);
        }, 1000);
      }, 300);
    };

    if (isOpen && messages.length === 0) {
      initConversation();
    }
  }, [isOpen]);  // Intentionally limited dependencies

  // Add message to chat
  const addMessage = (text, sender, step = null, options = null, data = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      text,
      sender, // 'bot' or 'user'
      step,
      options,
      data,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Bot message with typing animation
  const addBotMessage = (text, step = null, options = null, data = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(text, 'bot', step, options, data);
      if (options) {
        setAwaitingInput(true);
      }
    }, 800 + Math.random() * 400); // Simulate typing
  };

  // User message
  const addUserMessage = (text) => {
    addMessage(text, 'user');
    setAwaitingInput(false);
  };

  // Handle option button click
  const handleOptionClick = (option) => {
    if (!awaitingInput) return;

    switch (currentStep) {
      case STEPS.EVENT_TYPE:
        addUserMessage(option.label);
        setBookingData(prev => ({ ...prev, eventType: option.id }));
        setTimeout(() => {
          setCurrentStep(STEPS.EVENT_TITLE);
          addBotMessage("Great! What should we call your event?", STEPS.EVENT_TITLE);
          setAwaitingInput(true);
        }, 500);
        break;

      case STEPS.CONFIRM_AUDITORIUM:
        addUserMessage(option.label);
        if (option.id === 'yes') {
          setBookingData(prev => ({ 
            ...prev, 
            auditoriumId: prev.suggestedAuditorium.id 
          }));
          setTimeout(() => {
            setCurrentStep(STEPS.DATE);
            addBotMessage("On which date would you like to host your event? (YYYY-MM-DD)", STEPS.DATE);
            setAwaitingInput(true);
          }, 500);
        } else {
          // Show all auditoriums to choose from
          setTimeout(() => {
            addBotMessage("No problem! Here are all available auditoriums:", null, AUDITORIUMS.map(aud => ({
              id: aud.id,
              label: `${aud.name} (${aud.capacity} seats)`,
              data: aud
            })));
            setCurrentStep(STEPS.DATE); // Will set auditorium when selected
          }, 500);
        }
        break;

      default:
        if (option.data) {
          // Selecting a specific auditorium
          addUserMessage(option.label);
          setBookingData(prev => ({ ...prev, auditoriumId: option.id }));
          setTimeout(() => {
            setCurrentStep(STEPS.DATE);
            addBotMessage("On which date would you like to host your event? (YYYY-MM-DD)", STEPS.DATE);
            setAwaitingInput(true);
          }, 500);
        }
    }
  };

  // Handle text input submission
  const handleTextSubmit = (e) => {
    e?.preventDefault();
    if (!awaitingInput) return;

    const input = e?.target?.textInput?.value || bookingData.textInput;
    if (!input?.trim()) return;

    addUserMessage(input);

    switch (currentStep) {
      case STEPS.EVENT_TITLE:
        setBookingData(prev => ({ ...prev, eventTitle: input }));
        setTimeout(() => {
          setCurrentStep(STEPS.AUDIENCE_SIZE);
          addBotMessage("How many people are expected to attend?", STEPS.AUDIENCE_SIZE);
          setAwaitingInput(true);
        }, 500);
        break;

      case STEPS.AUDIENCE_SIZE: {
        const size = parseInt(input);
        if (isNaN(size) || size <= 0) {
          addBotMessage("Please enter a valid number of attendees.", STEPS.AUDIENCE_SIZE);
          setAwaitingInput(true);
          return;
        }
        setBookingData(prev => ({ ...prev, audienceSize: size }));
        
        // Suggest auditorium based on size
        const suggested = suggestAuditorium(size);
        setBookingData(prev => ({ ...prev, suggestedAuditorium: suggested }));
        
        setTimeout(() => {
          setCurrentStep(STEPS.SUGGEST_AUDITORIUM);
          addBotMessage(
            `Based on your audience size of ${size}, I recommend the ${suggested.name} (capacity: ${suggested.capacity}). ${suggested.description}`,
            STEPS.SUGGEST_AUDITORIUM
          );
          setTimeout(() => {
            setCurrentStep(STEPS.CONFIRM_AUDITORIUM);
            addBotMessage("Shall I book that for you?", STEPS.CONFIRM_AUDITORIUM, [
              { id: 'yes', label: 'Yes, sounds perfect!' },
              { id: 'no', label: 'Show me other options' }
            ]);
          }, 1000);
        }, 500);
        break;
      }

      case STEPS.DATE:
        if (!isValidDate(input)) {
          addBotMessage("Please enter a valid future date in YYYY-MM-DD format (e.g., 2025-11-25).", STEPS.DATE);
          setAwaitingInput(true);
          return;
        }
        setBookingData(prev => ({ ...prev, date: input }));
        setTimeout(() => {
          setCurrentStep(STEPS.TIME);
          addBotMessage("What time should the event start? (24-hour format, e.g., 09:00 or 14:30)", STEPS.TIME);
          setAwaitingInput(true);
        }, 500);
        break;

      case STEPS.TIME:
        // Check if it's start or end time
        if (!bookingData.startTime) {
          if (!isValidTime(input)) {
            addBotMessage("Please enter a valid time in 24-hour format (HH:MM). Examples: 09:00, 14:30, 18:45", STEPS.TIME);
            setAwaitingInput(true);
            return;
          }
          setBookingData(prev => ({ ...prev, startTime: input }));
          setTimeout(() => {
            addBotMessage("And what time will it end? (24-hour format, HH:MM)", STEPS.TIME);
            setAwaitingInput(true);
          }, 500);
        } else {
          if (!isValidTime(input)) {
            addBotMessage("Please enter a valid time in 24-hour format (HH:MM). Examples: 09:00, 14:30, 18:45", STEPS.TIME);
            setAwaitingInput(true);
            return;
          }
          if (!isValidTimeRange(bookingData.startTime, input)) {
            addBotMessage("End time must be after start time. Please enter a valid end time.", STEPS.TIME);
            setAwaitingInput(true);
            return;
          }
          setBookingData(prev => ({ ...prev, endTime: input }));
          
          // Check availability
          setTimeout(() => {
            setCurrentStep(STEPS.CHECK_AVAILABILITY);
            checkAvailability();
          }, 500);
        }
        break;

      default:
        break;
    }

    // Clear input
    if (e?.target?.textInput) {
      e.target.textInput.value = '';
    }
  };

  // Suggest auditorium based on audience size
  const suggestAuditorium = (size) => {
    if (size <= 50) return AUDITORIUMS.find(a => a.id === 'seminar-room-1');
    if (size <= 100) return AUDITORIUMS.find(a => a.id === 'mini-hall');
    if (size <= 300) return AUDITORIUMS.find(a => a.id === 'main-auditorium');
    return AUDITORIUMS.find(a => a.id === 'convention-hall');
  };

  // Validate date (must be future)
  const isValidDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date >= today && !isNaN(date.getTime());
  };

  // Validate time format (24-hour clock: 00:00 to 23:59)
  const isValidTime = (timeStr) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(timeStr);
  };

  // Validate time range
  const isValidTimeRange = (start, end) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    return endMins > startMins;
  };

  // Check availability with backend
  const checkAvailability = async () => {
    addBotMessage("��� Checking availability...", STEPS.CHECK_AVAILABILITY);
    
    try {
      const { auditoriumId, date, startTime, endTime } = bookingData;
      const response = await api.get('/bookings/checkAvailability', {
        params: { auditoriumId, date, startTime, endTime }
      });

      setTimeout(() => {
        if (response.data.available) {
          addBotMessage("✅ Perfect! The auditorium is free during that time.", null);
          setTimeout(() => {
            showSummary();
          }, 800);
        } else {
          addBotMessage(
            "⚠️ Sorry, that time slot is already booked. Please try a different time.",
            STEPS.TIME
          );
          // Reset times and ask again
          setBookingData(prev => ({ ...prev, startTime: '', endTime: '' }));
          setTimeout(() => {
            addBotMessage("What time should the event start? (HH:MM)", STEPS.TIME);
            setAwaitingInput(true);
          }, 1000);
        }
      }, 1000);
    } catch (error) {
      console.error('Availability check error:', error);
      addBotMessage("⚠️ Couldn't check availability. Please try again or contact support.", null);
      setTimeout(() => {
        showSummary(); // Proceed anyway for demo purposes
      }, 1000);
    }
  };

  // Show booking summary
  const showSummary = () => {
    setCurrentStep(STEPS.SUMMARY);
    
    const eventTypeLabel = EVENT_TYPES.find(t => t.id === bookingData.eventType)?.label || bookingData.eventType;
    const auditorium = AUDITORIUMS.find(a => a.id === bookingData.auditoriumId);
    
    const summaryData = {
      eventTitle: bookingData.eventTitle,
      eventType: eventTypeLabel,
      auditorium: auditorium?.name || 'N/A',
      date: bookingData.date,
      time: `${bookingData.startTime} - ${bookingData.endTime}`,
      audienceSize: bookingData.audienceSize
    };

    addBotMessage("��� Here's your booking summary:", STEPS.SUMMARY, null, summaryData);
    
    setTimeout(() => {
      addBotMessage("Would you like to confirm this booking?", STEPS.SUMMARY, [
        { id: 'confirm', label: '✅ Confirm Booking' },
        { id: 'restart', label: '��� Start Over' }
      ]);
    }, 800);
  };

  // Handle summary action
  const handleSummaryAction = async (actionId) => {
    if (actionId === 'restart') {
      restartConversation();
      return;
    }

    if (actionId === 'confirm') {
      addUserMessage('✅ Confirm Booking');
      addBotMessage("⏳ Submitting your booking request...", null);
      
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Please log in to create a booking');
        }

        const eventTypeLabel = EVENT_TYPES.find(t => t.id === bookingData.eventType)?.label || 'Event';

        await api.post('/bookings', {
          eventTitle: bookingData.eventTitle,
          eventType: eventTypeLabel,
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          auditoriumId: bookingData.auditoriumId,
          expectedAudience: bookingData.audienceSize,
          description: 'Booked via Smart Assistant'
        });

        setTimeout(() => {
          setCurrentStep(STEPS.COMPLETE);
          addBotMessage("��� Success! Your booking request has been submitted for approval.", STEPS.COMPLETE);
          setTimeout(() => {
            addBotMessage("You'll receive a notification once an admin reviews your request. Thank you! ���", null);
            setTimeout(() => {
              setAwaitingInput(false);
              toast.success('Booking submitted successfully!');
            }, 1000);
          }, 1000);
        }, 1500);

      } catch (error) {
        console.error('Booking submission error:', error);
        const errorMsg = error.response?.data?.message || 'Failed to submit booking';
        addBotMessage(`❌ Error: ${errorMsg}. Please try again or use the manual booking form.`, null);
        toast.error(errorMsg);
      }
    }
  };

  // Restart conversation
  const restartConversation = () => {
    setMessages([]);
    setCurrentStep(STEPS.GREETING);
    setBookingData({
      eventType: '',
      eventTitle: '',
      audienceSize: 0,
      suggestedAuditorium: null,
      auditoriumId: '',
      date: '',
      startTime: '',
      endTime: ''
    });
    setAwaitingInput(false);
    
    setTimeout(() => {
      addBotMessage("Let's start fresh! ���", STEPS.GREETING);
      setTimeout(() => {
        setCurrentStep(STEPS.EVENT_TYPE);
        addBotMessage("What type of event are you planning?", STEPS.EVENT_TYPE, EVENT_TYPES);
      }, 800);
    }, 300);
  };

  return (
    <div className="relative">
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-green-900/50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                  ���
                </div>
                <div>
                  <h3 className="text-white font-bold">Smart Assistant</h3>
                  <p className="text-green-100 text-xs">Here to help you book</p>
                </div>
              </div>
              <button
                onClick={restartConversation}
                className="text-white/80 hover:text-white transition-colors"
                title="Restart conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gray-700 text-white ml-auto'
                        : 'bg-gradient-to-r from-green-600 to-emerald-700 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    
                    {/* Summary Card */}
                    {message.data && message.step === STEPS.SUMMARY && (
                      <div className="mt-3 p-3 bg-black/30 rounded-lg space-y-2 text-xs">
                        <div><strong>Event:</strong> {message.data.eventTitle}</div>
                        <div><strong>Type:</strong> {message.data.eventType}</div>
                        <div><strong>Auditorium:</strong> {message.data.auditorium}</div>
                        <div><strong>Date:</strong> {message.data.date}</div>
                        <div><strong>Time:</strong> {message.data.time}</div>
                        <div><strong>Expected Audience:</strong> {message.data.audienceSize}</div>
                      </div>
                    )}
                    
                    {/* Option Buttons */}
                    {message.options && message.sender === 'bot' && awaitingInput && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => message.step === STEPS.SUMMARY 
                              ? handleSummaryAction(option.id) 
                              : handleOptionClick(option)}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all hover:scale-105"
                          >
                            {option.icon && <span className="mr-1">{option.icon}</span>}
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {awaitingInput && !messages[messages.length - 1]?.options && (
              <form onSubmit={handleTextSubmit} className="p-4 border-t border-green-900/30">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="textInput"
                    placeholder="Type your answer..."
                    autoComplete="off"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
