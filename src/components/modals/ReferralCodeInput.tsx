import { useState, useEffect } from 'react';
import { Loader2, Copy, CheckCircle, AlertCircle, Share2 } from 'lucide-react';
import teamReferralService from '../../services/teamReferralService';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

// Card components
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

interface ReferralCodeInputProps {
  onCodeApplied?: (data: any) => void;
  onError?: (error: string) => void;
  showValidation?: boolean;
}

export const ReferralCodeInput = ({
  onCodeApplied,
  onError,
  showValidation = true,
}: ReferralCodeInputProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleValidateCode = async () => {
    if (!code.trim() || !showValidation) return;

    try {
      setValidating(true);
      setError('');
      const result = await teamReferralService.validateReferralCode(code.trim());

      if (result.success) {
        setValidationResult(result.data);
      } else {
        setError(result.message);
        setValidationResult(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to validate code');
      setValidationResult(null);
    } finally {
      setValidating(false);
    }
  };

  const handleApplyCode = async () => {
    if (!code.trim()) {
      setError('Please enter a referral code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await teamReferralService.applyReferralCode(code.trim());

      if (result.success) {
        setSuccess('Successfully joined team using referral code!');
        setCode('');
        setValidationResult(null);

        if (onCodeApplied) {
          onCodeApplied(result.data);
        }
      } else {
        const errorMsg = result.message;
        setError(errorMsg);
        if (onError) {
          onError(errorMsg);
        }
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to apply referral code';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Code Input */}
      <div className="space-y-2">
        <Label htmlFor="referralCode">Referral Code</Label>
        <div className="flex gap-2">
          <Input
            id="referralCode"
            placeholder="Enter referral code (e.g., PRO-XXXXX-XXXXXXXX)"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCode(e.target.value.toUpperCase());
              setValidationResult(null);
              setError('');
              setSuccess('');
            }}
            disabled={loading || validating}
            className="font-mono text-sm"
          />
          {showValidation && (
            <Button
              onClick={handleValidateCode}
              disabled={!code.trim() || validating}
              variant="outline"
              className="gap-2"
            >
              {validating && <Loader2 className="w-4 h-4 animate-spin" />}
              {!validating && 'Validate'}
            </Button>
          )}
          <Button
            onClick={handleApplyCode}
            disabled={!code.trim() || loading || (showValidation && !validationResult)}
            className="gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!loading && 'Apply'}
          </Button>
        </div>

        {/* Validation Messages */}
        {validating && (
          <p className="text-sm text-gray-500">Validating code...</p>
        )}

        {error && (
          <div className="flex gap-2 items-start p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex gap-2 items-start p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}
      </div>

      {/* Referrer Info Card */}
      {validationResult && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Referrer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-semibold text-gray-600">Referrer Name</p>
              <p className="text-lg">{validationResult.referrerName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Level</p>
                <p className="text-lg font-bold text-blue-600">
                  Level {validationResult.referrerLevel}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Direct Referrals</p>
                <p className="text-lg font-bold text-green-600">
                  {validationResult.directCount}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 pt-2 border-t border-blue-200">
              By applying this code, you'll be added to this referrer's team
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Component to display user's referral code and sharing options
export const MyReferralCode = ({ userId }: { userId?: string }) => {
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchReferralCode = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await teamReferralService.getMyReferralCode();

      if (result.success) {
        setReferralData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch referral code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (text: string, codeType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeType);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    fetchReferralCode();
  }, []);

  if (loading && !referralData) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-600 mt-2">Loading referral information...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!referralData) return null;

  // Smart restriction logic: Only blur one leg at a time to guide user to 2:2
  // Once BOTH legs have 2+, unlock everything (2:2 achieved)
  const leftLegCount = referralData.stats?.leftLegCount || 0;
  const rightLegCount = referralData.stats?.rightLegCount || 0;
  const binaryActivated = referralData.stats?.binaryActivated || false;
  const bothLegsHaveTwo = leftLegCount >= 2 && rightLegCount >= 2;
  const isLeftLegFull = !bothLegsHaveTwo && leftLegCount >= 2;
  const isRightLegFull = !bothLegsHaveTwo && rightLegCount >= 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Your Referral Codes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Smart Restriction Notice */}
        {(isLeftLegFull || isRightLegFull) && (
          <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white">
            <p className="text-sm font-semibold">
              🎯 Balance Your Team! {isLeftLegFull ? 'Left leg' : 'Right leg'} has 2 members. 
              Please use <strong>{isLeftLegFull ? 'Right Code (Rpro)' : 'Left Code (Lpro)'}</strong> to achieve 2:2 activation.
            </p>
          </div>
        )}
        {/* Success Notice - 2:2 Achieved */}
        {bothLegsHaveTwo && (
          <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
            <p className="text-sm font-semibold">
              🎉 2:2 Activation Achieved! Both codes are now active. You can use either code to grow your team unlimited!
            </p>
          </div>
        )}
        {/* Main Referral Code - COMMENTED OUT */}
        {/* <div className="space-y-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
          <Label className="text-green-700 dark:text-green-300 font-semibold">🔑 Main Referral Code</Label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">General team invitation code</p>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-green-300 dark:border-green-700 font-mono font-bold text-lg tracking-wider">
              {referralData.referralCode}
            </div>
            <Button
              onClick={() => handleCopyCode(referralData.referralCode, 'main')}
              variant="outline"
              className="gap-2 border-green-300 hover:bg-green-100 dark:border-green-700"
            >
              <Copy className="w-4 h-4" />
              {copiedCode === 'main' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              disabled
              value={referralData.referralLink}
              className="text-xs bg-white dark:bg-gray-800"
            />
            <Button
              onClick={() => handleCopyCode(referralData.referralLink, 'main-link')}
              variant="outline"
              size="sm"
              className="border-green-300 hover:bg-green-100 dark:border-green-700"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div> */}

        {/* Left Team Code */}
        <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800" style={{
          opacity: isLeftLegFull ? 0.5 : 1,
          pointerEvents: isLeftLegFull ? 'none' : 'auto',
          userSelect: isLeftLegFull ? 'none' : 'auto',
          transition: 'all 0.3s ease'
        }}>
          <div className="flex items-center justify-between">
            <Label className="text-blue-700 dark:text-blue-300 font-semibold">⬅️ Left Team Code (Lpro)</Label>
            {isLeftLegFull ? (
              <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">🔒 Full ({leftLegCount}/2)</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded">✅ Active ({leftLegCount})</span>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">For left position members</p>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-blue-300 dark:border-blue-700 font-mono font-bold text-lg tracking-wider" style={{
              filter: isLeftLegFull ? 'blur(4px)' : 'none'
            }}>
              {referralData.leftReferralCode}
            </div>
            <Button
              onClick={() => handleCopyCode(referralData.leftReferralCode, 'left')}
              variant="outline"
              className="gap-2 border-blue-300 hover:bg-blue-100 dark:border-blue-700"
              disabled={isLeftLegFull}
            >
              <Copy className="w-4 h-4" />
              {copiedCode === 'left' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          {isLeftLegFull && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              ⚠️ This code is disabled. Use Right Code (Rpro) to complete 2:2 activation.
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <Input
              disabled
              value={referralData.leftReferralLink}
              className="text-xs bg-white dark:bg-gray-800"
            />
            <Button
              onClick={() => handleCopyCode(referralData.leftReferralLink, 'left-link')}
              variant="outline"
              size="sm"
              className="border-blue-300 hover:bg-blue-100 dark:border-blue-700"
              disabled={isLeftLegFull}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Right Team Code */}
        <div className="space-y-2 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800" style={{
          opacity: isRightLegFull ? 0.5 : 1,
          pointerEvents: isRightLegFull ? 'none' : 'auto',
          userSelect: isRightLegFull ? 'none' : 'auto',
          transition: 'all 0.3s ease'
        }}>
          <div className="flex items-center justify-between">
            <Label className="text-orange-700 dark:text-orange-300 font-semibold">➡️ Right Team Code (Rpro)</Label>
            {isRightLegFull ? (
              <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">🔒 Full ({rightLegCount}/2)</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded">✅ Active ({rightLegCount})</span>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">For right position members</p>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-orange-300 dark:border-orange-700 font-mono font-bold text-lg tracking-wider" style={{
              filter: isRightLegFull ? 'blur(4px)' : 'none'
            }}>
              {referralData.rightReferralCode}
            </div>
            <Button
              onClick={() => handleCopyCode(referralData.rightReferralCode, 'right')}
              variant="outline"
              className="gap-2 border-orange-300 hover:bg-orange-100 dark:border-orange-700"
              disabled={isRightLegFull}
            >
              <Copy className="w-4 h-4" />
              {copiedCode === 'right' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          {isRightLegFull && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              ⚠️ This code is disabled. Use Left Code (Lpro) to complete 2:2 activation.
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <Input
              disabled
              value={referralData.rightReferralLink}
              className="text-xs bg-white dark:bg-gray-800"
            />
            <Button
              onClick={() => handleCopyCode(referralData.rightReferralLink, 'right-link')}
              variant="outline"
              size="sm"
              className="border-orange-300 hover:bg-orange-100 dark:border-orange-700"
              disabled={isRightLegFull}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm font-semibold text-gray-600">Direct Referrals</p>
            <p className="text-2xl font-bold text-blue-600">
              {referralData.stats.directCount}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Total Downline</p>
            <p className="text-2xl font-bold text-green-600">
              {referralData.stats.totalDownline}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Left Leg</p>
            <p className="text-2xl font-bold text-blue-600">
              {referralData.stats?.leftLegCount || 0}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Right Leg</p>
            <p className="text-2xl font-bold text-orange-600">
              {referralData.stats?.rightLegCount || 0}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Level</p>
            <p className="text-2xl font-bold text-purple-600">
              Level {referralData.stats.level}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600">
              ${(referralData.stats.totalEarnings || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Sponsor Info */}
        {referralData.sponsor && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <p className="font-semibold text-gray-700 mb-1">Your Sponsor</p>
            <p className="text-gray-600">{referralData.sponsor.name}</p>
          </div>
        )}

        {/* Share Instructions */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 text-sm text-blue-900 dark:text-blue-100">
          <p className="font-semibold mb-1">How to Share:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>⬅️ <strong className="text-blue-900 dark:text-blue-100">Left Code (Lpro):</strong> Place members on your left team</li>
            <li>➡️ <strong className="text-blue-900 dark:text-blue-100">Right Code (Rpro):</strong> Place members on your right team</li>
            <li>💰 You earn bonuses from their activity</li>
            <li>🚀 Your team grows with every referral!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodeInput;
