import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";

export default function SignInForm() {
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [otpModal, setOtpModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        { email, password }
      );

      console.log("Success:", res.data);

      // If status is 1, login successful - navigate directly to dashboard
      if (res?.data?.status === 1 && res?.data?.data?.token && res?.data?.data?.user) {
        const { token, user } = res.data.data;
        
        // Store in auth context
        login(
          {
            id: user.id,
            name: `${user.fname || ''} ${user.lname || ''}`.trim(),
            email: user.email,
            role: user.role,
            phone: user.phone,
          },
          token
        );

        // Clear form and navigate to dashboard
        setEmail("");
        setPassword("");
        setOtp("");
        navigate("/");
        return;
      }

      // Otherwise show OTP modal for verification
      if (res?.data?.success) {
        setOtpModal(true); 
        return;
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    setOtpLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/verify",
        { email, otp }
      );

      console.log("OTP Verified:", res.data);
      if (res.data?.success && res.data?.data?.token) {
        const { token, user } = res.data.data;
        
        // Store in localStorage directly
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({
          id: user.id || user._id,
          name: `${user.fname || ''} ${user.lname || ''}`.trim(),
          email: user.email,
          role: user.role,
          phone: user.phone,
        }));

        // Also update auth context
        login(
          {
            id: user.id || user._id,
            name: `${user.fname || ''} ${user.lname || ''}`.trim(),
            email: user.email,
            role: user.role,
            phone: user.phone,
          },
          token
        );

        // Close modal and navigate to dashboard
        setOtpModal(false);
        setEmail("");
        setPassword("");
        setOtp("");
        
        // Use small delay to ensure state updates
        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        setOtpError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setOtpError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      {otpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm shadow-xl">

            <h2 className="text-lg font-semibold text-center">Verify OTP</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-1">
              Enter the 6-digit OTP sent to <b>{email}</b>
            </p>

            <Input
              placeholder="Enter OTP"
              maxLength={6}
              value={otp}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOtp(e.target.value)
              }
              className="mt-4"
            />

            {otpError && (
              <p className="text-red-500 text-sm text-center mt-2">{otpError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <Button
                className="w-1/2"
                variant="outline"
                onClick={() => setOtpModal(false)}
              >
                Cancel
              </Button>

              <Button className="w-1/2" onClick={handleVerifyOtp} disabled={otpLoading}>
                {otpLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign in!
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-6">

                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="text-gray-700 dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>

                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error */}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {/* Button */}
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
