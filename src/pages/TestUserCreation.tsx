import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../config/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { toast } from "sonner";
import { Users, Loader2, CheckCircle, XCircle, AlertCircle, Copy, Trash2 } from "lucide-react";

interface CreatedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  subscriptionStatus: boolean;
  teamMember?: {
    referralCode: string;
    leftReferralCode: string;
    rightReferralCode: string;
  } | null;
  sponsor?: {
    sponsorId: string;
    sponsorEmail: string;
    usedReferralCode: string;
    position: string;
  } | null;
}

interface CreationSummary {
  requested: number;
  successful: number;
  failed: number;
}

export default function TestUserCreation() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);
  const [baseEmail, setBaseEmail] = useState("testuser");
  const [baseName, setBaseName] = useState("Test User");
  const [setupReferrals, setSetupReferrals] = useState(false);
  const [masterSponsorEmail, setMasterSponsorEmail] = useState("");
  const [useLProRPro, setUseLProRPro] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>([]);
  const [summary, setSummary] = useState<CreationSummary | null>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [referralSetup, setReferralSetup] = useState<any>(null);
  const defaultPassword = "Test@123";

  const createTestUsers = async () => {
    if (count < 1 || count > 50) {
      toast.error("Count must be between 1 and 50");
      return;
    }

    setLoading(true);
    setCreatedUsers([]);
    setSummary(null);
    setErrors([]);
    setReferralSetup(null);

    try {
      const response = await axios.post(
        getApiUrl("/admin/create-test-users"),
        {
          count,
          baseEmail,
          baseName,
          setupReferrals,
          masterSponsorEmail: setupReferrals ? masterSponsorEmail : undefined,
          useLProRPro: setupReferrals ? useLProRPro : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

        setReferralSetup(response.data.data.referralSetup || null);
      if (response.data.status === "success") {
        setCreatedUsers(response.data.data.created || []);
        setSummary(response.data.data.summary);
        setErrors(response.data.data.errors || []);

        if (response.data.data.summary.successful > 0) {
          toast.success(
            `Successfully created ${response.data.data.summary.successful} test users!`
          );
        }

        if (response.data.data.summary.failed > 0) {
          toast.warning(
            `${response.data.data.summary.failed} users failed to create. Check details below.`
          );
        }
      }
    } catch (error: any) {
      console.error("Failed to create test users:", error);
      toast.error(
        error.response?.data?.message || "Failed to create test users"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const copyAllEmails = () => {
    const emails = createdUsers.map((user) => user.email).join("\n");
    navigator.clipboard.writeText(emails);
    toast.success("All emails copied to clipboard!");
  };

  const copyUserCredentials = (user: CreatedUser) => {
    const credentials = `Email: ${user.email}\nPassword: ${defaultPassword}\nReferral Code: ${user.referralCode}`;
    navigator.clipboard.writeText(credentials);
    toast.success("User credentials copied!");
  };

  return (
    <>
      <PageMeta
        title="Test User Creation - ProNet Admin Panel"
        description="Create test users for binary system testing"
      />
      <PageBreadcrumb pageTitle="Test User Creation" />

      <div className="space-y-6">
        {/* Info Banner */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Testing Tool - Binary System
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This tool creates test users with default password <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800 rounded">Test@123</code>.
                All users are automatically subscribed members ready for binary testing.
                You can then add them to LPro and RPro positions.
              </p>
            </div>
          </div>
        </div>

        {/* Creation Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Create Test Users
            </h3>
            <Users className="h-6 w-6 text-gray-400" />
          </div>

          <div className="space-y-6">
            {/* Form Inputs */}
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of Users
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Number of users (1-50)"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Max 50 users per batch
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Prefix
                </label>
                <input
                  type="text"
                  value={baseEmail}
                  onChange={(e) => setBaseEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="testuser"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Example: testuser1@test.com
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name Prefix
                </label>
                <input
                  type="text"
                  value={baseName}
                  onChange={(e) => setBaseName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Test User"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Example: Test User 1
                </p>
              </div>
            </div>

            {/* Default Password Info */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Default Password for All Users
                  </p>
                  <code className="mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-sm font-mono text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                    {defaultPassword}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(defaultPassword, "Password")}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

            {/* Referral Setup Options */}
            <div className="space-y-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="setupReferrals"
                  checked={setupReferrals}
                  onChange={(e) => setSetupReferrals(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="setupReferrals"
                  className="text-sm font-medium text-purple-900 dark:text-purple-100"
                >
                  Auto-Setup Referral Chain & Team Positions
                </label>
              </div>

              {setupReferrals && (
                <div className="ml-6 space-y-4 border-l-2 border-purple-300 pl-4 dark:border-purple-700">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-900 dark:text-purple-100">
                      Master Sponsor Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={masterSponsorEmail}
                      onChange={(e) => setMasterSponsorEmail(e.target.value)}
                      className="w-full rounded-lg border border-purple-300 bg-white px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-purple-700 dark:bg-purple-900/30 dark:text-white"
                      placeholder="mastersponsor@test.com"
                    />
                    <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
                      Leave empty for independent chain. All users will be under this sponsor if provided.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useLProRPro"
                      checked={useLProRPro}
                      onChange={(e) => setUseLProRPro(e.target.checked)}
                      disabled={!masterSponsorEmail}
                      className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <label
                      htmlFor="useLProRPro"
                      className={`text-sm ${!masterSponsorEmail ? 'text-gray-400 dark:text-gray-600' : 'text-purple-900 dark:text-purple-100'}`}
                    >
                      Use LPRO/RPRO Alternating Pattern
                    </label>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    {useLProRPro && masterSponsorEmail
                      ? "✓ Users will alternate between LPRO and RPRO positions under master sponsor"
                      : masterSponsorEmail
                      ? "Users will form a chain under master sponsor using main referral code"
                      : "Users will form an independent referral chain (each sponsors the next)"}
                  </p>
                </div>
              )}
            </div>
            </div>

            {/* Create Button */}
            <button
              onClick={createTestUsers}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 inline h-5 w-5 animate-spin" />
                  Creating Users...
                </>
              ) : (
                <>
                  <Users className="mr-2 inline h-5 w-5" />
                  Create {count} Test User{count > 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Creation Summary
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Requested</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.requested}
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm text-green-600 dark:text-green-400">Successful</p>
                <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
                  {summary.successful}
                </p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
                <p className="mt-1 text-2xl font-bold text-red-900 dark:text-red-100">
                  {summary.failed}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Referral Setup Info */}
        {referralSetup && referralSetup.enabled && (
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-800 dark:bg-purple-900/20 lg:p-6">
            <h3 className="mb-4 text-lg font-semibold text-purple-900 dark:text-purple-100">
              Referral Chain Setup
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Team Memberships Initialized
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    All users have PRO, LPRO, and RPRO referral codes
                  </p>
                </div>
              </div>
              {referralSetup.masterSponsorEmail && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Master Sponsor: {referralSetup.masterSponsorEmail}
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      All users connected under this sponsor
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Structure Pattern
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {referralSetup.structure}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Created Users Table */}
        {createdUsers.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Created Users ({createdUsers.length})
              </h3>
              <button
                onClick={copyAllEmails}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <Copy className="mr-2 inline h-4 w-4" />
                Copy All Emails
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Name
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Email
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Phone
                    </th>
                    {createdUsers.some(u => u.teamMember) && (
                      <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                        Team Codes
                      </th>
                    )}
                    {createdUsers.some(u => u.sponsor) && (
                      <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                        Position
                      </th>
                    )}
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Referral Code
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {createdUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 dark:text-white">
                            {user.email}
                          </span>
                          <button
                            onClick={() => copyToClipboard(user.email, "Email")}
                            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Copy className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                        {user.phone}
                      </td>
                      {createdUsers.some(u => u.teamMember) && (
                        <td className="py-3 text-sm">
                          {user.teamMember ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-purple-600 dark:text-purple-400">PRO:</span>
                                <code className="text-xs font-mono text-gray-900 dark:text-gray-100">
                                  {user.teamMember.referralCode.slice(0, 15)}...
                                </code>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-blue-600 dark:text-blue-400">LPRO:</span>
                                <code className="text-xs font-mono text-gray-900 dark:text-gray-100">
                                  {user.teamMember.leftReferralCode.slice(0, 14)}...
                                </code>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-green-600 dark:text-green-400">RPRO:</span>
                                <code className="text-xs font-mono text-gray-900 dark:text-gray-100">
                                  {user.teamMember.rightReferralCode.slice(0, 14)}...
                                </code>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Not initialized</span>
                          )}
                        </td>
                      )}
                      {createdUsers.some(u => u.sponsor) && (
                        <td className="py-3 text-sm">
                          {user.sponsor ? (
                            <div className="space-y-1">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                user.sponsor.position === 'left' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : user.sponsor.position === 'right'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              }`}>
                                {user.sponsor.position === 'left' ? '← LPRO' : user.sponsor.position === 'right' ? 'RPRO →' : '◆ Main'}
                              </span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                under {user.sponsor.sponsorEmail?.split('@')[0]}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">No sponsor</span>
                          )}
                        </td>
                      )}
                      <td className="py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                            {user.referralCode}
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(user.referralCode, "Referral Code")
                            }
                            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Copy className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3">
                        {user.subscriptionStatus ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Subscribed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => copyUserCredentials(user)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        >
                          Copy Credentials
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 lg:p-6">
            <h3 className="mb-4 text-lg font-semibold text-red-900 dark:text-red-100">
              Errors ({errors.length})
            </h3>
            <div className="space-y-2">
              {errors.map((error: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-white p-3 dark:border-red-800 dark:bg-red-900/10"
                >
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                      User #{error.index}
                      {error.email && ` (${error.email})`}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error.error}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            How to Use Test Users
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                1
              </div>
              <p>
                <strong className="text-gray-900 dark:text-white">Login Credentials:</strong>{" "}
                Use any created email with password <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Test@123</code>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                2
              </div>
              <p>
                <strong className="text-gray-900 dark:text-white">Binary Testing:</strong>{" "}
                Go to Team Management and add these users to LPro and RPro positions
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                3
              </div>
              <p>
                <strong className="text-gray-900 dark:text-white">Subscription Status:</strong>{" "}
                All test users are pre-subscribed and ready for commission calculations
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                4
              </div>
              <p>
                <strong className="text-gray-900 dark:text-white">Cleanup:</strong>{" "}
                Use the database cleanup script (<code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">CLEAN_DATABASE.ps1</code>) to remove all test data when done
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
