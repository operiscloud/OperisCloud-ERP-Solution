'use client';

import { useState } from 'react';
import TutorialModal from './TutorialModal';

interface TutorialWrapperProps {
  showTutorial: boolean;
}

export default function TutorialWrapper({ showTutorial }: TutorialWrapperProps) {
  const [isOpen, setIsOpen] = useState(showTutorial);

  const handleComplete = async () => {
    try {
      await fetch('/api/tutorial/complete', {
        method: 'POST',
      });
      setIsOpen(false);
      // Refresh the page to update the state
      window.location.reload();
    } catch (error) {
      console.error('Error completing tutorial:', error);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return <TutorialModal onComplete={handleComplete} />;
}
