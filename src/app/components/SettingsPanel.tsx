'use client';

import { useState, useEffect } from 'react';
import { AnswerMode } from '../utils/settings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [answerMode, setAnswerMode] = useState<AnswerMode>(AnswerMode.DETAILED);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          setAnswerMode(settings.answerMode);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answerMode }),
      });
      
      if (response.ok) {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => {
          onClose();
          setSaveMessage('');
        }, 1500);
      } else {
        setSaveMessage('Error saving settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Answer Mode</h3>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="answerMode"
                value={AnswerMode.DETAILED}
                checked={answerMode === AnswerMode.DETAILED}
                onChange={() => setAnswerMode(AnswerMode.DETAILED)}
                className="h-4 w-4"
              />
              <span>Detailed Explanation (Default)</span>
            </label>
            <p className="text-sm text-gray-500 ml-6">
              Provides step-by-step reasoning and detailed analysis
            </p>
            
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="radio"
                name="answerMode"
                value={AnswerMode.LETTER_ONLY}
                checked={answerMode === AnswerMode.LETTER_ONLY}
                onChange={() => setAnswerMode(AnswerMode.LETTER_ONLY)}
                className="h-4 w-4"
              />
              <span>Letter Only</span>
            </label>
            <p className="text-sm text-gray-500 ml-6">
              Returns just the answer letter (A, B, C, D) for notifications
            </p>
          </div>
        </div>
        
        {saveMessage && (
          <div className={`mb-4 p-2 rounded ${
            saveMessage.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {saveMessage}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
