import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In - ProNext Admin Panel"
        description="Sign in to your ProNext admin account"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
