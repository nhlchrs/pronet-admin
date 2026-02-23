import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AffiliateManagement from "./components/Admin-components/admin/AffiliateManagement";
import AdminDashboard from "./components/Admin-components/admin/AdminDashboard";
import AdminAnalytics from "./components/Admin-components/admin/AdminAnalytics";
import FinanceManagement from "./components/Admin-components/admin/FinanceManagement";
import ManageBonusStructure from "./components/Admin-components/admin/ManageBonusStructure";
import AdminReports from "./components/Admin-components/admin/AdminReports";
import KYCVerification from "./components/Admin-components/admin/KYCVerification";
import TeamManagement from "./components/Admin-components/admin/TeamManagement";
import WithdrawalManagement from "./components/Admin-components/admin/WithdrawalManagement";
import ApplicationManagement from "./components/Admin-components/admin/ApplicationManagement";
import NetworkManagement from "./components/Admin-components/admin/NetworkManagement";
import EpinManagement from "./components/Admin-components/admin/EpinManagement";
import SupportTickets from "./components/Admin-components/admin/SupportTickets";
import AdminAnnouncements from "./components/Admin-components/admin/AdminAnnouncements";
import AdminUsers from "./components/Admin-components/admin/AdminUsers";
import AdminDownloads from "./components/Admin-components/admin/AdminDownloads";
import { ReferralManagementPage } from "./pages/ReferralManagementPage";
import BlockedAffiliates from "./components/Admin-components/admin/BlockedAffiliates";
import AffiliateTree from "./components/Admin-components/admin/AffiliateTree";
import AdminWallets from "./components/Admin-components/admin/AdminWallets";
import AdminMeetings from "./components/Admin-components/admin/AdminMeetings";
import AdminSettings from "./components/Admin-components/admin/AdminSettings";
import AdminPermissions from "./components/Admin-components/admin/AdminPermissions";
import AdminPaymentStatistics from "./components/Admin-components/admin/AdminPaymentStatistics";
import AdminPayouts from "./components/Admin-components/admin/AdminPayouts";
import AdminMediaUpload from "./components/Admin-components/admin/AdminMediaUpload";
import AdminRewardManagement from "./components/Admin-components/admin/AdminRewardManagement";
import TestUserCreation from "./pages/TestUserCreation";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ConfirmationProvider } from "./hooks/useConfirmation";
import ConfirmationDialog from "./components/ConfirmationDialog";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedAuthRoute from "./components/auth/ProtectedAuthRoute";

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
          <ConfirmationProvider>
            <ConfirmationDialog />
            <Router>
            <ScrollToTop />
            <Routes>
            {/* Dashboard Layout - Protected */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index path="/" element={<AdminDashboard />} />
              <Route index path="/admin/analytics" element={<AdminAnalytics />} />
              <Route index path="/admin/affiliates" element={<AffiliateManagement/>} />
              <Route path="/admin/finance" element={<FinanceManagement />} />
              <Route path="/admin/payouts" element={<AdminPayouts />} />
              <Route path="/admin/payment-statistics" element={<AdminPaymentStatistics />} />
              <Route path="/admin/bonus" element={<ManageBonusStructure />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/kyc" element={<KYCVerification />} />
              <Route path="/admin/teams" element={<TeamManagement />} />
              <Route path="/admin/withdrawals" element={<WithdrawalManagement />} />
              <Route path="/admin/applications" element={<ApplicationManagement />} />
              <Route path="/admin/network" element={<NetworkManagement />} />
              <Route path="/admin/epins" element={<EpinManagement />} />
              <Route path="/admin/support" element={<SupportTickets />} />

              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/referrals" element={<ReferralManagementPage />} />
              <Route path="/admin/downloads" element={<AdminDownloads />} />
              <Route path="/admin/blocked" element={<BlockedAffiliates />} />
              <Route path="/admin/tree" element={<AffiliateTree />} />
              <Route path="/admin/wallets" element={<AdminWallets />} />
              <Route path="/admin/meetings" element={<AdminMeetings />} />
              <Route path="/admin/rewards" element={<AdminRewardManagement />} />
              <Route path="/admin/media" element={<AdminMediaUpload />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/permissions" element={<AdminPermissions />} />
              <Route path="/admin/test-users" element={<TestUserCreation />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Auth Layout - Protected (logged-in users redirected to dashboard) */}
            <Route path="/signin" element={<ProtectedAuthRoute><SignIn /></ProtectedAuthRoute>} />
            <Route path="/signup" element={<ProtectedAuthRoute><SignUp /></ProtectedAuthRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        </ConfirmationProvider>
        </SocketProvider>
      </AuthProvider>
      </ThemeProvider>
    </>
  );
}
