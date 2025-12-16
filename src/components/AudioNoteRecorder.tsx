import { useState } from 'react';
import { Mic, Pause, Play, Trash2, Volume2, FileText, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioNote } from '../types';
import Tooltip from './Tooltip';

interface AudioNoteRecorderProps {
  audioNotes?: AudioNote[];
  onAddNote?: (note: AudioNote) => void;
  onDeleteNote?: (noteId: string) => void;
}

export default function AudioNoteRecorder({ audioNotes = [], onAddNote, onDeleteNote }: AudioNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  // Mock recording functionality (will be replaced with actual recording later)
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    // In production, this would start actual audio recording
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In production, this would stop recording and save the audio file
    // For now, we'll just reset the duration
    setRecordingDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isRecording ? 'bg-red-100' : 'bg-[#0061FF]/10'
            }`}>
              <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600' : 'text-[#0061FF]'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-900">
                {isRecording ? 'Recording...' : 'Record Audio Note'}
              </p>
              {isRecording && (
                <p className="text-xs text-gray-500">
                  {formatDuration(recordingDuration)}
                </p>
              )}
            </div>
          </div>
          
          {!isRecording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartRecording}
              className="px-4 py-2 bg-[#0061FF] hover:bg-[#0052D6] text-white rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              Start
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStopRecording}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Stop & Save
            </motion.button>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 flex items-start gap-2">
          <p className="text-xs text-gray-600 flex-1">
            Auto-transcribed using AI for easy review.
          </p>
          <Tooltip 
            content="Speak clearly about your impressions, concerns, or key takeaways from the interview. Notes are automatically transcribed for easy reference."
            position="top"
            width="standard"
          >
            <div className="text-gray-400 hover:text-gray-600 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Existing Audio Notes */}
      {audioNotes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm text-gray-700">Recorded Notes ({audioNotes.length})</h4>
          
          {audioNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Audio Player Header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Audio Note</p>
                      <p className="text-xs text-gray-500">{formatTimestamp(note.timestamp)}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDuration(note.duration)}</span>
                  </div>
                  
                  {onDeleteNote && (
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>
                  )}
                </div>

                {/* Mock Audio Player Controls */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0061FF] hover:bg-[#0052D6] transition-colors"
                  >
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </motion.button>
                  
                  {/* Progress Bar */}
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 cursor-pointer">
                    <div 
                      className="bg-[#0061FF] h-1.5 rounded-full"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>

                {/* Transcript Toggle */}
                {note.transcript && (
                  <button
                    onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                    className="mt-3 w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">
                        {expandedNoteId === note.id ? 'Hide' : 'View'} AI Transcript
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Auto-generated</span>
                  </button>
                )}
              </div>

              {/* Transcript Content */}
              <AnimatePresence>
                {expandedNoteId === note.id && note.transcript && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200 bg-gray-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-600">AI-Generated Transcript</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {note.transcript}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}