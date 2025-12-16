import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Calendar, Trash2, Eye, ChevronRight } from 'lucide-react';
import { Assessment, SavedComparison } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ComparisonDrawer from './ComparisonDrawer';
import { toast } from 'sonner@2.0.3';

interface CompareViewProps {
  assessments: Assessment[];
  savedComparisons: SavedComparison[];
  selectedForComparison: string[];
  onToggleComparison: (id: string) => void;
  onSaveComparison: (name: string) => void;
  onDeleteComparison: (id: string) => void;
}

export default function CompareView({ 
  assessments,
  savedComparisons,
  selectedForComparison,
  onToggleComparison,
  onSaveComparison,
  onDeleteComparison 
}: CompareViewProps) {
  const [viewingComparison, setViewingComparison] = useState<SavedComparison | null>(null);

  const handleDeleteComparison = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    onDeleteComparison(id);
    toast.success(`Deleted comparison: ${name}`);
  };

  const handleViewComparison = (comparison: SavedComparison) => {
    setViewingComparison(comparison);
  };

  const getComparisonAssessments = (comparison: SavedComparison): Assessment[] => {
    return assessments.filter(a => comparison.assessmentIds.includes(a.id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">Saved Comparisons</h1>
            <p className="text-gray-600">View and manage your saved candidate comparisons</p>
          </div>

          {/* Comparisons Grid */}
          {savedComparisons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {savedComparisons.map((comparison, index) => {
                  const comparisonAssessments = getComparisonAssessments(comparison);
                  
                  return (
                    <motion.div
                      key={comparison.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleViewComparison(comparison)}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-2 group-hover:text-[#0061FF] transition-colors">
                            {comparison.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>{comparisonAssessments.length} {comparisonAssessments.length === 1 ? 'candidate' : 'candidates'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(comparison.savedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteComparison(e, comparison.id, comparison.name)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Candidate Avatars */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Candidates</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {comparisonAssessments.map(assessment => (
                            <div key={assessment.id} className="flex flex-col items-center gap-1.5">
                              {assessment.avatarUrl ? (
                                <ImageWithFallback
                                  src={assessment.avatarUrl}
                                  alt={assessment.candidateName}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0061FF] to-[#0047B3] flex items-center justify-center text-white text-xs">
                                  {assessment.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                              )}
                              <span className="text-xs text-gray-600 max-w-[60px] truncate">
                                {assessment.candidateName.split(' ')[0]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* View Button */}
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 text-sm text-[#0061FF] group-hover:text-[#0052D6] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Comparison</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2">No saved comparisons yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start by selecting candidates from the Home view and save your first comparison.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Comparison Drawer */}
      {viewingComparison && (
        <ComparisonDrawer
          assessments={getComparisonAssessments(viewingComparison)}
          onClose={() => setViewingComparison(null)}
          onSave={onSaveComparison}
        />
      )}
    </>
  );
}
