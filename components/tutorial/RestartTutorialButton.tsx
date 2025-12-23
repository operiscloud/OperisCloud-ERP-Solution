'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import TutorialModal from './TutorialModal';

export default function RestartTutorialButton() {
  const [showTutorial, setShowTutorial] = useState(false);

  const handleComplete = async () => {
    // Don't update the database when manually restarting the tutorial
    // Just close the modal
    setShowTutorial(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowTutorial(true)}
        className="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Relancer le tutoriel"
      >
        <span className="sr-only">Relancer le tutoriel</span>
        <BookOpen className="h-6 w-6" />
      </button>

      {showTutorial && <TutorialModal onComplete={handleComplete} />}
    </>
  );
}
