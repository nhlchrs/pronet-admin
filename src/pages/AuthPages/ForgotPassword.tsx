import PageMeta from "../../components/common/PageMeta";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <>
      <PageMeta
        title="Forgot Password - ProNet Admin Panel"
        description="Reset your admin password"
      />
      <div className="relative flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-r from-brand-100 to-brand-50 dark:from-gray-900 dark:to-gray-800">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
