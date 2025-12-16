import { useState } from 'react';
import { motion } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CompareView from './components/CompareView';
import { Assessment, SavedComparison } from './types';
import { mockCandidates } from './data/mockCandidates';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'compare'>('dashboard');
  const [assessments, setAssessments] = useState<Assessment[]>(mockCandidates);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [showNewAssessmentDrawer, setShowNewAssessmentDrawer] = useState(false);

  const handleNewAssessment = (candidateName: string, role?: string, links?: { linkedin?: string; github?: string; portfolio?: string; codepen?: string; }) => {
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      candidateName,
      role,
      date: new Date().toISOString().split('T')[0],
      notes: '',
      links,
      scores: {
        junior: {},
        mid: {},
        senior: {}
      }
    };
    // Add to assessments list and return the new assessment so Dashboard can open it in drawer
    setAssessments([newAssessment, ...assessments]);
    return newAssessment;
  };

  const handleNewAssessmentClick = () => {
    if (currentView === 'dashboard') {
      // Open drawer on dashboard
      setShowNewAssessmentDrawer(true);
    } else {
      // On other views, just open the drawer too
      setShowNewAssessmentDrawer(true);
    }
  };

  const handleSaveAssessment = (assessment: Assessment) => {
    const existingIndex = assessments.findIndex(a => a.id === assessment.id);
    if (existingIndex >= 0) {
      const updated = [...assessments];
      updated[existingIndex] = assessment;
      setAssessments(updated);
    } else {
      setAssessments([assessment, ...assessments]);
    }
  };

  const handleViewChange = (view: 'dashboard' | 'compare') => {
    setCurrentView(view);
  };

  const handleSaveComparison = (name: string) => {
    const newComparison: SavedComparison = {
      id: Date.now().toString(),
      name,
      assessmentIds: selectedForComparison,
      savedAt: new Date().toISOString().split('T')[0]
    };
    setSavedComparisons([newComparison, ...savedComparisons]);
    setSelectedForComparison([]);
  };

  const handleNewComparison = () => {
    // Navigate to comparison view
    setCurrentView('compare');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Toaster position="bottom-left" richColors />
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <TopBar 
        onNewAssessment={handleNewAssessmentClick} 
        onNewComparison={handleNewComparison}
      />
      
      <div className="ml-[240px] mt-16">
        {currentView === 'dashboard' && (
          <Dashboard
            assessments={assessments}
            onNewAssessment={handleNewAssessment}
            onSaveAssessment={handleSaveAssessment}
            selectedForComparison={selectedForComparison}
            showNewAssessmentDrawer={showNewAssessmentDrawer}
            onShowNewAssessmentDrawer={setShowNewAssessmentDrawer}
            onToggleComparison={(id) => {
              if (selectedForComparison.includes(id)) {
                setSelectedForComparison(selectedForComparison.filter(i => i !== id));
              } else if (selectedForComparison.length < 3) {
                setSelectedForComparison([...selectedForComparison, id]);
              }
            }}
            onSaveComparison={handleSaveComparison}
          />
        )}

        {currentView === 'compare' && (
          <CompareView
            assessments={assessments}
            selectedForComparison={selectedForComparison}
            onToggleComparison={(id) => {
              if (selectedForComparison.includes(id)) {
                setSelectedForComparison(selectedForComparison.filter(i => i !== id));
              } else if (selectedForComparison.length < 3) {
                setSelectedForComparison([...selectedForComparison, id]);
              }
            }}
            onSaveComparison={handleSaveComparison}
          />
        )}
      </div>
    </div>
  );
}