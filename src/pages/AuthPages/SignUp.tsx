import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up - ProNet Admin Panel"
        description="Create your ProNet admin account to manage your platform"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
