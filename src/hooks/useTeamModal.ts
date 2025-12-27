import { useState, useCallback } from 'react';
import { TeamMemberFormData } from '../components/modals/TeamModal';

export interface UseTeamModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  submitTeamMember: (data: TeamMemberFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useTeamModal = (
  onTeamMemberCreated?: (data: TeamMemberFormData) => Promise<void>
): UseTeamModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const submitTeamMember = useCallback(
    async (data: TeamMemberFormData) => {
      try {
        setIsLoading(true);
        setError(null);

        // Call the provided callback or your API
        if (onTeamMemberCreated) {
          await onTeamMemberCreated(data);
        } else {
          // Default API call to backend team controller
          const response = await fetch('/api/team/create-member', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create team member');
          }
        }

        closeModal();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onTeamMemberCreated, closeModal]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    submitTeamMember,
    isLoading,
    error,
  };
};
