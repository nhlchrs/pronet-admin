import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../form/input/Input';
import { Label } from '../form/Label';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamMemberFormData) => Promise<void>;
  title?: string;
  submitButtonText?: string;
  initialData?: Partial<TeamMemberFormData>;
}

export interface TeamMemberFormData {
  userId: string;
  sponsorId?: string;
  packagePrice?: number;
  referralCode?: string;
}

export const TeamModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Add Team Member',
  submitButtonText = 'Add Member',
  initialData,
}: TeamModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeamMemberFormData>(
    initialData || {
      userId: '',
      sponsorId: '',
      packagePrice: 0,
      referralCode: '',
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof TeamMemberFormData, string>>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(
      initialData || {
        userId: '',
        sponsorId: '',
        packagePrice: 0,
        referralCode: '',
      }
    );
    setErrors({});
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'packagePrice' ? (value ? parseFloat(value) : 0) : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof TeamMemberFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User ID */}
          <div className="space-y-2">
            <Label htmlFor="userId">User ID *</Label>
            <Input
              id="userId"
              name="userId"
              type="text"
              placeholder="Enter user ID"
              value={formData.userId}
              onChange={handleChange}
              disabled={loading}
              className={errors.userId ? 'border-red-500' : ''}
            />
            {errors.userId && <p className="text-red-500 text-sm">{errors.userId}</p>}
          </div>

          {/* Sponsor ID */}
          <div className="space-y-2">
            <Label htmlFor="sponsorId">Sponsor ID (Upline)</Label>
            <Input
              id="sponsorId"
              name="sponsorId"
              type="text"
              placeholder="Enter sponsor/upline ID (optional)"
              value={formData.sponsorId || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Package Price */}
          <div className="space-y-2">
            <Label htmlFor="packagePrice">Package Price</Label>
            <Input
              id="packagePrice"
              name="packagePrice"
              type="number"
              placeholder="Enter package price"
              value={formData.packagePrice || 0}
              onChange={handleChange}
              disabled={loading}
              step="0.01"
              min="0"
            />
          </div>

          {/* Referral Code (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="referralCode">Referral Code</Label>
            <Input
              id="referralCode"
              name="referralCode"
              type="text"
              placeholder="Auto-generated"
              value={formData.referralCode || ''}
              disabled={true}
              className="bg-gray-100 dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500">Generated automatically on creation</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              onClick={handleClose}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
